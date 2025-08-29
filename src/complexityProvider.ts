import * as vscode from 'vscode';
import { ComplexityAnalyzer, ComplexityResult } from './complexityAnalyzer';
import { StatusBarManager } from './statusBarManager';
import { DecorationManager } from './decorationManager';
import { ConfigurationManager } from './configurationManager';

export class ComplexityProvider implements vscode.Disposable {
    private disposables: vscode.Disposable[] = [];
    private analysisTimeouts = new Map<string, NodeJS.Timeout>();
    private isRealTimeEnabled = true;
    private currentResults = new Map<string, ComplexityResult>();

    constructor(
        private analyzer: ComplexityAnalyzer,
        private statusBar: StatusBarManager,
        private decorations: DecorationManager,
        private config: ConfigurationManager
    ) {
        console.log('🔧 ComplexityProvider: Constructor called');
        try {
            console.log('🔧 ComplexityProvider: All dependencies injected successfully');
            console.log('🔧 ComplexityProvider: Real-time analysis enabled:', this.isRealTimeEnabled);
        } catch (error) {
            console.error('❌ ComplexityProvider: Error in constructor:', error);
            throw error;
        }
    }

    register(): void {
        console.log('🔧 ComplexityProvider: Register method called');
        
        try {
            // Register document change listener
            console.log('🔧 ComplexityProvider: Registering document change listener...');
            this.disposables.push(
                vscode.workspace.onDidChangeTextDocument(event => {
                    if (this.isRealTimeEnabled && this.config.isEnabled()) {
                        this.scheduleAnalysis(event.document);
                    }
                })
            );
            console.log('✅ ComplexityProvider: Document change listener registered');

            // Register active editor change listener
            console.log('🔧 ComplexityProvider: Registering active editor change listener...');
            this.disposables.push(
                vscode.window.onDidChangeActiveTextEditor(editor => {
                    if (editor) {
                        this.updateActiveEditor(editor);
                    }
                })
            );
            console.log('✅ ComplexityProvider: Active editor change listener registered');

            // Register configuration change listener
            console.log('🔧 ComplexityProvider: Registering configuration change listener...');
            this.disposables.push(
                this.config.onConfigurationChanged(() => {
                    this.onConfigurationChanged();
                })
            );
            console.log('✅ ComplexityProvider: Configuration change listener registered');

            // Register hover provider
            console.log('🔧 ComplexityProvider: Registering hover provider...');
            this.disposables.push(
                vscode.languages.registerHoverProvider(
                    { scheme: 'file' },
                    this.decorations.createComplexityHoverProvider()
                )
            );
            console.log('✅ ComplexityProvider: Hover provider registered');

            // Initial analysis of active editor
            console.log('🔧 ComplexityProvider: Checking for active editor...');
            if (vscode.window.activeTextEditor) {
                console.log('🔧 ComplexityProvider: Active editor found, updating...');
                this.updateActiveEditor(vscode.window.activeTextEditor);
            } else {
                console.log('🔧 ComplexityProvider: No active editor found');
            }
            
            console.log('✅ ComplexityProvider: Registration completed successfully');
        } catch (error) {
            console.error('❌ ComplexityProvider: Error during registration:', error);
            throw error;
        }
    }

    private scheduleAnalysis(document: vscode.TextDocument): void {
        if (!this.config.isLanguageSupported(document.languageId)) {
            return;
        }

        const uri = document.uri.toString();
        
        // Clear existing timeout
        const existingTimeout = this.analysisTimeouts.get(uri);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        // Schedule new analysis
        const timeout = setTimeout(() => {
            this.analyzeDocument(document);
            this.analysisTimeouts.delete(uri);
        }, this.config.getAnalysisDelay());

        this.analysisTimeouts.set(uri, timeout);
    }

    private async analyzeDocument(document: vscode.TextDocument): Promise<void> {
        if (!this.config.isLanguageSupported(document.languageId)) {
            return;
        }

        try {
            if (this.config.shouldShowInStatusBar()) {
                this.statusBar.showAnalyzing();
            }

            const code = document.getText();
            const result = await this.analyzer.analyzeCode(code, document.languageId);
            
            this.currentResults.set(document.uri.toString(), result);
            this.updateUI(document, result);

        } catch (error) {
            console.error('Analysis failed:', error);
            if (this.config.shouldShowInStatusBar()) {
                this.statusBar.showError(error instanceof Error ? error.message : 'Analysis failed');
            }
        }
    }

    private updateUI(document: vscode.TextDocument, result: ComplexityResult): void {
        const activeEditor = vscode.window.activeTextEditor;
        
        if (activeEditor && activeEditor.document.uri.toString() === document.uri.toString()) {
            // Update status bar
            if (this.config.shouldShowInStatusBar()) {
                this.statusBar.updateComplexity(result, document.languageId);
            }

            // Update decorations
            if (this.config.shouldShowDecorations()) {
                this.decorations.updateDecorations(activeEditor, result);
            }
        }
    }

    private updateActiveEditor(editor: vscode.TextEditor): void {
        const document = editor.document;
        const uri = document.uri.toString();
        
        if (this.config.isLanguageSupported(document.languageId)) {
            // Show existing result if available
            const existingResult = this.currentResults.get(uri);
            if (existingResult) {
                this.updateUI(document, existingResult);
            } else {
                // Start analysis for new document
                this.scheduleAnalysis(document);
            }
        } else {
            // Clear UI for unsupported languages
            this.statusBar.updateComplexity(null);
            this.decorations.clearDecorations(editor);
        }
    }

    private onConfigurationChanged(): void {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            this.updateActiveEditor(activeEditor);
        }
    }

    async analyzeActiveEditor(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor to analyze');
            return;
        }

        if (!this.config.isLanguageSupported(editor.document.languageId)) {
            vscode.window.showWarningMessage(`Language ${editor.document.languageId} is not supported for complexity analysis`);
            return;
        }

        await this.analyzeDocument(editor.document);
    }

    toggleRealTimeAnalysis(): void {
        this.isRealTimeEnabled = !this.isRealTimeEnabled;
        const status = this.isRealTimeEnabled ? 'enabled' : 'disabled';
        vscode.window.showInformationMessage(`Real-time complexity analysis ${status}`);
        
        if (!this.isRealTimeEnabled) {
            // Clear all timeouts
            for (const timeout of this.analysisTimeouts.values()) {
                clearTimeout(timeout);
            }
            this.analysisTimeouts.clear();
        }
    }

    async showComplexityReport(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor to show report for');
            return;
        }

        const uri = editor.document.uri.toString();
        const result = this.currentResults.get(uri);
        
        if (!result) {
            vscode.window.showWarningMessage('No complexity analysis available. Run analysis first.');
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'complexityReport',
            'Code Complexity Report',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.generateReportHTML(result, editor.document);
    }

    private generateReportHTML(result: ComplexityResult, document: vscode.TextDocument): string {
        const severity = this.config.getComplexitySeverity(result.overallScore);
        const severityColor = severity === 'high' ? '#f14c4c' : severity === 'medium' ? '#ff8c00' : '#28a745';
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Code Complexity Report</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    margin: 20px;
                    background-color: var(--vscode-editor-background);
                    color: var(--vscode-editor-foreground);
                }
                .header {
                    border-bottom: 2px solid var(--vscode-panel-border);
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .metric {
                    background: var(--vscode-panel-background);
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 8px;
                    padding: 15px;
                    margin: 10px 0;
                }
                .metric-title {
                    font-weight: bold;
                    font-size: 1.1em;
                    margin-bottom: 8px;
                }
                .metric-value {
                    font-size: 2em;
                    font-weight: bold;
                    color: ${severityColor};
                }
                .recommendations {
                    margin-top: 30px;
                }
                .recommendation {
                    background: var(--vscode-textCodeBlock-background);
                    padding: 10px;
                    margin: 8px 0;
                    border-radius: 4px;
                    border-left: 4px solid var(--vscode-textLink-foreground);
                }
                .issues {
                    margin-top: 30px;
                }
                .issue {
                    background: var(--vscode-panel-background);
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 4px;
                    padding: 12px;
                    margin: 10px 0;
                }
                .issue.high { border-left: 4px solid #f14c4c; }
                .issue.medium { border-left: 4px solid #ff8c00; }
                .issue.low { border-left: 4px solid #28a745; }
                .file-info {
                    background: var(--vscode-textCodeBlock-background);
                    padding: 10px;
                    border-radius: 4px;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🧠 CognaAI Code Complexity Report</h1>
                <div class="file-info">
                    <strong>File:</strong> ${document.fileName}<br>
                    <strong>Language:</strong> ${document.languageId}<br>
                    <strong>Analysis Time:</strong> ${new Date().toLocaleString()}
                </div>
            </div>

            <div class="metric">
                <div class="metric-title">Overall Complexity Score</div>
                <div class="metric-value">${result.overallScore}/100</div>
                <div>Severity: <strong style="color: ${severityColor}">${severity.toUpperCase()}</strong></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="metric">
                    <div class="metric-title">Cyclomatic Complexity</div>
                    <div class="metric-value">${result.cyclomaticComplexity}</div>
                    <div>Measures code paths and decision points</div>
                </div>

                <div class="metric">
                    <div class="metric-title">Cognitive Complexity</div>
                    <div class="metric-value">${result.cognitiveComplexity}</div>
                    <div>Measures mental effort to understand code</div>
                </div>

                <div class="metric">
                    <div class="metric-title">Maintainability Index</div>
                    <div class="metric-value">${result.maintainabilityIndex}/100</div>
                    <div>Higher values indicate better maintainability</div>
                </div>

                <div class="metric">
                    <div class="metric-title">Lines of Code</div>
                    <div class="metric-value">${result.linesOfCode}</div>
                    <div>Total non-empty lines analyzed</div>
                </div>
            </div>

            ${result.recommendations.length > 0 ? `
            <div class="recommendations">
                <h2>💡 Recommendations</h2>
                ${result.recommendations.map(rec => `<div class="recommendation">${rec}</div>`).join('')}
            </div>
            ` : ''}

            ${result.issues.length > 0 ? `
            <div class="issues">
                <h2>⚠️ Identified Issues</h2>
                ${result.issues.map(issue => `
                    <div class="issue ${issue.severity}">
                        <strong>${issue.severity.toUpperCase()} - ${issue.type.toUpperCase()}</strong><br>
                        Line ${issue.range.start.line + 1}: ${issue.message}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <div style="margin-top: 40px; text-align: center; color: var(--vscode-descriptionForeground);">
                <small>Generated by CognaAI - Powered by Gemini API</small>
            </div>
        </body>
        </html>
        `;
    }

    dispose(): void {
        // Clear all timeouts
        for (const timeout of this.analysisTimeouts.values()) {
            clearTimeout(timeout);
        }
        this.analysisTimeouts.clear();

        // Dispose all subscriptions
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];

        // Clear results
        this.currentResults.clear();
    }
}
