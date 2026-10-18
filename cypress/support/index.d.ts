/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Pause execution briefly to simulate a human reading/deliberating
     * @example cy.humanPause(400)
     */
    humanPause(ms?: number): Chainable<void>;

    /**
     * Types text at realistic human cadence with natural keystroke timing
     * @example cy.get('#input').humanType('standard_user')
     */
    humanType(text: string, options?: Partial<TypeOptions>): Chainable<JQuery<HTMLElement>>;

    /**
     * Simulates a realistic human click with smooth scroll and visual focus
     * @example cy.get('button').humanClick()
     */
    humanClick(options?: Partial<ClickOptions>): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to perform standard UI Login
     * @example cy.login('standard_user', 'secret_sauce')
     */
    login(username?: string, password?: string): Chainable<void>;

    /**
     * Custom command to login using Cypress Session for high-speed test setup
     * @example cy.loginBySession('standard_user', 'secret_sauce')
     */
    loginBySession(username?: string, password?: string): Chainable<void>;

    /**
     * Custom command to add a product to cart by product title
     * @example cy.addProductToCart('Sauce Labs Backpack')
     */
    addProductToCart(productName: string): Chainable<void>;

    /**
     * Custom command to verify shopping cart badge count
     * @example cy.verifyCartBadge(2)
     */
    verifyCartBadge(expectedCount: number): Chainable<void>;
  }
}
