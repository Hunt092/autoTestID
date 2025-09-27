/**
 * ESLint rule to require data-testid on interactive elements
 * This rule helps ensure all interactive elements have test IDs for testing
 * 
 * @fileoverview ESLint plugin for enforcing data-testid attributes
 * @author Yash Chavan (Hunt092)
 * @version 1.0.0
 */

import { 
  generateTestId, 
  inferCustomComponentIdFromAttributes,
} from '../utils/testIdUtils.js';

/**
 * @typedef {Object} TestIdRuleOptions
 * @property {string[]} [elements] - List of native HTML elements that require data-testid
 * @property {string[]} [customComponents] - List of custom components that require dataTestId prop
 * @property {string[]} [exclude] - List of file patterns to exclude
 * @property {string} [pattern] - Test ID naming pattern (default: '{page}-{purpose}-{element}')
 */

/**
 * @typedef {Object} TestIdRuleMessages
 * @property {string} missingTestId - Error message for missing test ID
 * @property {string} suggestTestId - Suggestion message for test ID
 */

/**
 * ESLint rule configuration object
 * @type {import('eslint').Rule.RuleModule}
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

  /**
   * Creates the rule implementation
   * @param {import('eslint').Rule.RuleContext} context - ESLint rule context
   * @returns {import('eslint').Rule.RuleListener} Rule listener object
   */
  create(context) {
    /** @type {TestIdRuleOptions} */
    const options = context.options[0] || {};
    /** @type {string[]} */
    const elements = options.elements || [
      'button', 'input', 'select', 'textarea', 'a', 'form', 'div'
    ];
    /** @type {string[]} */
    const customComponents = options.customComponents || [];
    /** @type {string[]} */
    const exclude = options.exclude || [];
    /** @type {string} */
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
            const inferred =  generateTestId(node, tagName, filename, pattern, customComponents);

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

