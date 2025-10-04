---
name: Bug report
about: Create a report to help us improve
title: ""
labels: bug
assignees: ""
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Environment:**

- Node.js version: [e.g. 18.17.0]
- ESLint version: [e.g. 9.22.0]
- Plugin version: [e.g. 1.0.2]
- OS: [e.g. Windows 10, macOS 13, Ubuntu 22.04]

**ESLint Configuration**

```javascript
// Please share your ESLint configuration
export default [
	{
		plugins: { autotestid: testidPlugin },
		rules: {
			"autotestid/require-testid": "error",
		},
	},
];
```

**Code Example**

```jsx
// Please share the code that's causing the issue
<button onClick={handleClick}>Submit</button>
```

**Error Message**

```
// Please share the full error message
```

**Additional context**
Add any other context about the problem here.
