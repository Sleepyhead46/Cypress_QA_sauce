const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
    requestTimeout: 8000,
    responseTimeout: 8000,
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    video: false,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    expose: {
      standardUser: "standard_user",
      lockedUser: "locked_out_user",
      defaultPassword: "secret_sauce",
      humanMode: true,
      humanTypingDelay: 50,
      humanActionDelay: 250,
    },
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
