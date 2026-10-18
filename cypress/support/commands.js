// ***********************************************
// Custom Cypress Commands - Human Interaction Simulation
// ***********************************************

/**
 * Safe accessor for configuration exposed to the browser
 */
const getExposed = (key, fallback) => {
  try {
    if (typeof Cypress.expose === 'function') {
      const val = Cypress.expose(key);
      if (val !== undefined) return val;
    }
  } catch (err) {
    // Graceful fallback
  }
  return fallback;
};

/**
 * Simulates a natural human pause to read or deliberate
 * @example cy.humanPause(400)
 */
Cypress.Commands.add('humanPause', (ms = 300) => {
  const isHumanMode = getExposed('humanMode', true) !== false;
  if (isHumanMode && ms > 0) {
    cy.wait(ms, { log: false });
  }
});

/**
 * Types text at realistic human cadence with natural keystroke timing
 * @example cy.get('#input').humanType('standard_user')
 */
Cypress.Commands.add('humanType', { prevSubject: 'element' }, ($element, text, options = {}) => {
  const typingDelay = options.delay ?? getExposed('humanTypingDelay', 50);

  cy.wrap($element, { log: false }).scrollIntoView({ duration: 150 });
  cy.humanPause(100);

  if (!text) {
    cy.wrap($element).clear();
    cy.humanPause(100);
    return cy.wrap($element);
  }

  cy.wrap($element)
    .clear()
    .type(text, { delay: typingDelay, ...options });
  cy.humanPause(150);
  return cy.wrap($element);
});

/**
 * Simulates a realistic human click with smooth scroll and visual focus
 * @example cy.get('button').humanClick()
 */
Cypress.Commands.add('humanClick', { prevSubject: 'element' }, ($element, options = {}) => {
  cy.wrap($element, { log: false }).scrollIntoView({ duration: 200 });
  cy.humanPause(150);
  cy.wrap($element).click(options);
  cy.humanPause(200);
  return cy.wrap($element);
});

/**
 * Performs a human-like UI login with realistic typing cadence
 * @example cy.login('standard_user', 'secret_sauce')
 */
Cypress.Commands.add('login', (username, password) => {
  const user = username || getExposed('standardUser', 'standard_user');
  const pass = password || getExposed('defaultPassword', 'secret_sauce');

  cy.visit('/');
  cy.humanPause(200);
  cy.get('[data-test="username"]').humanType(user);
  cy.get('[data-test="password"]').humanType(pass, { log: false });
  cy.get('[data-test="login-button"]').humanClick();
});

/**
 * Custom command to login using Cypress Session for high-speed test setup
 * @example cy.loginBySession('standard_user', 'secret_sauce')
 */
Cypress.Commands.add('loginBySession', (username, password) => {
  const user = username || getExposed('standardUser', 'standard_user');
  const pass = password || getExposed('defaultPassword', 'secret_sauce');

  cy.session([user, pass], () => {
    cy.visit('/');
    cy.get('[data-test="username"]').type(user);
    cy.get('[data-test="password"]').type(pass, { log: false });
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  });
});

/**
 * Adds a product to cart by name with human-like scrolling and clicking
 * @example cy.addProductToCart('Sauce Labs Backpack')
 */
Cypress.Commands.add('addProductToCart', (productName) => {
  cy.get('.inventory_item')
    .filter(`:contains("${productName}")`)
    .scrollIntoView({ duration: 250 })
    .within(() => {
      cy.humanPause(150);
      cy.get('button').humanClick();
    });
});

/**
 * Verifies shopping cart badge count
 * @example cy.verifyCartBadge(2)
 */
Cypress.Commands.add('verifyCartBadge', (expectedCount) => {
  if (expectedCount > 0) {
    cy.get('[data-test="shopping-cart-badge"]')
      .should('be.visible')
      .and('have.text', String(expectedCount));
  } else {
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  }
});