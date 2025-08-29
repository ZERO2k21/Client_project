import * as vscode from 'vscode';
import { ComplexityAnalyzer } from './complexityAnalyzer';
import { ComplexityProvider } from './complexityProvider';
import { StatusBarManager } from './statusBarManager';
import { DecorationManager } from './decorationManager';
import { ConfigurationManager } from './configurationManager';

console.log('🔥 CognaAI Extension: Module loading started');
console.log('🔥 VS Code API version:', vscode.version);

let complexityAnalyzer: ComplexityAnalyzer;
let complexityProvider: ComplexityProvider;
let statusBarManager: StatusBarManager;
let decorationManager: DecorationManager;
let configurationManager: ConfigurationManager;

console.log('🔥 CognaAI Extension: Global variables declared');

export function activate(context: vscode.ExtensionContext) {
	console.log('🚀 ===== CognaAI ACTIVATION STARTED =====');
	console.log('🚀 Extension ID:', context.extension.id);
	console.log('🚀 Extension path:', context.extensionPath);
	console.log('🚀 Extension version:', context.extension.packageJSON.version);
	console.log('🚀 VS Code version:', vscode.version);
	console.log('🚀 Workspace folders:', vscode.workspace.workspaceFolders?.length || 0);

	try {
		console.log('🔧 Step 1: Initializing ConfigurationManager...');
		configurationManager = new ConfigurationManager();
		console.log('✅ ConfigurationManager initialized');

		console.log('🔧 Step 2: Initializing ComplexityAnalyzer...');
		complexityAnalyzer = new ComplexityAnalyzer(configurationManager);
		console.log('✅ ComplexityAnalyzer initialized');

		console.log('🔧 Step 3: Initializing StatusBarManager...');
		statusBarManager = new StatusBarManager();
		console.log('✅ StatusBarManager initialized');

		console.log('🔧 Step 4: Initializing DecorationManager...');
		decorationManager = new DecorationManager();
		console.log('✅ DecorationManager initialized');

		console.log('🔧 Step 5: Initializing ComplexityProvider...');
		complexityProvider = new ComplexityProvider(
			complexityAnalyzer,
			statusBarManager,
			decorationManager,
			configurationManager
		);
		console.log('✅ ComplexityProvider initialized');

		console.log('🔧 Step 6: Registering commands...');
		
		const analyzeCommand = vscode.commands.registerCommand('cognaai.analyzeComplexity', () => {
			console.log('🔍 Command triggered: cognaai.analyzeComplexity');
			try {
				complexityProvider.analyzeActiveEditor();
				console.log('✅ Analyze command executed successfully');
			} catch (error) {
				console.error('❌ Error in analyze command:', error);
			}
		});
		console.log('✅ Registered command: cognaai.analyzeComplexity');

		const toggleCommand = vscode.commands.registerCommand('cognaai.toggleAnalysis', () => {
			console.log('🔄 Command triggered: cognaai.toggleAnalysis');
			try {
				complexityProvider.toggleRealTimeAnalysis();
				console.log('✅ Toggle command executed successfully');
			} catch (error) {
				console.error('❌ Error in toggle command:', error);
			}
		});
		console.log('✅ Registered command: cognaai.toggleAnalysis');

		const reportCommand = vscode.commands.registerCommand('cognaai.showComplexityReport', () => {
			console.log('📊 Command triggered: cognaai.showComplexityReport');
			try {
				complexityProvider.showComplexityReport();
				console.log('✅ Report command executed successfully');
			} catch (error) {
				console.error('❌ Error in report command:', error);
			}
		});
		console.log('✅ Registered command: cognaai.showComplexityReport');

		const configureApiKeyCommand = vscode.commands.registerCommand('cognaai.configureApiKey', async () => {
			console.log('🔑 Command triggered: cognaai.configureApiKey');
			try {
				const apiKey = await vscode.window.showInputBox({
					prompt: 'Enter your Gemini API key',
					password: true,
					placeHolder: 'Your Gemini API key'
				});
				
				if (apiKey) {
					await configurationManager.updateApiKey(apiKey);
					vscode.window.showInformationMessage('✅ API key configured successfully!');
					console.log('✅ API key configured successfully');
				} else {
					console.log('⚠️ API key configuration cancelled');
				}
			} catch (error) {
				console.error('❌ Error in configure API key command:', error);
			}
		});
		console.log('✅ Registered command: cognaai.configureApiKey');

		console.log('🔧 Step 7: Registering providers...');
		complexityProvider.register();
		console.log('✅ Complexity provider registered');

		console.log('🔧 Step 8: Adding to subscriptions...');
		context.subscriptions.push(
			analyzeCommand,
			toggleCommand,
			reportCommand,
			configureApiKeyCommand,
			complexityProvider,
			statusBarManager,
			decorationManager
		);
		console.log('✅ All subscriptions added');

		console.log('🔧 Step 9: Showing welcome message...');
		vscode.window.showInformationMessage('🧠 CognaAI is ready! Configure your Gemini API key to start analyzing code complexity.');
		console.log('✅ Welcome message shown');

		console.log('🎉 ===== CognaAI ACTIVATION COMPLETED SUCCESSFULLY =====');

		// Test command registration
		setTimeout(() => {
			console.log('🧪 Testing command registration...');
			vscode.commands.getCommands(true).then(commands => {
				const cognaCommands = commands.filter(cmd => cmd.startsWith('cognaai.'));
				console.log('🧪 Registered CognaAI commands:', cognaCommands);
				console.log('🧪 Total commands in VS Code:', commands.length);
			});
		}, 1000);

	} catch (error) {
		console.error('💥 ===== CRITICAL ERROR DURING ACTIVATION =====');
		console.error('❌ Error details:', error);
		console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
		vscode.window.showErrorMessage(`CognaAI activation failed: ${error}`);
	}
}

export function deactivate() {
	console.log('🛑 ===== CognaAI DEACTIVATION STARTED =====');
	
	try {
		if (complexityProvider) {
			console.log('🧹 Disposing ComplexityProvider...');
			complexityProvider.dispose();
			console.log('✅ ComplexityProvider disposed');
		}
		
		if (statusBarManager) {
			console.log('🧹 Disposing StatusBarManager...');
			statusBarManager.dispose();
			console.log('✅ StatusBarManager disposed');
		}
		
		if (decorationManager) {
			console.log('🧹 Disposing DecorationManager...');
			decorationManager.dispose();
			console.log('✅ DecorationManager disposed');
		}

		console.log('🛑 ===== CognaAI DEACTIVATION COMPLETED =====');
	} catch (error) {
		console.error('❌ Error during deactivation:', error);
	}
}

console.log('🔥 CognaAI Extension: Module loading completed');
