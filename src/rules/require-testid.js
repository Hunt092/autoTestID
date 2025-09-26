/**
 * ESLint rule to require data-testid on interactive elements
 * This rule helps ensure all interactive elements have test IDs for testing
 * 
 * @author Yash Chavan (Hunt092)
 */

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require data-testid on interactive elements',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          elements: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of native HTML elements that require data-testid'
          },
          customComponents: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of custom components that require dataTestId prop'
          },
          exclude: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of file patterns to exclude'
          },
          pattern: {
            type: 'string',
            description: 'Test ID naming pattern'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      missingTestId: 'Interactive element "{{element}}" should have data-testid attribute',
      suggestTestId: 'Suggested test ID: "{{suggestedId}}"'
    }
  },

  create(context) {
    const options = context.options[0] || {};
    const elements = options.elements || [
      'button', 'input', 'select', 'textarea', 'a', 'form', 'div'
    ];
    const customComponents = options.customComponents || [];
    const exclude = options.exclude || [];
    const pattern = options.pattern || '{page}-{purpose}-{element}';

    // Check if current file should be excluded
    const filename = context.getFilename();
    const shouldExclude = exclude.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(filename);
    });

    if (shouldExclude) {
      return {};
    }

    return {
      JSXElement(node) {
        const tagName = node.openingElement.name.name;

        // Special handling for custom components: enforce dataTestId prop
        if (customComponents.includes(tagName)) {
          const hasDataTestIdProp = node.openingElement.attributes.some(
            attr => attr.name && attr.name.name === 'dataTestId'
          );

          if (!hasDataTestIdProp) {
            const inferred = inferCustomComponentIdFromAttributes(node, tagName) || generateTestId(node, tagName, filename, pattern);

            context.report({
              node,
              messageId: 'missingTestId',
              data: {
                element: tagName,
                suggestedId: inferred
              },
              fix(fixer) {
                return fixer.insertTextAfter(
                  node.openingElement.name,
                  ` dataTestId="${inferred}"`
                );
              }
            });
          }
          return; // do not fall through to native handling
        }

        // Check if this element needs a test ID (native or other listed components)
        if (elements.includes(tagName)) {
          // Check if it already has data-testid
          const hasTestId = node.openingElement.attributes.some(
            attr => attr.name && attr.name.name === 'data-testid'
          );

          // Check if element has interactive attributes (onClick, onSubmit, etc.)
          const hasInteractiveProps = node.openingElement.attributes.some(
            attr => attr.name && (
              attr.name.name.startsWith('on') || // onClick, onSubmit, etc.
              attr.name.name === 'href' || // Links
              attr.name.name === 'type' && ['button', 'submit', 'reset'].includes(attr.value?.value) // Button types
            )
          );

          // Skip if it's a div without interactive props
          if (tagName === 'div' && !hasInteractiveProps) {
            return;
          }

          // If no test ID and element is interactive, report error
          if (!hasTestId && (hasInteractiveProps || tagName !== 'div')) {
            const suggestedTestId = generateTestId(node, tagName, filename, pattern);

            context.report({
              node,
              messageId: 'missingTestId',
              data: {
                element: tagName,
                suggestedId: suggestedTestId
              },
              fix(fixer) {
                return fixer.insertTextAfter(
                  node.openingElement.name,
                  ` data-testid="${suggestedTestId}"`
                );
              }
            });
          }
        }
      }
    };
  }
};

/**
 * Generate a test ID based on the element and context
 */
function generateTestId(node, elementType, filename, pattern) {
  // Extract page name from filename
  const pageName = getPageNameFromFile(filename);
  
  // Get element purpose from props or content
  const purpose = getElementPurpose(node, elementType);
  
  // For common components, try to get context from parent component
  const context = getElementContext(node, filename);
  
  // Generate test ID based on pattern
  return pattern
    .replace('{page}', pageName)
    .replace('{purpose}', purpose)
    .replace('{element}', elementType)
    .replace('{context}', context);
}

/**
 * Extract page name from file path
 */
function getPageNameFromFile(filename) {
  // Extract component/page name from file path
  const pathParts = filename.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const componentName = fileName.replace(/\.(jsx?|tsx?)$/, '');
  
  // Convert PascalCase to kebab-case
  return componentName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * Determine element purpose from props or content
 */
function getElementPurpose(node, elementType) {
  const openingElement = node.openingElement;
  
  // Check for common attributes that indicate purpose
  const nameAttr = openingElement.attributes.find(attr => 
    attr.name && attr.name.name === 'name'
  );
  if (nameAttr && nameAttr.value) {
    return nameAttr.value.value || nameAttr.value.raw?.replace(/['"]/g, '');
  }

  // Check for type attribute (for inputs and buttons)
  const typeAttr = openingElement.attributes.find(attr => 
    attr.name && attr.name.name === 'type'
  );
  if (typeAttr && typeAttr.value) {
    const typeValue = typeAttr.value.value || typeAttr.value.raw?.replace(/['"]/g, '');
    if (typeValue) {
      return typeValue;
    }
  }

  // Check for href attribute (for links)
  const hrefAttr = openingElement.attributes.find(attr => 
    attr.name && attr.name.name === 'href'
  );
  if (hrefAttr && hrefAttr.value) {
    const hrefValue = hrefAttr.value.value || hrefAttr.value.raw?.replace(/['"]/g, '');
    if (hrefValue) {
      return hrefValue.replace(/[/#]/g, '-').replace(/^-/, '');
    }
  }

  // Check for onClick or other event handlers
  const eventAttr = openingElement.attributes.find(attr => 
    attr.name && attr.name.name.startsWith('on')
  );
  if (eventAttr) {
    return eventAttr.name.name.replace('on', '').toLowerCase();
  }

  // Try to get purpose from button text or children
  if ((elementType === 'button' || elementType === 'Button') && node.children.length > 0) {
    const textContent = getTextContent(node);
    if (textContent) {
      return textContent
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
  }

  // Default purpose based on element type
  const defaultPurposes = {
    button: 'button',
    Button: 'button',
    input: 'input',
    select: 'select',
    textarea: 'textarea',
    a: 'link',
    form: 'form',
    div: 'container',
    Card: 'card',
    SearchBar: 'search',
    Dialog: 'dialog',
    Snackbar: 'snackbar',
    Dropdown: 'dropdown',
    DropDown: 'dropdown',
    Menu: 'menu'
  };

  return defaultPurposes[elementType] || 'element';
}

/**
 * Get element context for better test ID generation
 */
function getElementContext(node, filename) {
  // Check if this is a common component usage
  const isCommonComponent = isCommonComponentUsage(node);
  
  if (isCommonComponent) {
    // For common components, use the parent component context
    const parentContext = getParentComponentContext(node, filename);
    return parentContext;
  }
  
  return '';
}

/**
 * Check if this is a common component usage (Button, Card, etc.)
 */
function isCommonComponentUsage(node) {
  const commonComponents = ['Button', 'Card', 'SearchBar', 'Dialog', 'Snackbar', 'Dropdown', 'DropDown', 'Menu'];
  const tagName = node.openingElement.name.name;
  return commonComponents.includes(tagName);
}

/**
 * Get parent component context for common component usage
 */
function getParentComponentContext(node, filename) {
  // Try to find the parent component by looking up the AST
  // For now, we'll use the file context and element purpose
  const pageName = getPageNameFromFile(filename);
  const purpose = getElementPurpose(node, node.openingElement.name.name);
  
  // Create a more specific context
  return `${pageName}-${purpose}`;
}

/**
 * Extract text content from JSX element
 */
function getTextContent(node) {
  if (!node.children) return '';
  
  return node.children
    .map(child => {
      if (child.type === 'JSXText') {
        return child.value.trim();
      } else if (child.type === 'JSXElement') {
        return getTextContent(child);
      }
      return '';
    })
    .join(' ')
    .trim();
}

// Helpers for custom components
function inferCustomComponentIdFromAttributes(node, componentName) {
  // Try common attributes that might indicate purpose
  const label = getJSXAttributeLiteral(node, 'label');
  const placeholder = getJSXAttributeLiteral(node, 'placeholder');
  const title = getJSXAttributeLiteral(node, 'title');
  const name = getJSXAttributeLiteral(node, 'name');
  
  const base = label || placeholder || title || name || componentName.toLowerCase();
  return toSlug(base);
}

function getJSXAttributeLiteral(node, attrName) {
  const attr = node.openingElement.attributes.find(a => a.name && a.name.name === attrName);
  if (!attr || !attr.value) return '';
  if (attr.value.type === 'Literal') return String(attr.value.value || '');
  if (attr.value.type === 'JSXExpressionContainer' && attr.value.expression.type === 'Literal') {
    return String(attr.value.expression.value || '');
  }
  return '';
}

function toSlug(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
