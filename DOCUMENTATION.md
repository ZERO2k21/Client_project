# CognaAI - LLM-Powered Real-Time Code Complexity Prediction

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Complexity Metrics Explained](#complexity-metrics-explained)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Performance & Optimization](#performance--optimization)
- [Troubleshooting](#troubleshooting)
- [Development Guide](#development-guide)
- [Contributing](#contributing)

## Overview

CognaAI is a VS Code extension that provides real-time code complexity prediction using Google's Gemini API to help developers manage cognitive load and write more maintainable code. The extension analyzes your code as you type and provides immediate visual feedback on complexity metrics.

### Why CognaAI?
- **Cognitive Load Management**: Helps developers understand when code becomes too complex
- **Real-time Feedback**: Instant analysis without interrupting your workflow
- **AI-Enhanced Analysis**: Leverages Gemini API for context-aware complexity assessment
- **Multi-language Support**: Works with JavaScript, TypeScript, Python, Java, C#, C++, and C
- **Visual Indicators**: Clear status bar updates, decorations, and detailed reports

## Features

### Core Features
- ✅ **Real-time Complexity Analysis**: Continuous monitoring of code complexity as you type
- ✅ **Three Complexity Metrics**: Cyclomatic, Cognitive, and Maintainability Index
- ✅ **Visual Feedback System**: Status bar indicators, code decorations, and hover tooltips
- ✅ **AI-Enhanced Insights**: Gemini API integration for advanced analysis
- ✅ **Performance Optimized**: Smart caching and debouncing for smooth experience
- ✅ **Configurable Thresholds**: Customizable complexity warning levels
- ✅ **Multi-language Support**: Supports 7 popular programming languages
- ✅ **Detailed Reports**: Interactive HTML reports with actionable recommendations

### Visual Indicators
- **Status Bar**: Shows current complexity level with color-coded indicators
- **Code Decorations**: Highlights complex code sections directly in the editor
- **Hover Tooltips**: Detailed complexity information on hover
- **HTML Reports**: Comprehensive analysis reports with recommendations

## Installation & Setup

### Prerequisites
- VS Code 1.90.0 or higher
- Node.js 18.0 or higher
- Google Gemini API key

### Installation Steps

1. **Clone or Download the Extension**
   ```powershell
   git clone <repository-url>
   cd Client_project
   ```

2. **Install Dependencies**
   ```powershell
   npm install
   ```

3. **Compile the Extension**
   ```powershell
   npm run compile
   ```

4. **Launch Extension Development Host**
   - Press `F5` in VS Code
   - Or run: `npm run watch` and then press `F5`

5. **Configure Gemini API Key**
   - Open Command Palette (`Ctrl+Shift+P`)
   - Run: `CognaAI: Configure Gemini API Key`
   - Enter your Gemini API key when prompted

### Getting a Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" and create a new key
4. Copy the generated API key
5. Use the `CognaAI: Configure Gemini API Key` command in VS Code

## Usage Guide

### Basic Usage

1. **Open a Supported File**
   - Open any `.js`, `.ts`, `.py`, `.java`, `.cs`, `.cpp`, or `.c` file
   - The extension automatically activates for these file types

2. **Monitor Complexity**
   - The status bar shows current complexity level
   - Color indicators: 🟢 Low, 🟡 Medium, 🔴 High complexity

3. **View Detailed Analysis**
   - Hover over code sections for detailed metrics
   - Use `CognaAI: Generate Complexity Report` for full analysis

### Available Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| `CognaAI: Analyze Current File` | Run immediate complexity analysis | - |
| `CognaAI: Toggle Real-time Analysis` | Enable/disable automatic analysis | - |
| `CognaAI: Generate Complexity Report` | Create detailed HTML report | - |
| `CognaAI: Configure Gemini API Key` | Set up or change API key | - |

### Keyboard Shortcuts
Currently, no default keyboard shortcuts are assigned. You can add custom shortcuts via:
1. `File` → `Preferences` → `Keyboard Shortcuts`
2. Search for "CognaAI"
3. Assign your preferred shortcuts

## Complexity Metrics Explained

### 1. Cyclomatic Complexity
**Definition**: Measures the number of linearly independent paths through code.

**Calculation**:
- Base complexity: 1
- +1 for each: `if`, `else if`, `while`, `for`, `switch`, `case`, `catch`, `&&`, `||`, `? :`

**Example**:
```javascript
function example(x) {        // Base: 1
    if (x > 0) {            // +1 = 2
        for (let i = 0; i < x; i++) {  // +1 = 3
            if (i % 2 === 0) {         // +1 = 4
                console.log(i);
            }
        }
    }
    return x;
}
// Cyclomatic Complexity: 4
```

**Thresholds**:
- 1-10: Low complexity (🟢)
- 11-20: Medium complexity (🟡)
- 21+: High complexity (🔴)

### 2. Cognitive Complexity
**Definition**: Measures how difficult code is to understand, accounting for nesting.

**Calculation**:
- Each control structure adds points equal to its nesting level
- Deeper nesting = higher cognitive load

**Example**:
```javascript
function example(items) {
    if (items.length > 0) {           // +1 (nesting: 1)
        for (let item of items) {     // +2 (nesting: 2)
            if (item.valid) {         // +3 (nesting: 3)
                if (item.active) {    // +4 (nesting: 4)
                    process(item);
                }
            }
        }
    }
}
// Cognitive Complexity: 10
```

**Thresholds**:
- 1-15: Low complexity (🟢)
- 16-25: Medium complexity (🟡)
- 26+: High complexity (🔴)

### 3. Maintainability Index
**Definition**: Composite metric indicating how maintainable code is (0-100).

**Calculation**:
```
overallScore = (cyclomatic × 2) + (cognitive × 1.5)
maintainabilityIndex = max(0, 100 - overallScore)
```

**Interpretation**:
- 90-100: Highly maintainable (🟢)
- 70-89: Moderately maintainable (🟡)
- 50-69: Difficult to maintain (🟡)
- 0-49: Very difficult to maintain (🔴)

## Configuration

### Extension Settings

Access settings via `File` → `Preferences` → `Settings`, then search for "CognaAI":

| Setting | Default | Description |
|---------|---------|-------------|
| `cognaai.cyclomaticThreshold` | 15 | Warning threshold for cyclomatic complexity |
| `cognaai.cognitiveThreshold` | 20 | Warning threshold for cognitive complexity |
| `cognaai.maintainabilityThreshold` | 70 | Minimum maintainability index |
| `cognaai.enableRealTimeAnalysis` | true | Enable automatic analysis on file changes |
| `cognaai.debounceDelay` | 1000 | Delay (ms) before analyzing after typing stops |
| `cognaai.enableDecorations` | true | Show complexity decorations in editor |
| `cognaai.enableStatusBar` | true | Show complexity in status bar |
| `cognaai.cacheEnabled` | true | Enable analysis result caching |
| `cognaai.maxCacheSize` | 100 | Maximum number of cached analyses |

### API Configuration

#### Setting Up Gemini API
1. **Via Command**: Use `CognaAI: Configure Gemini API Key`
2. **Via Settings**: Add to `settings.json`:
   ```json
   {
     "cognaai.geminiApiKey": "your-api-key-here"
   }
   ```

#### API Rate Limits
- Free tier: 60 requests per minute
- Paid tier: Higher limits available
- The extension includes automatic retry logic with exponential backoff

## Architecture

### Component Overview

```
CognaAI Extension
├── Extension Entry Point (extension.ts)
├── Core Components
│   ├── ComplexityAnalyzer (complexityAnalyzer.ts)
│   ├── ComplexityProvider (complexityProvider.ts)
│   ├── StatusBarManager (statusBarManager.ts)
│   ├── DecorationManager (decorationManager.ts)
│   └── ConfigurationManager (configurationManager.ts)
├── Analysis Engine
│   ├── Local Pattern Analysis
│   └── AI-Enhanced Analysis (Gemini API)
└── UI Components
    ├── Status Bar Indicators
    ├── Code Decorations
    ├── Hover Providers
    └── HTML Reports
```

### Data Flow

1. **File Change Detection**: Document change events trigger analysis
2. **Debouncing**: Changes are debounced to avoid excessive API calls
3. **Cache Check**: System checks if analysis is already cached
4. **Local Analysis**: Basic complexity metrics calculated locally
5. **AI Analysis**: Enhanced analysis via Gemini API (if API key configured)
6. **Result Processing**: Metrics are validated and normalized
7. **UI Updates**: Status bar, decorations, and hovers are updated
8. **Caching**: Results are cached for future use

### File Structure

```
src/
├── extension.ts              # Main extension entry point
├── complexityAnalyzer.ts     # Core analysis logic and Gemini API integration
├── complexityProvider.ts     # Orchestrates analysis workflow
├── statusBarManager.ts       # Status bar UI management
├── decorationManager.ts      # Code decoration system
└── configurationManager.ts   # Settings and configuration
example/
├── complex-demo.js           # JavaScript complexity examples
└── complex-demo.py           # Python complexity examples
```

## API Reference

### ComplexityAnalyzer

#### Methods

**`analyzeComplexity(code: string, language: string): Promise<ComplexityResult>`**
- Analyzes code complexity using both local and AI-enhanced methods
- Parameters:
  - `code`: Source code to analyze
  - `language`: Programming language (js, ts, py, java, cs, cpp, c)
- Returns: Promise resolving to ComplexityResult

**`analyzeWithGemini(code: string, language: string): Promise<ComplexityResult>`**
- Performs AI-enhanced analysis using Gemini API
- Requires valid API key configuration
- Returns enhanced complexity metrics with recommendations

#### Types

```typescript
interface ComplexityResult {
    cyclomaticComplexity: number;
    cognitiveComplexity: number;
    maintainabilityIndex: number;
    recommendations: string[];
    confidence: number;
    issues: ComplexityIssue[];
}

interface ComplexityIssue {
    line: number;
    message: string;
    severity: 'info' | 'warning' | 'error';
    type: 'cognitive' | 'cyclomatic' | 'maintainability';
}
```

### ComplexityProvider

#### Methods

**`enableRealTimeAnalysis(): void`**
- Enables automatic complexity analysis on document changes

**`disableRealTimeAnalysis(): void`**
- Disables automatic analysis

**`analyzeCurrentDocument(): Promise<void>`**
- Manually triggers analysis of the currently active document

### ConfigurationManager

#### Methods

**`getCyclomaticThreshold(): number`**
- Returns current cyclomatic complexity warning threshold

**`setCyclomaticThreshold(value: number): void`**
- Updates cyclomatic complexity threshold

**`getGeminiApiKey(): string | undefined`**
- Returns configured Gemini API key

**`setGeminiApiKey(apiKey: string): Promise<void>`**
- Securely stores Gemini API key

## Performance & Optimization

### Caching Strategy
- **LRU Cache**: Least Recently Used cache with configurable size
- **Cache Keys**: Based on code content hash and language
- **Cache Invalidation**: Automatic cleanup of stale entries
- **Memory Management**: Configurable cache size limits

### Debouncing
- **Default Delay**: 1000ms after typing stops
- **Configurable**: Adjustable via settings
- **Smart Triggering**: Only analyzes when meaningful changes occur

### API Optimization
- **Request Batching**: Multiple small changes are batched
- **Retry Logic**: Automatic retry with exponential backoff
- **Rate Limiting**: Respects API rate limits
- **Fallback**: Local analysis when API is unavailable

### Resource Management
- **Memory Usage**: Efficient caching and cleanup
- **CPU Usage**: Debounced analysis to prevent excessive computation
- **Network Usage**: Minimal API calls with intelligent caching

## Troubleshooting

### Common Issues

#### Extension Not Loading
**Symptoms**: CognaAI commands not available in Command Palette

**Solutions**:
1. Check VS Code version (requires 1.90.0+)
2. Verify extension compilation: `npm run compile`
3. Check developer console for errors: `Help` → `Toggle Developer Tools`
4. Restart VS Code Extension Development Host

#### API Key Issues
**Symptoms**: "API key not configured" errors

**Solutions**:
1. Run `CognaAI: Configure Gemini API Key`
2. Verify API key validity at [Google AI Studio](https://aistudio.google.com/)
3. Check internet connectivity
4. Verify API quota limits

#### Performance Issues
**Symptoms**: VS Code becomes slow or unresponsive

**Solutions**:
1. Increase debounce delay: `cognaai.debounceDelay`
2. Reduce cache size: `cognaai.maxCacheSize`
3. Disable real-time analysis temporarily
4. Check for large files (>10,000 lines)

#### Incorrect Analysis Results
**Symptoms**: Complexity metrics seem wrong

**Solutions**:
1. Clear cache: Restart VS Code
2. Verify file language is supported
3. Check for syntax errors in code
4. Report issue with code sample

### Debug Mode

Enable detailed logging by adding to `settings.json`:
```json
{
  "cognaai.debug": true
}
```

Check logs in:
- Developer Console: `Help` → `Toggle Developer Tools` → `Console`
- Output Panel: `View` → `Output` → Select "CognaAI" channel

### Performance Monitoring

Monitor extension performance:
1. Open `Help` → `Toggle Developer Tools`
2. Go to `Performance` tab
3. Record while using the extension
4. Look for CognaAI-related activity

## Development Guide

### Setting Up Development Environment

1. **Prerequisites**
   ```powershell
   node --version  # Should be 18.0+
   npm --version   # Should be 8.0+
   ```

2. **Clone and Install**
   ```powershell
   git clone <repository-url>
   cd Client_project
   npm install
   ```

3. **Development Workflow**
   ```powershell
   # Start watch mode
   npm run watch
   
   # In VS Code, press F5 to launch Extension Development Host
   ```

4. **Testing**
   ```powershell
   # Run unit tests
   npm test
   
   # Run integration tests
   npm run test:integration
   ```

### Code Structure Guidelines

#### TypeScript Configuration
- Strict type checking enabled
- ES2020 target for modern JavaScript features
- CommonJS modules for VS Code compatibility

#### Error Handling
- All async operations use try-catch blocks
- Graceful degradation when API is unavailable
- User-friendly error messages

#### Performance Best Practices
- Debounce rapid changes
- Use efficient caching strategies
- Minimize API calls
- Lazy load heavy components

### Adding New Language Support

1. **Update Language Detection**
   ```typescript
   // In complexityAnalyzer.ts
   private getSupportedLanguages(): string[] {
       return ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'c', 'newlang'];
   }
   ```

2. **Add Pattern Matching**
   ```typescript
   // Add language-specific patterns
   private getControlPatterns(language: string): RegExp {
       switch (language) {
           case 'newlang':
               return /\b(if|for|while|switch|case|catch)\b/g;
           // ... other cases
       }
   }
   ```

3. **Update Package.json**
   ```json
   {
     "activationEvents": [
       "onLanguage:newlang"
     ]
   }
   ```

### Testing Guidelines

#### Unit Tests
- Test each component in isolation
- Mock external dependencies
- Verify edge cases and error conditions

#### Integration Tests
- Test component interactions
- Verify API integration
- Test with real code samples

#### Manual Testing
- Test with various file sizes
- Verify performance with large files
- Test API error scenarios

## Contributing

### Contribution Guidelines

1. **Fork the Repository**
   - Create a personal fork of the project
   - Clone your fork locally

2. **Create Feature Branch**
   ```powershell
   git checkout -b feature/your-feature-name
   ```

3. **Development Standards**
   - Follow TypeScript best practices
   - Add unit tests for new functionality
   - Update documentation for user-facing changes
   - Follow existing code style and conventions

4. **Testing**
   - Run all tests: `npm test`
   - Test with Extension Development Host
   - Verify with example files

5. **Submit Pull Request**
   - Clear description of changes
   - Reference related issues
   - Include testing steps

### Code Style

- **TypeScript**: Strict typing, explicit return types
- **Formatting**: Prettier with default settings
- **Naming**: PascalCase for classes, camelCase for methods/variables
- **Comments**: JSDoc for public APIs, inline for complex logic

### Reporting Issues

When reporting issues, include:
- VS Code version
- Extension version
- Operating system
- Code sample that demonstrates the issue
- Expected vs actual behavior
- Console error messages (if any)

### Feature Requests

For feature requests, provide:
- Clear description of the feature
- Use case and motivation
- Proposed implementation approach
- Potential impact on performance

---

## License

This project is licensed under the MIT License. See `LICENSE` file for details.

## Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: This comprehensive guide
- **Examples**: Check the `example/` directory for sample files

## Changelog

### Version 1.0.0 (Initial Release)
- ✅ Real-time complexity analysis
- ✅ Gemini API integration
- ✅ Multi-language support
- ✅ Visual feedback system
- ✅ Configurable thresholds
- ✅ Performance optimization
- ✅ Comprehensive documentation

---

*Last updated: August 29, 2025*
