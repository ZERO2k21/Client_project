# Contributing to CognaAI

Thank you for your interest in contributing to CognaAI! This document provides guidelines for contributing to the project.

## Development Setup

1. **Prerequisites**
   - Node.js 16+ 
   - VS Code
   - Git

2. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd CognaAI
   npm install
   ```

3. **Development Commands**
   ```bash
   npm run watch     # Start development build
   npm run compile   # Build once
   npm run test      # Run tests
   npm run lint      # Lint code
   ```

## Architecture Overview

The extension is built with a modular architecture:

- **ComplexityAnalyzer**: Interfaces with Gemini API for analysis
- **ComplexityProvider**: Orchestrates the analysis workflow
- **StatusBarManager**: Manages status bar display
- **DecorationManager**: Handles code decorations and hovers
- **ConfigurationManager**: Manages extension settings

## Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm run test
   F5 # Launch Extension Development Host
   ```

4. **Submit a Pull Request**
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Reference any related issues

## Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use ESLint configuration provided

## Testing

- Write unit tests for new functionality
- Test with multiple programming languages
- Verify performance with large files
- Test API error handling scenarios

## Documentation

- Update README.md for user-facing changes
- Add inline comments for complex logic
- Update configuration documentation
- Include code examples where helpful

## Questions?

Feel free to open an issue for questions or discussions!
