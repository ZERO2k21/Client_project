import * as vscode from 'vscode';
import { ComplexityResult, ComplexityIssue } from './complexityAnalyzer';

export class DecorationManager implements vscode.Disposable {
    private lowComplexityDecoration!: vscode.TextEditorDecorationType;
    private mediumComplexityDecoration!: vscode.TextEditorDecorationType;
    private highComplexityDecoration!: vscode.TextEditorDecorationType;
    private activeDecorations = new Map<vscode.TextEditor, vscode.TextEditorDecorationType[]>();

    constructor() {
        console.log('🔧 DecorationManager: Constructor called');
        try {
            this.createDecorationTypes();
            console.log('🔧 DecorationManager: Decoration types created successfully');
        } catch (error) {
            console.error('❌ DecorationManager: Error in constructor:', error);
            throw error;
        }
    }

    private createDecorationTypes(): void {
        this.lowComplexityDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editorInfo.background'),
            border: '1px solid',
            borderColor: new vscode.ThemeColor('editorInfo.foreground'),
            isWholeLine: true,
            overviewRulerColor: new vscode.ThemeColor('editorInfo.foreground'),
            overviewRulerLane: vscode.OverviewRulerLane.Right
        });

        this.mediumComplexityDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editorWarning.background'),
            border: '1px solid',
            borderColor: new vscode.ThemeColor('editorWarning.foreground'),
            isWholeLine: true,
            overviewRulerColor: new vscode.ThemeColor('editorWarning.foreground'),
            overviewRulerLane: vscode.OverviewRulerLane.Right
        });

        this.highComplexityDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editorError.background'),
            border: '1px solid',
            borderColor: new vscode.ThemeColor('editorError.foreground'),
            isWholeLine: true,
            overviewRulerColor: new vscode.ThemeColor('editorError.foreground'),
            overviewRulerLane: vscode.OverviewRulerLane.Right
        });
    }

    updateDecorations(editor: vscode.TextEditor, result: ComplexityResult | null): void {
        this.clearDecorations(editor);

        if (!result || !result.issues.length) {
            return;
        }

        const lowRanges: vscode.DecorationOptions[] = [];
        const mediumRanges: vscode.DecorationOptions[] = [];
        const highRanges: vscode.DecorationOptions[] = [];

        for (const issue of result.issues) {
            const decorationOption: vscode.DecorationOptions = {
                range: issue.range,
                hoverMessage: this.createHoverMessage(issue)
            };

            switch (issue.severity) {
                case 'low':
                    lowRanges.push(decorationOption);
                    break;
                case 'medium':
                    mediumRanges.push(decorationOption);
                    break;
                case 'high':
                    highRanges.push(decorationOption);
                    break;
            }
        }

        editor.setDecorations(this.lowComplexityDecoration, lowRanges);
        editor.setDecorations(this.mediumComplexityDecoration, mediumRanges);
        editor.setDecorations(this.highComplexityDecoration, highRanges);

        // Track decorations for cleanup
        this.activeDecorations.set(editor, [
            this.lowComplexityDecoration,
            this.mediumComplexityDecoration,
            this.highComplexityDecoration
        ]);
    }

    private createHoverMessage(issue: ComplexityIssue): vscode.MarkdownString {
        const markdown = new vscode.MarkdownString();
        markdown.isTrusted = true;
        
        markdown.appendMarkdown(`**${this.capitalizeFirst(issue.severity)} Complexity Issue**\n\n`);
        markdown.appendMarkdown(`**Type:** ${this.capitalizeFirst(issue.type)}\n\n`);
        markdown.appendMarkdown(`**Issue:** ${issue.message}\n\n`);
        
        // Add recommendations based on issue type
        const recommendations = this.getRecommendations(issue.type);
        if (recommendations.length > 0) {
            markdown.appendMarkdown(`**Recommendations:**\n\n`);
            recommendations.forEach(rec => {
                markdown.appendMarkdown(`• ${rec}\n`);
            });
        }

        return markdown;
    }

    private getRecommendations(type: string): string[] {
        switch (type) {
            case 'cognitive':
                return [
                    'Break down complex nested structures',
                    'Extract complex conditions into named functions',
                    'Use early returns to reduce nesting',
                    'Consider using switch statements for multiple conditions'
                ];
            case 'cyclomatic':
                return [
                    'Split large functions into smaller ones',
                    'Reduce the number of decision points',
                    'Use polymorphism instead of complex conditionals',
                    'Consider using strategy pattern for complex logic'
                ];
            case 'maintainability':
                return [
                    'Add meaningful comments and documentation',
                    'Use descriptive variable and function names',
                    'Remove duplicate code',
                    'Follow consistent coding standards'
                ];
            default:
                return [];
        }
    }

    private capitalizeFirst(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    clearDecorations(editor: vscode.TextEditor): void {
        const decorations = this.activeDecorations.get(editor);
        if (decorations) {
            decorations.forEach(decoration => {
                editor.setDecorations(decoration, []);
            });
            this.activeDecorations.delete(editor);
        }
    }

    clearAllDecorations(): void {
        for (const [editor] of this.activeDecorations) {
            this.clearDecorations(editor);
        }
    }

    createComplexityHoverProvider(): vscode.HoverProvider {
        return {
            provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
                // This could be enhanced to show complexity information for specific code sections
                const markdown = new vscode.MarkdownString();
                markdown.appendMarkdown('**CognaAI Code Complexity Analysis**\n\n');
                markdown.appendMarkdown('Run complexity analysis to see detailed metrics for this code section.');
                
                return new vscode.Hover(markdown);
            }
        };
    }

    dispose(): void {
        this.clearAllDecorations();
        this.lowComplexityDecoration.dispose();
        this.mediumComplexityDecoration.dispose();
        this.highComplexityDecoration.dispose();
    }
}
