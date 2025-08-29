import axios from 'axios';
import * as vscode from 'vscode';
import { ConfigurationManager } from './configurationManager';

export interface ComplexityResult {
    overallScore: number;
    cyclomaticComplexity: number;
    cognitiveComplexity: number;
    maintainabilityIndex: number;
    linesOfCode: number;
    recommendations: string[];
    issues: ComplexityIssue[];
}

export interface ComplexityIssue {
    range: vscode.Range;
    severity: 'low' | 'medium' | 'high';
    message: string;
    type: 'cognitive' | 'cyclomatic' | 'maintainability';
}

export class ComplexityAnalyzer {
    private cache = new Map<string, { result: ComplexityResult; timestamp: number }>();
    private readonly cacheTimeout = 30000; // 30 seconds

    constructor(private configManager: ConfigurationManager) {
        console.log('🔧 ComplexityAnalyzer: Constructor called');
        try {
            console.log('🔧 ComplexityAnalyzer: Cache initialized');
            console.log('🔧 ComplexityAnalyzer: Config manager assigned');
        } catch (error) {
            console.error('❌ ComplexityAnalyzer: Error in constructor:', error);
            throw error;
        }
    }

    async analyzeCode(code: string, language: string): Promise<ComplexityResult> {
        const cacheKey = this.generateCacheKey(code, language);
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.result;
        }

        try {
            const apiKey = this.configManager.getApiKey();
            if (!apiKey) {
                throw new Error('Gemini API key not configured');
            }

            const result = await this.callGeminiAPI(code, language, apiKey);
            
            // Cache the result
            this.cache.set(cacheKey, {
                result,
                timestamp: Date.now()
            });

            return result;
        } catch (error) {
            console.error('Complexity analysis failed:', error);
            return this.createFallbackResult(code);
        }
    }

    private async callGeminiAPI(code: string, language: string, apiKey: string): Promise<ComplexityResult> {
        const prompt = `Analyze the following ${language} code for complexity metrics and cognitive load:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Overall complexity score (0-100)
2. Cyclomatic complexity
3. Cognitive complexity
4. Maintainability index (0-100)
5. Lines of code count
6. Specific recommendations for reducing complexity
7. Identify complex code sections with line numbers

Respond in JSON format:
{
  "overallScore": number,
  "cyclomaticComplexity": number,
  "cognitiveComplexity": number,
  "maintainabilityIndex": number,
  "linesOfCode": number,
  "recommendations": ["recommendation1", "recommendation2"],
  "issues": [
    {
      "line": number,
      "severity": "low|medium|high",
      "message": "issue description",
      "type": "cognitive|cyclomatic|maintainability"
    }
  ]
}`;

        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                }
            }
        );

        const responseData = response.data as any;
        const content = responseData.candidates[0].content.parts[0].text;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new Error('Invalid response format from Gemini API');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return this.convertToComplexityResult(parsed, code);
    }

    private convertToComplexityResult(apiResponse: any, code: string): ComplexityResult {
        const lines = code.split('\n');
        
        return {
            overallScore: Math.min(100, Math.max(0, apiResponse.overallScore || 0)),
            cyclomaticComplexity: Math.max(0, apiResponse.cyclomaticComplexity || 0),
            cognitiveComplexity: Math.max(0, apiResponse.cognitiveComplexity || 0),
            maintainabilityIndex: Math.min(100, Math.max(0, apiResponse.maintainabilityIndex || 100)),
            linesOfCode: Math.max(0, apiResponse.linesOfCode || lines.length),
            recommendations: Array.isArray(apiResponse.recommendations) ? apiResponse.recommendations : [],
            issues: this.convertIssues(apiResponse.issues || [], lines)
        };
    }

    private convertIssues(issues: any[], lines: string[]): ComplexityIssue[] {
        return issues
            .filter(issue => issue.line && issue.line > 0 && issue.line <= lines.length)
            .map(issue => ({
                range: new vscode.Range(
                    issue.line - 1, 0,
                    issue.line - 1, lines[issue.line - 1]?.length || 0
                ),
                severity: this.validateSeverity(issue.severity),
                message: issue.message || 'Complexity issue detected',
                type: this.validateType(issue.type)
            }));
    }

    private validateSeverity(severity: string): 'low' | 'medium' | 'high' {
        return ['low', 'medium', 'high'].includes(severity) ? severity as any : 'medium';
    }

    private validateType(type: string): 'cognitive' | 'cyclomatic' | 'maintainability' {
        return ['cognitive', 'cyclomatic', 'maintainability'].includes(type) ? type as any : 'cognitive';
    }

    private createFallbackResult(code: string): ComplexityResult {
        const lines = code.split('\n');
        const linesOfCode = lines.filter(line => line.trim().length > 0).length;
        
        // Basic heuristic-based complexity calculation
        const cyclomaticComplexity = this.calculateBasicCyclomatic(code);
        const cognitiveComplexity = this.calculateBasicCognitive(code);
        const overallScore = Math.min(100, (cyclomaticComplexity + cognitiveComplexity) * 2);
        
        return {
            overallScore,
            cyclomaticComplexity,
            cognitiveComplexity,
            maintainabilityIndex: Math.max(0, 100 - overallScore),
            linesOfCode,
            recommendations: [
                'Consider breaking down large functions into smaller ones',
                'Reduce nested control structures',
                'Add comments to explain complex logic'
            ],
            issues: []
        };
    }

    private calculateBasicCyclomatic(code: string): number {
        const patterns = [
            /\bif\b/g, /\belse\b/g, /\bwhile\b/g, /\bfor\b/g,
            /\bswitch\b/g, /\bcase\b/g, /\bcatch\b/g, /\b\?\b/g
        ];
        
        let complexity = 1; // Base complexity
        for (const pattern of patterns) {
            const matches = code.match(pattern);
            if (matches) {
                complexity += matches.length;
            }
        }
        
        return complexity;
    }

    private calculateBasicCognitive(code: string): number {
        const lines = code.split('\n');
        let cognitive = 0;
        let nestingLevel = 0;
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            // Increase nesting
            if (trimmed.includes('{') || trimmed.match(/\b(if|for|while|switch)\b/)) {
                nestingLevel++;
            }
            
            // Cognitive load indicators
            if (trimmed.match(/\b(if|for|while|switch|catch)\b/)) {
                cognitive += nestingLevel;
            }
            
            // Decrease nesting
            if (trimmed.includes('}')) {
                nestingLevel = Math.max(0, nestingLevel - 1);
            }
        }
        
        return cognitive;
    }

    private generateCacheKey(code: string, language: string): string {
        // Simple hash function for caching
        let hash = 0;
        const input = code + language;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    clearCache(): void {
        this.cache.clear();
    }
}
