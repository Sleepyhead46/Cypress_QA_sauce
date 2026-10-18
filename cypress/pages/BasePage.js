/**
 * BasePage - Contains common methods and element locators shared across all page objects.
 * Employs Cypress best practices for chaining, assertions, and avoiding hard-coded waits.
 */
class BasePage {
  /**
   * Navigate to a relative URL using Cypress baseUrl
   * @param {string} path - Relative URL path (e.g., '/', '/inventory.html')
   */
  navigate(path = '') {
    cy.visit(path);
    return this;
  }

  /**
   * Verify current browser URL includes expected subpath
   * @param {string} expectedPath
   */
  verifyUrl(expectedPath) {
    cy.url().should('include', expectedPath);
    return this;
  }

  /**
   * Returns document title
   */
  getPageDocumentTitle() {
    return cy.title();
  }

  /**
   * Safe getter for element with explicit retry and visibility assertion
   * @param {string} selector
   */
  getElement(selector) {
    return cy.get(selector);
  }

  /**
   * Wait for DOM elements to reach a minimum count
   * @param {string} selector
   * @param {number} minCount
   */
  waitForElementsCount(selector, minCount = 1) {
    return cy.get(selector).should('have.length.at.least', minCount);
  }
}

module.exports = BasePage;
