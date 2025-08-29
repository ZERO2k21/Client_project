import * as vscode from 'vscode';
import { ComplexityResult } from './complexityAnalyzer';

export class StatusBarManager implements vscode.Disposable {
    private statusBarItem: vscode.StatusBarItem;
    private languageStatusItem: vscode.LanguageStatusItem | undefined;

    constructor() {
        console.log('🔧 StatusBarManager: Constructor called');
        try {
            this.statusBarItem = vscode.window.createStatusBarItem(
                vscode.StatusBarAlignment.Right,
                100
            );
            console.log('🔧 StatusBarManager: Status bar item created');
            
            this.statusBarItem.command = 'cognaai.showComplexityReport';
            this.statusBarItem.show();
            console.log('🔧 StatusBarManager: Status bar item configured and shown');
        } catch (error) {
            console.error('❌ StatusBarManager: Error in constructor:', error);
            throw error;
        }
    }

    updateComplexity(result: ComplexityResult | null, languageId?: string): void {
        if (!result) {
            this.statusBarItem.text = '$(code) CognaAI';
            this.statusBarItem.tooltip = 'No complexity analysis available';
            this.statusBarItem.backgroundColor = undefined;
            this.clearLanguageStatus();
            return;
        }

        const severity = this.getSeverity(result.overallScore);
        const icon = this.getSeverityIcon(severity);
        
        this.statusBarItem.text = `${icon} ${result.overallScore}`;
        this.statusBarItem.tooltip = this.createTooltip(result);
        this.statusBarItem.backgroundColor = this.getSeverityBackground(severity);

        // Update language status item if language is provided
        if (languageId) {
            this.updateLanguageStatus(result, languageId);
        }
    }

    private updateLanguageStatus(result: ComplexityResult, languageId: string): void {
        if (this.languageStatusItem) {
            this.languageStatusItem.dispose();
        }

        this.languageStatusItem = vscode.languages.createLanguageStatusItem(
            'cognaai.complexity',
            { language: languageId }
        );

        const severity = this.getSeverity(result.overallScore);
        this.languageStatusItem.name = 'Code Complexity';
        this.languageStatusItem.text = `Complexity: ${result.overallScore}`;
        this.languageStatusItem.detail = `Cyclomatic: ${result.cyclomaticComplexity}, Cognitive: ${result.cognitiveComplexity}`;
        this.languageStatusItem.severity = this.getLanguageStatusSeverity(severity);
        this.languageStatusItem.command = {
            title: 'Show Report',
            command: 'cognaai.showComplexityReport'
        };
    }

    private clearLanguageStatus(): void {
        if (this.languageStatusItem) {
            this.languageStatusItem.dispose();
            this.languageStatusItem = undefined;
        }
    }

    private createTooltip(result: ComplexityResult): string {
        return [
            `Code Complexity Analysis`,
            `Overall Score: ${result.overallScore}`,
            `Cyclomatic Complexity: ${result.cyclomaticComplexity}`,
            `Cognitive Complexity: ${result.cognitiveComplexity}`,
            `Maintainability Index: ${result.maintainabilityIndex}`,
            `Lines of Code: ${result.linesOfCode}`,
            '',
            'Click for detailed report'
        ].join('\n');
    }

    private getSeverity(score: number): 'low' | 'medium' | 'high' {
        if (score <= 10) {
            return 'low';
        }
        if (score <= 25) {
            return 'medium';
        }
        return 'high';
    }

    private getSeverityIcon(severity: 'low' | 'medium' | 'high'): string {
        switch (severity) {
            case 'low':
                return '$(check)';
            case 'medium':
                return '$(warning)';
            case 'high':
                return '$(error)';
        }
    }

    private getSeverityBackground(severity: 'low' | 'medium' | 'high'): vscode.ThemeColor | undefined {
        switch (severity) {
            case 'high':
                return new vscode.ThemeColor('statusBarItem.errorBackground');
            case 'medium':
                return new vscode.ThemeColor('statusBarItem.warningBackground');
            default:
                return undefined;
        }
    }

    private getLanguageStatusSeverity(severity: 'low' | 'medium' | 'high'): vscode.LanguageStatusSeverity {
        switch (severity) {
            case 'high':
                return vscode.LanguageStatusSeverity.Error;
            case 'medium':
                return vscode.LanguageStatusSeverity.Warning;
            default:
                return vscode.LanguageStatusSeverity.Information;
        }
    }

    showAnalyzing(): void {
        this.statusBarItem.text = '$(loading~spin) Analyzing...';
        this.statusBarItem.tooltip = 'Analyzing code complexity';
        this.statusBarItem.backgroundColor = undefined;
    }

    showError(message: string): void {
        this.statusBarItem.text = '$(error) Error';
        this.statusBarItem.tooltip = `Error: ${message}`;
        this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    }

    hide(): void {
        this.statusBarItem.hide();
        this.clearLanguageStatus();
    }

    show(): void {
        this.statusBarItem.show();
    }

    dispose(): void {
        this.statusBarItem.dispose();
        this.clearLanguageStatus();
    }
}
