// Unit tests for generateTestId function
import { describe, it, expect } from 'vitest';
import { generateTestId } from '../../src/utils/testIdUtils.js';

describe('generateTestId', () => {
  it('should generate test ID with default pattern', () => {
    const mockNode = global.createMockNode('button', { onClick: 'handleClick' });
    const filename = 'LoginPage.jsx';
    const pattern = '{page}-{purpose}-{element}';
    
    const result = generateTestId(mockNode, 'button', filename, pattern);
    expect(result).toBe('login-page-click-button');
  });

  it('should handle custom patterns', () => {
    const mockNode = global.createMockNode('input', { type: 'email' });
    const filename = 'SignupForm.jsx';
    const pattern = '{element}-{purpose}-{page}';
    
    const result = generateTestId(mockNode, 'input', filename, pattern);
    expect(result).toBe('input-email-signup-form');
  });

  it('should handle missing context gracefully', () => {
    const mockNode = global.createMockNode('div', {});
    const filename = 'HomePage.jsx';
    const pattern = '{page}-{purpose}-{element}';
    
    const result = generateTestId(mockNode, 'div', filename, pattern);
    expect(result).toBe('home-page-container-div');
  });

  it('should handle complex patterns with multiple placeholders', () => {
    const mockNode = global.createMockNode('button', { name: 'submit' });
    const filename = 'ContactForm.jsx';
    const pattern = '{page}-{element}-{purpose}-{context}';
    
    const result = generateTestId(mockNode, 'button', filename, pattern);
    expect(result).toContain('contact-form-button-submit');
  });
});