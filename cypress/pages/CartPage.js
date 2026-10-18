const BasePage = require('./BasePage');
const headerComponent = require('./components/HeaderComponent');

/**
 * CartPage - Handles the shopping cart review screen with realistic user deliberation.
 */
class CartPage extends BasePage {
  constructor() {
    super();
    this.header = headerComponent;
  }

  elements = {
    cartList: () => cy.get('[data-test="cart-list"], .cart_list'),
    cartItems: () => cy.get('[data-test="inventory-item"], .cart_item'),
    itemNames: () => cy.get('[data-test="inventory-item-name"], .inventory_item_name'),
    itemPrices: () => cy.get('[data-test="inventory-item-price"], .inventory_item_price'),
    itemQuantities: () => cy.get('[data-test="item-quantity"], .cart_quantity'),
    continueShoppingButton: () => cy.get('[data-test="continue-shopping"], #continue-shopping'),
    checkoutButton: () => cy.get('[data-test="checkout"], #checkout'),
  };

  /**
   * Verify Cart Page is loaded and pause to review cart
   */
  verifyCartLoaded() {
    this.verifyUrl('/cart.html');
    this.header.verifyPageTitle('Your Cart');
    cy.humanPause(300); // Deliberating / reviewing cart contents
    return this;
  }

  /**
   * Locate specific cart item row by product name
   */
  getCartItemByName(productName) {
    return this.elements.cartItems().filter(`:contains("${productName}")`);
  }

  /**
   * Verify that a product is present in the cart, optionally validating price
   */
  verifyProductInCart(productName, expectedPrice) {
    this.getCartItemByName(productName)
      .scrollIntoView({ duration: 200 })
      .within(() => {
        cy.root().should('be.visible');
        cy.get('[data-test="item-quantity"], .cart_quantity').should('have.text', '1');
        if (expectedPrice) {
          cy.get('[data-test="inventory-item-price"], .inventory_item_price')
            .should('have.text', expectedPrice);
        }
      });
    cy.humanPause(200);
    return this;
  }

  /**
   * Verify total number of items currently in the cart list
   */
  verifyCartItemCount(expectedCount) {
    if (expectedCount === 0) {
      this.elements.cartItems().should('not.exist');
    } else {
      this.elements.cartItems().should('have.length', expectedCount);
    }
    cy.humanPause(150);
    return this;
  }

  /**
   * Remove a product from the cart by its name with human-like click
   */
  removeProduct(productName) {
    this.getCartItemByName(productName)
      .scrollIntoView({ duration: 200 })
      .find('button')
      .should('have.text', 'Remove')
      .humanClick();
    cy.humanPause(200);
    return this;
  }

  /**
   * Proceed to checkout step one
   */
  clickCheckout() {
    this.elements.checkoutButton().humanClick();
    cy.humanPause(250);
    return this;
  }

  /**
   * Return to products inventory
   */
  clickContinueShopping() {
    this.elements.continueShoppingButton().humanClick();
    cy.humanPause(250);
    return this;
  }
}

module.exports = new CartPage();
