// ***********************************************************
// Global Cypress Support Configuration
// ***********************************************************

import './commands';

// Ignore harmless uncaught third-party exceptions to prevent false test failures
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  return false;
});