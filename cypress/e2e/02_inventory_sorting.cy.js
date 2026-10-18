const loginPage = require('../pages/LoginPage');
const inventoryPage = require('../pages/InventoryPage');

describe('Inventory & Sorting Suite', () => {
  let productsData;
  let usersData;

  before(() => {
    cy.fixture('products').then((data) => {
      productsData = data;
    });
    cy.fixture('users').then((data) => {
      usersData = data;
    });
  });

  beforeEach(() => {
    // Perform standard login using UI or session command
    loginPage.visit();
    loginPage.login(usersData.validUser.username, usersData.validUser.password);
    inventoryPage.verifyInventoryLoaded();
  });

  it('TC-INV-01: Should display all catalog products with name, price, and Add to cart buttons', () => {
    inventoryPage.getProductCount().should('eq', 6);
    inventoryPage.elements.itemNames().should('have.length', 6);
    inventoryPage.elements.itemPrices().should('have.length', 6);
  });

  it('TC-INV-02: Should sort products by Name (A to Z) alphabetically', () => {
    inventoryPage.selectSortOption(productsData.sortOptions.nameAsc);
    inventoryPage.verifySortedByNameAscending();
  });

  it('TC-INV-03: Should sort products by Name (Z to A) in reverse alphabetical order', () => {
    inventoryPage.selectSortOption(productsData.sortOptions.nameDesc);
    inventoryPage.verifySortedByNameDescending();
  });

  it('TC-INV-04: Should sort products by Price (Low to High) in ascending numerical order', () => {
    inventoryPage.selectSortOption(productsData.sortOptions.priceAsc);
    inventoryPage.verifySortedByPriceAscending();
  });

  it('TC-INV-05: Should sort products by Price (High to Low) in descending numerical order', () => {
    inventoryPage.selectSortOption(productsData.sortOptions.priceDesc);
    inventoryPage.verifySortedByPriceDescending();
  });
});
