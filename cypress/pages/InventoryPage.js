const BasePage = require('./BasePage');
const headerComponent = require('./components/HeaderComponent');

/**
 * InventoryPage - Manages product catalog browsing, sorting, and cart actions
 * with realistic human browsing behavior.
 */
class InventoryPage extends BasePage {
  constructor() {
    super();
    this.header = headerComponent;
  }

  elements = {
    inventoryContainer: () => cy.get('[data-test="inventory-container"], #inventory_container'),
    inventoryList: () => cy.get('[data-test="inventory-list"], .inventory_list'),
    inventoryItems: () => cy.get('[data-test="inventory-item"], .inventory_item'),
    itemNames: () => cy.get('[data-test="inventory-item-name"], .inventory_item_name'),
    itemPrices: () => cy.get('[data-test="inventory-item-price"], .inventory_item_price'),
    itemDescriptions: () => cy.get('[data-test="inventory-item-desc"], .inventory_item_desc'),
    sortDropdown: () => cy.get('[data-test="product-sort-container"]'),
    activeSortOption: () => cy.get('.active_option'),
  };

  /**
   * Verify the inventory page is fully loaded and pause to view the catalog
   */
  verifyInventoryLoaded() {
    this.verifyUrl('/inventory.html');
    this.header.verifyPageTitle('Products');
    this.elements.inventoryItems().should('have.length.at.least', 1);
    cy.humanPause(300);
    return this;
  }

  /**
   * Get total number of displayed products
   */
  getProductCount() {
    return this.elements.inventoryItems().its('length');
  }

  /**
   * Helper to locate an inventory item card by its product name
   */
  getItemCardByName(productName) {
    return this.elements.inventoryItems().filter(`:contains("${productName}")`);
  }

  /**
   * Add a single product to cart by product name with human-like scrolling and pause
   */
  addProductToCart(productName) {
    this.getItemCardByName(productName)
      .scrollIntoView({ duration: 300 })
      .within(() => {
        cy.humanPause(200);
        cy.get('button')
          .should('have.text', 'Add to cart')
          .humanClick();
      });
    return this;
  }

  /**
   * Remove product from cart on inventory page
   */
  removeProductFromCart(productName) {
    this.getItemCardByName(productName)
      .scrollIntoView({ duration: 300 })
      .within(() => {
        cy.humanPause(150);
        cy.get('button')
          .should('have.text', 'Remove')
          .humanClick();
      });
    return this;
  }

  /**
   * Verify product action button state (e.g. 'Add to cart' or 'Remove')
   */
  verifyProductButtonState(productName, expectedState) {
    this.getItemCardByName(productName)
      .scrollIntoView({ duration: 200 })
      .find('button')
      .should('have.text', expectedState);
    cy.humanPause(150);
    return this;
  }

  /**
   * Add multiple products to cart in sequence with natural user pauses
   */
  addMultipleProducts(productNames) {
    productNames.forEach((productName) => {
      this.addProductToCart(productName);
      cy.humanPause(250);
    });
    return this;
  }

  /**
   * Select a sort option from dropdown with deliberate user timing
   */
  selectSortOption(sortOptionValue) {
    this.elements.sortDropdown()
      .scrollIntoView({ duration: 200 });
    cy.humanPause(200);
    this.elements.sortDropdown().select(sortOptionValue);
    cy.humanPause(400); // User reviewing newly re-ordered list
    return this;
  }

  /**
   * Verify products are sorted by Name (A to Z)
   */
  verifySortedByNameAscending() {
    this.elements.itemNames()
      .then(($items) => {
        const itemNames = $items.map((_, el) => Cypress.$(el).text().trim()).get();
        const sortedNames = [...itemNames].sort((a, b) => a.localeCompare(b));
        expect(itemNames, 'Products should be sorted alphabetically A-Z').to.deep.equal(sortedNames);
      });
    cy.humanPause(250);
    return this;
  }

  /**
   * Verify products are sorted by Name (Z to A)
   */
  verifySortedByNameDescending() {
    this.elements.itemNames()
      .then(($items) => {
        const itemNames = $items.map((_, el) => Cypress.$(el).text().trim()).get();
        const sortedNames = [...itemNames].sort((a, b) => b.localeCompare(a));
        expect(itemNames, 'Products should be sorted alphabetically Z-A').to.deep.equal(sortedNames);
      });
    cy.humanPause(250);
    return this;
  }

  /**
   * Verify products are sorted by Price (Low to High)
   */
  verifySortedByPriceAscending() {
    this.elements.itemPrices()
      .then(($prices) => {
        const numericPrices = $prices
          .map((_, el) => parseFloat(Cypress.$(el).text().replace('$', '')))
          .get();
        const sortedPrices = [...numericPrices].sort((a, b) => a - b);
        expect(numericPrices, 'Prices should be sorted low to high').to.deep.equal(sortedPrices);
      });
    cy.humanPause(250);
    return this;
  }

  /**
   * Verify products are sorted by Price (High to Low)
   */
  verifySortedByPriceDescending() {
    this.elements.itemPrices()
      .then(($prices) => {
        const numericPrices = $prices
          .map((_, el) => parseFloat(Cypress.$(el).text().replace('$', '')))
          .get();
        const sortedPrices = [...numericPrices].sort((a, b) => b - a);
        expect(numericPrices, 'Prices should be sorted high to low').to.deep.equal(sortedPrices);
      });
    cy.humanPause(250);
    return this;
  }
}

module.exports = new InventoryPage();
