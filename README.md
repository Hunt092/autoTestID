# autoTestID

ESLint plugin to enforce `data-testid` attributes on interactive elements for better testing practices.

## Features

- 🎯 **Configurable**: Define which elements and custom components require test IDs
- 🔧 **Auto-fixable**: Automatically suggests and inserts missing test IDs
- ⚡ **Smart suggestions**: Generates meaningful test IDs based on context
- 🚀 **Zero dependencies**: Only uses ESLint and Node.js built-ins
- 📦 **Plug-and-play**: Easy to integrate into any React project

## Installation

```bash
npm install autotestid --save-dev
```

## Usage

### Basic Setup

```javascript
// eslint.config.js
import testidPlugin from 'autotestid';

export default [{
  plugins: {
    'autotestid': testidPlugin
  },
  rules: {
    'autotestid/require-testid': 'error'
  }
}];
```

### Advanced Configuration

```javascript
// eslint.config.js
import testidPlugin from 'autotestid';

export default [{
  plugins: {
    'autotestid': testidPlugin
  },
  rules: {
    'autotestid/require-testid': ['error', {
      // Native HTML elements that require data-testid
      elements: ['button', 'input', 'select', 'textarea', 'a', 'form', 'div'],
      
      // Custom React components that require dataTestId prop
      customComponents: ['Button', 'Card', 'SearchBar', 'Dialog', 'Snackbar', 'Dropdown', 'Menu'],
      
      // File patterns to exclude
      exclude: ['**/*.test.jsx', '**/*.spec.jsx', '**/*.stories.jsx'],
      
      // Test ID naming pattern
      pattern: '{page}-{purpose}-{element}'
    }]
  }
}];
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `elements` | `string[]` | `['button', 'input', 'select', 'textarea', 'a', 'form', 'div']` | Native HTML elements that require `data-testid` |
| `customComponents` | `string[]` | `[]` | Custom React components that require `dataTestId` prop |
| `exclude` | `string[]` | `[]` | File patterns to exclude from the rule |
| `pattern` | `string` | `'{page}-{purpose}-{element}'` | Test ID naming pattern |

## Test ID Pattern

The plugin generates test IDs using the following pattern:
- `{page}` - Extracted from filename (e.g., `login-page` from `LoginPage.jsx`)
- `{purpose}` - Inferred from props or content (e.g., `submit` from button text)
- `{element}` - Element type (e.g., `button`, `input`)

**Example**: `login-submit-button`

## Examples

### Native HTML Elements

```jsx
// ❌ Missing data-testid
<button onClick={handleClick}>Submit</button>

// ✅ With data-testid
<button data-testid="login-submit-button" onClick={handleClick}>Submit</button>
```

### Custom Components

```jsx
// ❌ Missing dataTestId prop
<Button onClick={handleClick}>Submit</Button>

// ✅ With dataTestId prop
<Button dataTestId="login-submit-button" onClick={handleClick}>Submit</Button>
```

### Auto-fix

The plugin can automatically fix missing test IDs:

```bash
npx eslint . --fix
```

## Rules

### `require-testid`

Enforces `data-testid` attributes on interactive elements.

**Options:**
- `elements` (string[]): Native HTML elements to check
- `customComponents` (string[]): Custom React components to check
- `exclude` (string[]): File patterns to exclude
- `pattern` (string): Test ID naming pattern

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © Yash Chavan (Hunt092)

## Changelog

### 1.0.0
- Initial release
- Configurable elements and custom components
- Auto-fix support
- Smart test ID generation
