# CognaAI Changelog

All notable changes to the CognaAI extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2025-08-09

### Added
- Initial release of CognaAI - Code Complexity Predictor
- Real-time code complexity analysis using Gemini API
- Support for JavaScript, TypeScript, Python, Java, C#, C++, and C
- Visual complexity indicators in status bar and editor
- Interactive complexity reports with detailed metrics
- Configurable complexity thresholds and analysis settings
- Hover providers for detailed complexity information
- Language status items for context-aware complexity display
- Comprehensive configuration options
- Performance optimizations with intelligent caching and debouncing

### Features
- **Overall Complexity Score** - Weighted combination of all metrics (0-100)
- **Cyclomatic Complexity** - Measures code paths and decision points  
- **Cognitive Complexity** - Measures mental effort to understand code
- **Maintainability Index** - Indicates code maintainability (0-100)
- **Lines of Code** - Tracks code size and density

### Commands
- `CognaAI: Analyze Code Complexity` - Analyze current file manually
- `CognaAI: Toggle Real-time Analysis` - Enable/disable automatic analysis
- `CognaAI: Show Complexity Report` - Display detailed HTML report
- `CognaAI: Configure Gemini API Key` - Set up API authentication

### Configuration Options
- `cognaai.enabled` - Enable/disable extension
- `cognaai.apiKey` - Gemini API key for analysis
- `cognaai.analysisDelay` - Delay before analysis (ms)
- `cognaai.complexityThresholds` - Custom thresholds for complexity levels
- `cognaai.showInStatusBar` - Toggle status bar display
- `cognaai.showDecorations` - Toggle code decorations
- `cognaai.supportedLanguages` - Configure supported programming languages

### Technical Improvements
- Intelligent caching system to minimize API calls
- Debounced analysis to optimize performance
- Fallback complexity calculation for offline scenarios
- Error handling and graceful degradation
- TypeScript implementation with comprehensive type safety
- Modular architecture for maintainability and extensibility

## [0.1.0] - Future Release

### Planned
- Additional programming language support
- Custom complexity rules and metrics
- Integration with popular linters and analyzers
- Team collaboration features
- Historical complexity tracking
- Code refactoring suggestions
- Machine learning model improvements
- VS Code marketplace publication