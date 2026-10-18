const BasePage = require('./BasePage');

/**
 * LoginPage - Encapsulates actions and elements for the SauceDemo login page
 * using human-like pacing and natural typing speed.
 */
class LoginPage extends BasePage {
  elements = {
    usernameInput: () => cy.get('[data-test="username"]'),
    passwordInput: () => cy.get('[data-test="password"]'),
    loginButton: () => cy.get('[data-test="login-button"]'),
    errorMessage: () => cy.get('[data-test="error"]'),
    errorDismissButton: () => cy.get('[data-test="error-button"], .error-button'),
    loginCredentialsWrapper: () => cy.get('.login_credentials_wrap'),
    loginLogo: () => cy.get('.login_logo'),
  };

  visit() {
    this.navigate('/');
    this.verifyLoginPageLoaded();
    cy.humanPause(250);
    return this;
  }

  verifyLoginPageLoaded() {
    this.elements.usernameInput().should('be.visible');
    this.elements.passwordInput().should('be.visible');
    this.elements.loginButton().should('be.visible');
    return this;
  }

  enterUsername(username) {
    if (username) {
      this.elements.usernameInput().humanType(username);
    } else {
      this.elements.usernameInput().clear();
      cy.humanPause(150);
    }
    return this;
  }

  enterPassword(password) {
    if (password) {
      this.elements.passwordInput().humanType(password, { log: false });
    } else {
      this.elements.passwordInput().clear();
      cy.humanPause(150);
    }
    return this;
  }

  clickLogin() {
    this.elements.loginButton().humanClick();
    return this;
  }

  login(username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLogin();
  }

  verifyErrorMessage(expectedErrorMessage) {
    this.elements.errorMessage()
      .should('be.visible')
      .and('contain.text', expectedErrorMessage);
    cy.humanPause(350);
    return this;
  }

  dismissError() {
    this.elements.errorDismissButton().humanClick();
    this.elements.errorMessage().should('not.exist');
    return this;
  }
}

module.exports = new LoginPage();
