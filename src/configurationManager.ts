import * as vscode from 'vscode';

export interface ComplexityThresholds {
    low: number;
    medium: number;
    high: number;
}

export class ConfigurationManager {
    private static readonly CONFIG_SECTION = 'cognaai';

    constructor() {
        console.log('🔧 ConfigurationManager: Constructor called');
        try {
            const config = this.getConfiguration();
            console.log('🔧 ConfigurationManager: Initial config loaded successfully');
            console.log('🔧 ConfigurationManager: Enabled:', this.isEnabled());
            console.log('🔧 ConfigurationManager: API key configured:', !!this.getApiKey());
        } catch (error) {
            console.error('❌ ConfigurationManager: Error in constructor:', error);
            throw error;
        }
    }

    getConfiguration(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration(ConfigurationManager.CONFIG_SECTION);
    }

    isEnabled(): boolean {
        return this.getConfiguration().get<boolean>('enabled', true);
    }

    getApiKey(): string {
        return this.getConfiguration().get<string>('apiKey', '');
    }

    async updateApiKey(apiKey: string): Promise<void> {
        await this.getConfiguration().update('apiKey', apiKey, vscode.ConfigurationTarget.Global);
    }

    getAnalysisDelay(): number {
        return this.getConfiguration().get<number>('analysisDelay', 1000);
    }

    getComplexityThresholds(): ComplexityThresholds {
        return this.getConfiguration().get<ComplexityThresholds>('complexityThresholds', {
            low: 10,
            medium: 20,
            high: 30
        });
    }

    shouldShowInStatusBar(): boolean {
        return this.getConfiguration().get<boolean>('showInStatusBar', true);
    }

    shouldShowDecorations(): boolean {
        return this.getConfiguration().get<boolean>('showDecorations', true);
    }

    getSupportedLanguages(): string[] {
        return this.getConfiguration().get<string[]>('supportedLanguages', [
            'javascript',
            'typescript',
            'python',
            'java',
            'csharp',
            'cpp',
            'c'
        ]);
    }

    isLanguageSupported(languageId: string): boolean {
        return this.getSupportedLanguages().includes(languageId);
    }

    onConfigurationChanged(callback: () => void): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(ConfigurationManager.CONFIG_SECTION)) {
                callback();
            }
        });
    }

    getComplexitySeverity(score: number): 'low' | 'medium' | 'high' {
        const thresholds = this.getComplexityThresholds();
        
        if (score <= thresholds.low) {
            return 'low';
        } else if (score <= thresholds.medium) {
            return 'medium';
        } else {
            return 'high';
        }
    }

    getStatusBarText(score: number): string {
        const severity = this.getComplexitySeverity(score);
        const icon = this.getSeverityIcon(severity);
        return `${icon} Complexity: ${score}`;
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
}
