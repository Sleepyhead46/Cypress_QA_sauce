/**
 * HeaderComponent - Shared header component across authenticated pages.
 * Handles top navigation, burger menu actions, and cart badge assertions with realistic user pacing.
 */
class HeaderComponent {
  elements = {
    burgerMenuButton: () => cy.get('#react-burger-menu-btn'),
    sidebarMenuWrap: () => cy.get('.bm-menu-wrap'),
    logoutSidebarLink: () => cy.get('[data-test="logout-sidebar-link"], #logout_sidebar_link'),
    allItemsSidebarLink: () => cy.get('[data-test="inventory-sidebar-link"], #inventory_sidebar_link'),
    resetAppSidebarLink: () => cy.get('[data-test="reset-sidebar-link"], #reset_sidebar_link'),
    closeMenuButton: () => cy.get('#react-burger-cross-btn'),
    shoppingCartLink: () => cy.get('[data-test="shopping-cart-link"], .shopping_cart_link'),
    shoppingCartBadge: () => cy.get('[data-test="shopping-cart-badge"], .shopping_cart_badge'),
    pageTitle: () => cy.get('[data-test="title"], .title'),
    appLogo: () => cy.get('.app_logo'),
  };

  /**
   * Verify the primary header title
   */
  verifyPageTitle(expectedTitle) {
    this.elements.pageTitle()
      .should('be.visible')
      .and('have.text', expectedTitle);
    return this;
  }

  /**
   * Open the left slide-out burger menu with natural pause for drawer animation
   */
  openMenu() {
    this.elements.burgerMenuButton().humanClick();
    this.elements.sidebarMenuWrap().should('have.attr', 'aria-hidden', 'false');
    cy.humanPause(300); // Wait for menu slide-in transition
    return this;
  }

  /**
   * Click Logout from sidebar menu
   */
  logout() {
    this.openMenu();
    this.elements.logoutSidebarLink().should('be.visible').humanClick();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.humanPause(250);
    return this;
  }

  /**
   * Reset App State from sidebar menu
   */
  resetAppState() {
    this.openMenu();
    this.elements.resetAppSidebarLink().should('be.visible').humanClick();
    cy.humanPause(200);
    this.elements.closeMenuButton().humanClick();
    cy.humanPause(200);
    return this;
  }

  /**
   * Click the Shopping Cart icon
   */
  clickCart() {
    this.elements.shoppingCartLink().humanClick();
    cy.humanPause(200);
    return this;
  }

  /**
   * Assert the shopping cart badge count
   */
  verifyCartBadgeCount(expectedCount) {
    this.elements.shoppingCartBadge()
      .should('be.visible')
      .and('have.text', String(expectedCount));
    cy.humanPause(200);
    return this;
  }

  /**
   * Assert that the cart badge does not exist
   */
  verifyCartBadgeNotVisible() {
    this.elements.shoppingCartBadge().should('not.exist');
    cy.humanPause(150);
    return this;
  }
}

module.exports = new HeaderComponent();
