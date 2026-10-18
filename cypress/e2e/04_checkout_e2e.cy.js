const loginPage = require('../pages/LoginPage');
const inventoryPage = require('../pages/InventoryPage');
const cartPage = require('../pages/CartPage');
const checkoutPage = require('../pages/CheckoutPage');

describe('Checkout & Order Placement Suite (E2E)', () => {
  let usersData;
  let productsData;
  let checkoutData;

  before(() => {
    cy.fixture('users').then((data) => {
      usersData = data;
    });
    cy.fixture('products').then((data) => {
      productsData = data;
    });
    cy.fixture('checkoutData').then((data) => {
      checkoutData = data;
    });
  });

  beforeEach(() => {
    loginPage.visit();
    loginPage.login(usersData.validUser.username, usersData.validUser.password);
    inventoryPage.verifyInventoryLoaded();
  });

  it('TC-CHK-01: End-to-End Happy Path - Complete order purchase with item & total calculations', () => {
    const item1 = productsData.sauceLabsBackpack;
    const item2 = productsData.sauceLabsBikeLight;
    const customer = checkoutData.validCustomer;

    // 1. Add items to cart
    inventoryPage.addProductToCart(item1.name);
    inventoryPage.addProductToCart(item2.name);
    inventoryPage.header.verifyCartBadgeCount(2);

    // 2. Navigate to Cart and proceed to checkout
    inventoryPage.header.clickCart();
    cartPage.verifyCartLoaded();
    cartPage.verifyProductInCart(item1.name, item1.price);
    cartPage.verifyProductInCart(item2.name, item2.price);
    cartPage.clickCheckout();

    // 3. Step 1: Customer Information
    checkoutPage.verifyStepOneLoaded();
    checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
    checkoutPage.clickContinue();

    // 4. Step 2: Overview & Pricing Validation
    checkoutPage.verifyStepTwoLoaded();
    checkoutPage.verifyPriceCalculations();

    // 5. Complete purchase
    checkoutPage.clickFinish();

    // 6. Step 3: Complete Screen Confirmation
    checkoutPage.verifyOrderComplete();

    // 7. Return to Products catalog
    checkoutPage.clickBackHome();
    inventoryPage.verifyInventoryLoaded();
    inventoryPage.header.verifyCartBadgeNotVisible();
  });

  it('TC-CHK-02: Should validate mandatory First Name on checkout step 1', () => {
    const item = productsData.sauceLabsBackpack;
    const customer = checkoutData.missingFirstName;

    inventoryPage.addProductToCart(item.name);
    inventoryPage.header.clickCart();
    cartPage.clickCheckout();

    checkoutPage.verifyStepOneLoaded();
    checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
    checkoutPage.clickContinue();

    checkoutPage.verifyErrorMessage(customer.expectedError);
  });

  it('TC-CHK-03: Should validate mandatory Last Name on checkout step 1', () => {
    const item = productsData.sauceLabsBackpack;
    const customer = checkoutData.missingLastName;

    inventoryPage.addProductToCart(item.name);
    inventoryPage.header.clickCart();
    cartPage.clickCheckout();

    checkoutPage.verifyStepOneLoaded();
    checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
    checkoutPage.clickContinue();

    checkoutPage.verifyErrorMessage(customer.expectedError);
  });

  it('TC-CHK-04: Should validate mandatory Postal Code on checkout step 1', () => {
    const item = productsData.sauceLabsBackpack;
    const customer = checkoutData.missingPostalCode;

    inventoryPage.addProductToCart(item.name);
    inventoryPage.header.clickCart();
    cartPage.clickCheckout();

    checkoutPage.verifyStepOneLoaded();
    checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
    checkoutPage.clickContinue();

    checkoutPage.verifyErrorMessage(customer.expectedError);
  });

  it('TC-CHK-05: Should allow cancelling checkout step 1 and return to Cart', () => {
    inventoryPage.addProductToCart(productsData.sauceLabsBackpack.name);
    inventoryPage.header.clickCart();
    cartPage.clickCheckout();

    checkoutPage.verifyStepOneLoaded();
    checkoutPage.clickCancel();

    cartPage.verifyCartLoaded();
  });

  it('TC-CHK-06: Should allow cancelling checkout step 2 and return to Inventory', () => {
    const customer = checkoutData.validCustomer;

    inventoryPage.addProductToCart(productsData.sauceLabsBackpack.name);
    inventoryPage.header.clickCart();
    cartPage.clickCheckout();

    checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);
    checkoutPage.clickContinue();

    checkoutPage.verifyStepTwoLoaded();
    checkoutPage.clickCancel();

    inventoryPage.verifyInventoryLoaded();
  });
});
