// Unit tests for getTextContent function
import { describe, it, expect } from 'vitest';
import { getTextContent } from '../../src/utils/testIdUtils.js';

describe('getTextContent', () => {
  it('should extract text from simple JSX text nodes', () => {
    const mockNode = {
      children: [
        { type: 'JSXText', value: ' Submit ' },
        { type: 'JSXText', value: ' Form ' }
      ]
    };
    const result = getTextContent(mockNode);
    expect(result).toBe('Submit Form');
  });

  it('should handle single text node', () => {
    const mockNode = {
      children: [{ type: 'JSXText', value: 'Click me' }]
    };
    const result = getTextContent(mockNode);
    expect(result).toBe('Click me');
  });

  it('should handle nested JSX elements', () => {
    const mockNode = {
      children: [
        { type: 'JSXText', value: 'Save ' },
        { 
          type: 'JSXElement',
          children: [{ type: 'JSXText', value: 'Changes' }]
        }
      ]
    };
    const result = getTextContent(mockNode);
    expect(result).toBe('Save Changes');
  });

  it('should handle deeply nested JSX elements', () => {
    const mockNode = {
      children: [
        { type: 'JSXText', value: 'User ' },
        { 
          type: 'JSXElement',
          children: [
            { type: 'JSXText', value: 'Profile ' },
            { 
              type: 'JSXElement',
              children: [{ type: 'JSXText', value: 'Settings' }]
            }
          ]
        }
      ]
    };
    const result = getTextContent(mockNode);
    expect(result).toBe('User Profile Settings');
  });

  it('should handle empty children array', () => {
    const mockNode = { children: [] };
    const result = getTextContent(mockNode);
    expect(result).toBe('');
  });

  it('should handle missing children property', () => {
    const mockNode = {};
    const result = getTextContent(mockNode);
    expect(result).toBe('');
  });

  it('should handle null children', () => {
    const mockNode = { children: null };
    const result = getTextContent(mockNode);
    expect(result).toBe('');
  });

  it('should filter out non-text and non-element children', () => {
    const mockNode = {
      children: [
        { type: 'JSXText', value: 'Text ' },
        { type: 'JSXExpressionContainer', expression: {} },
        { type: 'JSXText', value: ' More Text' }
      ]
    };
    const result = getTextContent(mockNode);
    expect(result).toBe('Text  More Text');
  });

  it('should trim whitespace from individual text nodes', () => {
    const mockNode = {
      children: [
        { type: 'JSXText', value: '  \n  Text  \n  ' },
        { type: 'JSXText', value: '  More  ' }
      ]
    };
    const result = getTextContent(mockNode);
    expect(result).toBe('Text More');
  });

  it('should handle mixed content types', () => {
    const mockNode = {
      children: [
        { type: 'JSXText', value: 'Hello ' },
        { type: 'JSXElement', children: [{ type: 'JSXText', value: 'World' }] },
        { type: 'JSXText', value: ' !' }
      ]
    };
    const result = getTextContent(mockNode);
    expect(result).toBe('Hello World !');
  });
});

