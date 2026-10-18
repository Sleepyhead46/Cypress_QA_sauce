const loginPage = require('../pages/LoginPage');
const inventoryPage = require('../pages/InventoryPage');
const cartPage = require('../pages/CartPage');

describe('Cart Operations Suite', () => {
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
    loginPage.visit();
    loginPage.login(usersData.validUser.username, usersData.validUser.password);
    inventoryPage.verifyInventoryLoaded();
  });

  it('TC-CART-01: Should add a single product to cart and update cart badge and button state', () => {
    const item = productsData.sauceLabsBackpack.name;

    // Verify initial state: cart badge should not exist
    inventoryPage.header.verifyCartBadgeNotVisible();

    // Add item to cart
    inventoryPage.addProductToCart(item);

    // Verify button flips to 'Remove'
    inventoryPage.verifyProductButtonState(item, 'Remove');

    // Verify cart badge increments to 1
    inventoryPage.header.verifyCartBadgeCount(1);
  });

  it('TC-CART-02: Should add multiple products and reflect accurate badge count', () => {
    const itemsToAdd = [
      productsData.sauceLabsBackpack.name,
      productsData.sauceLabsBikeLight.name,
      productsData.sauceLabsBoltTShirt.name,
    ];

    inventoryPage.addMultipleProducts(itemsToAdd);

    // Cart badge should reflect 3 items
    inventoryPage.header.verifyCartBadgeCount(3);
  });

  it('TC-CART-03: Should remove product directly from inventory page and decrement badge', () => {
    const item1 = productsData.sauceLabsBackpack.name;
    const item2 = productsData.sauceLabsBikeLight.name;

    inventoryPage.addProductToCart(item1);
    inventoryPage.addProductToCart(item2);
    inventoryPage.header.verifyCartBadgeCount(2);

    // Remove one item directly from the inventory catalog
    inventoryPage.removeProductFromCart(item1);

    // Verify button resets to 'Add to cart'
    inventoryPage.verifyProductButtonState(item1, 'Add to cart');

    // Cart badge should decrement to 1
    inventoryPage.header.verifyCartBadgeCount(1);
  });

  it('TC-CART-04: Should navigate to cart and verify accurate items list, names, and prices', () => {
    const item1 = productsData.sauceLabsBackpack;
    const item2 = productsData.sauceLabsBoltTShirt;

    inventoryPage.addProductToCart(item1.name);
    inventoryPage.addProductToCart(item2.name);

    // Navigate to cart
    inventoryPage.header.clickCart();
    cartPage.verifyCartLoaded();

    // Assert items in cart
    cartPage.verifyCartItemCount(2);
    cartPage.verifyProductInCart(item1.name, item1.price);
    cartPage.verifyProductInCart(item2.name, item2.price);
  });

  it('TC-CART-05: Should remove item from Cart page and update cart badge and list', () => {
    const item1 = productsData.sauceLabsBackpack;
    const item2 = productsData.sauceLabsBikeLight;

    inventoryPage.addProductToCart(item1.name);
    inventoryPage.addProductToCart(item2.name);

    inventoryPage.header.clickCart();
    cartPage.verifyCartLoaded();
    cartPage.verifyCartItemCount(2);

    // Remove first item from inside the cart page
    cartPage.removeProduct(item1.name);

    // Verify cart count is now 1 and only second item remains
    cartPage.verifyCartItemCount(1);
    cartPage.verifyProductInCart(item2.name, item2.price);
    cartPage.header.verifyCartBadgeCount(1);
  });

  it('TC-CART-06: Should continue shopping from cart and return to inventory', () => {
    inventoryPage.addProductToCart(productsData.sauceLabsBackpack.name);
    inventoryPage.header.clickCart();
    cartPage.verifyCartLoaded();

    // Click Continue Shopping
    cartPage.clickContinueShopping();

    // Verify redirected back to inventory page while retaining cart badge
    inventoryPage.verifyInventoryLoaded();
    inventoryPage.header.verifyCartBadgeCount(1);
  });
});
