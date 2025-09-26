/**
 * autoTestID
 * ESLint plugin to enforce data-testid attributes on interactive elements
 * 
 * @author Yash Chavan (Hunt092)
 * @version 1.0.0
 */

import requireTestId from './rules/require-testid.js';

export default {
  rules: {
    'require-testid': requireTestId
  },
  configs: {
    recommended: {
      plugins: ['autotestid'],
      rules: {
        'autotestid/require-testid': 'error'
      }
    }
  }
};
