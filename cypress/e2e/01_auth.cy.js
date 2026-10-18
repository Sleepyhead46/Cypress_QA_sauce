const loginPage = require('../pages/LoginPage');
const inventoryPage = require('../pages/InventoryPage');

describe('Authentication & Session Management Suite', () => {
  let usersData;

  before(() => {
    // Load test data fixture before running tests
    cy.fixture('users').then((data) => {
      usersData = data;
    });
  });

  beforeEach(() => {
    loginPage.visit();
  });

  it('TC-AUTH-01: Should login successfully with valid credentials', () => {
    const { username, password } = usersData.validUser;

    loginPage.login(username, password);

    // Verify successful redirection to inventory
    inventoryPage.verifyInventoryLoaded();
  });

  it('TC-AUTH-02: Should display error for locked out user', () => {
    const { username, password, expectedError } = usersData.lockedOutUser;

    loginPage.login(username, password);

    // Assert the exact locked out error notification
    loginPage.verifyErrorMessage(expectedError);
  });

  it('TC-AUTH-03: Should display error for invalid credentials', () => {
    const { username, password, expectedError } = usersData.invalidCredentials;

    loginPage.login(username, password);

    // Assert error message for invalid credentials
    loginPage.verifyErrorMessage(expectedError);
  });

  it('TC-AUTH-04: Should validate mandatory username field', () => {
    const { username, password, expectedError } = usersData.emptyUsername;

    loginPage.login(username, password);

    loginPage.verifyErrorMessage(expectedError);
  });

  it('TC-AUTH-05: Should validate mandatory password field', () => {
    const { username, password, expectedError } = usersData.emptyPassword;

    loginPage.login(username, password);

    loginPage.verifyErrorMessage(expectedError);
  });

  it('TC-AUTH-06: Should allow an authenticated user to logout successfully', () => {
    const { username, password } = usersData.validUser;

    // Login first
    loginPage.login(username, password);
    inventoryPage.verifyInventoryLoaded();

    // Perform logout via sidebar navigation
    inventoryPage.header.logout();

    // Verify redirected back to login screen
    loginPage.verifyLoginPageLoaded();
  });
});
