const BasePage = require('./BasePage');
const headerComponent = require('./components/HeaderComponent');

/**
 * CheckoutPage - Handles Step 1 (Information), Step 2 (Overview), and Completion
 * with realistic human form-filling cadence, scrolling, and review pauses.
 */
class CheckoutPage extends BasePage {
  constructor() {
    super();
    this.header = headerComponent;
  }

  elements = {
    // Step 1: Customer Information
    firstNameInput: () => cy.get('[data-test="firstName"], #first-name'),
    lastNameInput: () => cy.get('[data-test="lastName"], #last-name'),
    postalCodeInput: () => cy.get('[data-test="postalCode"], #postal-code'),
    continueButton: () => cy.get('[data-test="continue"], #continue'),
    cancelButton: () => cy.get('[data-test="cancel"], #cancel'),
    errorMessage: () => cy.get('[data-test="error"]'),

    // Step 2: Overview & Pricing
    overviewCartItems: () => cy.get('[data-test="inventory-item"], .cart_item'),
    itemPrices: () => cy.get('[data-test="inventory-item-price"], .inventory_item_price'),
    subtotalLabel: () => cy.get('[data-test="subtotal-label"], .summary_subtotal_label'),
    taxLabel: () => cy.get('[data-test="tax-label"], .summary_tax_label'),
    totalLabel: () => cy.get('[data-test="total-label"], .summary_total_label'),
    paymentInfoLabel: () => cy.get('[data-test="payment-info-value"], .summary_value_label').first(),
    shippingInfoLabel: () => cy.get('[data-test="shipping-info-value"], .summary_value_label').eq(1),
    finishButton: () => cy.get('[data-test="finish"], #finish'),

    // Step 3: Complete
    completeHeader: () => cy.get('[data-test="complete-header"], .complete-header'),
    completeText: () => cy.get('[data-test="complete-text"], .complete-text'),
    backHomeButton: () => cy.get('[data-test="back-to-products"], #back-to-products'),
    ponyExpressImage: () => cy.get('[data-test="pony-express"], .pony_express'),
  };

  // --- Step 1: Customer Information Methods ---

  /**
   * Verify Step 1 is loaded
   */
  verifyStepOneLoaded() {
    this.verifyUrl('/checkout-step-one.html');
    this.header.verifyPageTitle('Checkout: Your Information');
    this.elements.firstNameInput().should('be.visible');
    cy.humanPause(250);
    return this;
  }

  /**
   * Fill out customer details on checkout step 1 with realistic typing speed
   */
  fillCustomerInfo(firstName, lastName, postalCode) {
    if (firstName) {
      this.elements.firstNameInput().humanType(firstName);
    } else {
      this.elements.firstNameInput().clear();
      cy.humanPause(150);
    }

    if (lastName) {
      this.elements.lastNameInput().humanType(lastName);
    } else {
      this.elements.lastNameInput().clear();
      cy.humanPause(150);
    }

    if (postalCode) {
      this.elements.postalCodeInput().humanType(postalCode);
    } else {
      this.elements.postalCodeInput().clear();
      cy.humanPause(150);
    }
    return this;
  }

  /**
   * Click continue button on step 1
   */
  clickContinue() {
    this.elements.continueButton().humanClick();
    cy.humanPause(250);
    return this;
  }

  /**
   * Click cancel button on checkout steps
   */
  clickCancel() {
    this.elements.cancelButton().humanClick();
    cy.humanPause(250);
    return this;
  }

  /**
   * Verify step 1 error banner message with pause to read error
   */
  verifyErrorMessage(expectedError) {
    this.elements.errorMessage()
      .should('be.visible')
      .and('contain.text', expectedError);
    cy.humanPause(350); // Reading the validation message
    return this;
  }

  // --- Step 2: Overview & Pricing Methods ---

  /**
   * Verify Step 2 is loaded
   */
  verifyStepTwoLoaded() {
    this.verifyUrl('/checkout-step-two.html');
    this.header.verifyPageTitle('Checkout: Overview');
    this.elements.finishButton().should('be.visible');
    cy.humanPause(300);
    return this;
  }

  /**
   * Verifies price calculations with realistic human scrolling through the receipt
   */
  verifyPriceCalculations() {
    // Scroll through the items and pause to review receipt
    this.elements.overviewCartItems().first().scrollIntoView({ duration: 200 });
    cy.humanPause(200);

    // Calculate sum of individual items
    this.elements.itemPrices().then(($prices) => {
      let calculatedItemTotal = 0;
      $prices.each((_, el) => {
        const price = parseFloat(Cypress.$(el).text().replace('$', ''));
        calculatedItemTotal += price;
      });

      calculatedItemTotal = parseFloat(calculatedItemTotal.toFixed(2));

      // Scroll down to totals summary
      this.elements.subtotalLabel().scrollIntoView({ duration: 250 });
      cy.humanPause(200);

      this.elements.subtotalLabel().invoke('text').then((subtotalText) => {
        const displayedSubtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
        expect(displayedSubtotal, 'Displayed subtotal should match sum of item prices')
          .to.equal(calculatedItemTotal);

        this.elements.taxLabel().invoke('text').then((taxText) => {
          const displayedTax = parseFloat(taxText.replace(/[^0-9.]/g, ''));

          this.elements.totalLabel().invoke('text').then((totalText) => {
            const displayedTotal = parseFloat(totalText.replace(/[^0-9.]/g, ''));
            const expectedTotal = parseFloat((displayedSubtotal + displayedTax).toFixed(2));
            expect(displayedTotal, 'Grand total should equal subtotal + tax')
              .to.equal(expectedTotal);
          });
        });
      });
    });

    cy.humanPause(300); // Deliberating over invoice total
    return this;
  }

  /**
   * Click Finish button on overview page
   */
  clickFinish() {
    this.elements.finishButton().humanClick();
    cy.humanPause(300);
    return this;
  }

  // --- Step 3: Complete Screen Methods ---

  /**
   * Verify Checkout Complete confirmation screen
   */
  verifyOrderComplete() {
    this.verifyUrl('/checkout-complete.html');
    this.header.verifyPageTitle('Checkout: Complete!');
    this.elements.completeHeader()
      .should('be.visible')
      .and('have.text', 'Thank you for your order!');
    this.elements.completeText()
      .should('be.visible')
      .and('contain.text', 'Your order has been dispatched');
    cy.humanPause(400); // User viewing confirmation screen
    return this;
  }

  /**
   * Click Back Home button to return to catalog
   */
  clickBackHome() {
    this.elements.backHomeButton().humanClick();
    this.verifyUrl('/inventory.html');
    cy.humanPause(250);
    return this;
  }
}

module.exports = new CheckoutPage();
