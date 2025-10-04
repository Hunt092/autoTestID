# Contributing to autoTestID

Thank you for your interest in contributing to autoTestID! This document provides guidelines for contributing to this ESLint plugin.

## Development Setup

1. **Fork the repository**

   - Click the "Fork" button on GitHub
   - Clone your fork: `git clone https://github.com/your-username/autoTestID.git`

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run tests**

   ```bash
   pnpm test
   ```

4. **Run linting**
   ```bash
   pnpm lint
   ```

## Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**

   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**

   ```bash
   pnpm test
   pnpm lint
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m 'Add amazing feature'
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch and fill out the PR template

## Code Style

- Follow existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Ensure all tests pass
- Update documentation for new features

## Testing

- Add tests for new functionality
- Ensure existing tests still pass
- Test with different ESLint configurations
- Test with various React component patterns

## Reporting Issues

When reporting issues, please include:

- Node.js version
- ESLint version
- Plugin version
- Steps to reproduce
- Expected vs actual behavior
- Code examples if applicable

## Questions?

Feel free to open an issue for questions or discussions about the project.
