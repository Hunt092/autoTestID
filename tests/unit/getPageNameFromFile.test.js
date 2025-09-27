// Unit tests for getPageNameFromFile function
import { describe, it, expect } from 'vitest';
import { getPageNameFromFile } from '../../src/utils/testIdUtils.js';

describe('getPageNameFromFile', () => {
  it('should convert PascalCase to kebab-case', () => {
    expect(getPageNameFromFile('LoginPage.jsx')).toBe('login-page');
    expect(getPageNameFromFile('UserProfile.jsx')).toBe('user-profile');
    expect(getPageNameFromFile('ContactForm.jsx')).toBe('contact-form');
  });

  it('should handle different file extensions', () => {
    expect(getPageNameFromFile('LoginPage.js')).toBe('login-page');
    expect(getPageNameFromFile('LoginPage.tsx')).toBe('login-page');
    expect(getPageNameFromFile('LoginPage.ts')).toBe('login-page');
  });

  it('should handle already kebab-case filenames', () => {
    expect(getPageNameFromFile('login-page.jsx')).toBe('login-page');
    expect(getPageNameFromFile('user-profile.jsx')).toBe('user-profile');
  });

  it('should handle single word filenames', () => {
    expect(getPageNameFromFile('Home.jsx')).toBe('home');
    expect(getPageNameFromFile('About.jsx')).toBe('about');
  });

  it('should handle filenames with paths', () => {
    expect(getPageNameFromFile('/src/components/LoginPage.jsx')).toBe('login-page');
    expect(getPageNameFromFile('src/pages/UserProfile.jsx')).toBe('user-profile');
    expect(getPageNameFromFile('components/forms/ContactForm.jsx')).toBe('contact-form');
  });

  it('should handle complex PascalCase', () => {
    expect(getPageNameFromFile('UserProfileSettings.jsx')).toBe('user-profile-settings');
    expect(getPageNameFromFile('APIResponseHandler.jsx')).toBe('api-response-handler');
    expect(getPageNameFromFile('XMLHttpRequest.jsx')).toBe('xml-http-request');
  });

  it('should handle edge cases', () => {
    expect(getPageNameFromFile('')).toBe('');
    expect(getPageNameFromFile('file')).toBe('file');
    expect(getPageNameFromFile('UPPERCASE.jsx')).toBe('uppercase');
  });
});

