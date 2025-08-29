# CognaA# CognaAI - Code Complexity Predictor

🧠 **LLM-Powered Real-Time Code Complexity Prediction for Cognitive Load Management**

CognaAI is a sophisticated VS Code extension that uses Google's Gemini API to provide real-time code complexity analysis, helping developers manage cognitive load and write more maintainable code.

![CognaAI Demo](https://via.placeholder.com/800x400/007ACC/ffffff?text=CognaAI+Demo)

## 🚀 Features

### Real-Time Analysis
- **Live complexity monitoring** as you type
- **Debounced analysis** to optimize performance
- **Intelligent caching** to reduce API calls

### Comprehensive Metrics
- **Overall Complexity Score** (0-100)
- **Cyclomatic Complexity** - measures code paths and decision points
- **Cognitive Complexity** - measures mental effort to understand code
- **Maintainability Index** - indicates code maintainability (0-100)
- **Lines of Code** - tracks code size

### Visual Feedback
- **Status Bar Integration** - shows current complexity score
- **Language Status Items** - language-specific complexity indicators
- **Code Decorations** - highlights complex code sections
- **Hover Information** - detailed complexity tooltips
- **Interactive Reports** - comprehensive analysis reports

### Smart Configuration
- **Configurable thresholds** for complexity levels
- **Language support** for popular programming languages
- **Customizable analysis delays**
- **Toggle real-time analysis**

## 🛠️ Installation

1. **Install from VS Code Marketplace** (coming soon)
   ```
   ext install cognai.code-complexity-predictor
   ```

2. **Install from VSIX**
   - Download the `.vsix` file from releases
   - Open VS Code
   - Run `Extensions: Install from VSIX...`

3. **Build from Source**
   ```bash
   git clone <repository-url>
   cd CognaAI
   npm install
   npm run compile
   ```

## ⚙️ Setup

### 1. Configure Gemini API Key

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open VS Code settings (`Ctrl+,`)
3. Search for "CognaAI"
4. Enter your API key in `CognaAI: Api Key`

**Or use the command:**
- Open Command Palette (`Ctrl+Shift+P`)
- Run `CognaAI: Configure Gemini API Key`

### 2. Customize Settings

```json
{
  "cognaai.enabled": true,
  "cognaai.analysisDelay": 1000,
  "cognaai.complexityThresholds": {
    "low": 10,
    "medium": 20,
    "high": 30
  },
  "cognaai.showInStatusBar": true,
  "cognaai.showDecorations": true,
  "cognaai.supportedLanguages": [
    "javascript",
    "typescript",
    "python",
    "java",
    "csharp",
    "cpp",
    "c"
  ]
}
```

## 🎮 Usage

### Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| `CognaAI: Analyze Code Complexity` | `Ctrl+Shift+C` | Analyze current file |
| `CognaAI: Toggle Real-time Analysis` | - | Enable/disable real-time analysis |
| `CognaAI: Show Complexity Report` | - | Show detailed complexity report |
| `CognaAI: Configure Gemini API Key` | - | Set up your API key |

### Status Bar

The status bar shows:
- ✅ **Green Check** - Low complexity (≤10)
- ⚠️ **Yellow Warning** - Medium complexity (11-25)
- ❌ **Red Error** - High complexity (>25)

### Code Decorations

Complex code sections are highlighted with:
- **Blue border** - Low complexity issues
- **Orange border** - Medium complexity issues  
- **Red border** - High complexity issues

### Hover Information

Hover over highlighted code to see:
- Issue type and severity
- Detailed explanation
- Specific recommendations

## 📊 Understanding Complexity Metrics

### Cyclomatic Complexity
- Measures the number of linearly independent paths through code
- Higher values indicate more complex control flow
- **Good**: 1-10, **Moderate**: 11-20, **High**: 21+

### Cognitive Complexity
- Measures how difficult code is to understand
- Considers nesting levels and control structures
- **Good**: 1-5, **Moderate**: 6-15, **High**: 16+

### Maintainability Index
- Composite metric indicating code maintainability
- Based on cyclomatic complexity, lines of code, and Halstead volume
- **Good**: 80-100, **Moderate**: 60-79, **Poor**: <60

### Overall Complexity Score
- Weighted combination of all metrics
- **Low**: 0-10, **Medium**: 11-25, **High**: 26+

## 🔧 Configuration Options

### Basic Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `cognaai.enabled` | `true` | Enable/disable the extension |
| `cognaai.apiKey` | `""` | Your Gemini API key |
| `cognaai.analysisDelay` | `1000` | Delay before analysis (ms) |

### Display Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `cognaai.showInStatusBar` | `true` | Show complexity in status bar |
| `cognaai.showDecorations` | `true` | Show code decorations |

### Complexity Thresholds

```json
"cognaai.complexityThresholds": {
  "low": 10,    // Low complexity threshold
  "medium": 20, // Medium complexity threshold  
  "high": 30    // High complexity threshold
}
```

### Supported Languages

```json
"cognaai.supportedLanguages": [
  "javascript",
  "typescript", 
  "python",
  "java",
  "csharp",
  "cpp",
  "c"
]
```

## 🏗️ Architecture

```
CognaAI Extension
├── 🧠 ComplexityAnalyzer     # Gemini API integration & analysis
├── 📊 ComplexityProvider     # Main orchestrator & document handling
├── 📱 StatusBarManager       # Status bar & language status items
├── 🎨 DecorationManager      # Code highlighting & hover providers  
└── ⚙️ ConfigurationManager   # Settings & preferences
```

## 🔒 Privacy & Security

- **API Keys** are stored locally in VS Code settings
- **Code content** is sent to Gemini API for analysis only
- **No persistent storage** of code or analysis results
- **Caching** is done locally for performance only

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd CognaAI

# Install dependencies
npm install

# Start development
npm run watch

# Test the extension
F5 (Launch Extension Development Host)
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for powerful LLM capabilities
- **VS Code Extension API** for excellent extensibility
- **Open Source Community** for inspiration and tools

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/CognaAI/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/your-username/CognaAI/discussions)
- 📧 **Email**: support@cognai.dev

---

**Made with ❤️ by the CognaAI team**

*Reduce cognitive load, write better code!*EADME

This is the README for your extension "CognaAI". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
