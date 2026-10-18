# SauceDemo Cypress E2E Automation Framework 🚀

A production-ready, scalable End-to-End (E2E) Test Automation Framework built with the latest version of **Cypress** utilizing the **Page Object Model (POM)** design pattern. It automates and validates user journeys on the [SauceDemo](https://www.saucedemo.com/) e-commerce web application.

---

## 📋 Table of Contents
- [Architecture & Design Principles](#-architecture--design-principles)
- [Folder Structure](#-folder-structure)
- [Test Scenarios Matrix](#-test-scenarios-matrix)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running Tests](#-running-tests)
- [Best Practices Implemented](#-best-practices-implemented)
- [Reporting & Artifacts](#-reporting--artifacts)

---

## 🏛 Architecture & Design Principles

This framework adheres to industry-standard testing best practices:

1. **Page Object Model (POM):**
   - Keeps selectors and page-specific interactions encapsulated within page objects (`cypress/pages/`).
   - Improves test maintainability and code reusability across test suites.
   - Shared components like headers, sidebar menus, and cart badges are isolated into reusable modular components (`cypress/pages/components/HeaderComponent.js`).

2. **Data-Driven Testing (Fixtures):**
   - Test data and user personas (valid, locked-out, invalid credentials, checkout customer info) reside in `cypress/fixtures/`.
   - Avoids hard-coded strings in spec files.

3. **Cypress Retry-ability & Flakiness Elimination:**
   - Zero hard-coded `cy.wait(number)` statements.
   - Relies on Cypress's built-in assertions, element query retry logic, and command chaining.

4. **Robust Selectors:**
   - Prioritizes dedicated `data-test` test attributes provided by SauceDemo for stable, resilient element selection.

---

## 📁 Folder Structure

```text
d:/Cypress/cypress_2/
├── .gitignore                      # Git ignore rules for node_modules, reports, videos, screenshots
├── cypress.config.js               # Central Cypress configuration (timeouts, baseUrl, retries, env)
├── package.json                    # Scripts and dependencies
├── README.md                       # Comprehensive documentation
└── cypress/
    ├── fixtures/                   # Test data (JSON)
    │   ├── users.json              # Credentials for standard, locked-out, invalid users
    │   ├── products.json           # Catalog metadata, sort keys, prices
    │   └── checkoutData.json       # Customer billing and shipping profiles
    ├── pages/                      # Page Object Model layer
    │   ├── BasePage.js             # Common base methods (navigation, url, titles)
    │   ├── LoginPage.js            # Login screen actions and assertions
    │   ├── InventoryPage.js        # Products catalog, sort logic, cart toggling
    │   ├── CartPage.js             # Cart items review and removal
    │   ├── CheckoutPage.js         # Step 1 (Info), Step 2 (Overview), Step 3 (Confirmation)
    │   └── components/
    │       └── HeaderComponent.js  # App header, burger menu, cart badge, logout
    ├── support/                    # Cypress global hooks and custom commands
    │   ├── commands.js             # Reusable custom commands (cy.login, cy.verifyCartBadge, etc.)
    │   ├── e2e.js                  # Support entry file & uncaught exception handling
    │   └── index.d.ts              # TypeScript declarations for custom commands intellisense
    └── e2e/                        # Test specification files
        ├── 01_auth.cy.js           # Authentication & session scenarios
        ├── 02_inventory_sorting.cy.js # Product catalog & sort verification
        ├── 03_cart_operations.cy.js   # Cart additions, removals, badge state
        └── 04_checkout_e2e.cy.js      # E2E purchase order and checkout validations
```

---

## 🧪 Test Scenarios Matrix

| Test Suite | Spec File | Test Case ID | Description | Type |
|---|---|---|---|---|
| **Auth** | `01_auth.cy.js` | TC-AUTH-01 | Successful login with `standard_user` | Positive |
| **Auth** | `01_auth.cy.js` | TC-AUTH-02 | Error display for `locked_out_user` | Negative |
| **Auth** | `01_auth.cy.js` | TC-AUTH-03 | Error display for invalid credentials | Negative |
| **Auth** | `01_auth.cy.js` | TC-AUTH-04 | Validation error for empty username | Negative |
| **Auth** | `01_auth.cy.js` | TC-AUTH-05 | Validation error for empty password | Negative |
| **Auth** | `01_auth.cy.js` | TC-AUTH-06 | Logout via burger menu & redirection | Positive |
| **Inventory** | `02_inventory_sorting.cy.js` | TC-INV-01 | Catalog loads with all 6 products | Positive |
| **Inventory** | `02_inventory_sorting.cy.js` | TC-INV-02 | Sort products alphabetically (A to Z) | Positive |
| **Inventory** | `02_inventory_sorting.cy.js` | TC-INV-03 | Sort products reverse alphabetically (Z to A) | Positive |
| **Inventory** | `02_inventory_sorting.cy.js` | TC-INV-04 | Sort products by price (Low to High) | Positive |
| **Inventory** | `02_inventory_sorting.cy.js` | TC-INV-05 | Sort products by price (High to Low) | Positive |
| **Cart** | `03_cart_operations.cy.js` | TC-CART-01 | Add single product, verify badge & button state | Positive |
| **Cart** | `03_cart_operations.cy.js` | TC-CART-02 | Add multiple products, verify badge count increments | Positive |
| **Cart** | `03_cart_operations.cy.js` | TC-CART-03 | Remove product from inventory catalog, verify badge | Positive |
| **Cart** | `03_cart_operations.cy.js` | TC-CART-04 | Verify cart page items, names, and prices match | Positive |
| **Cart** | `03_cart_operations.cy.js` | TC-CART-05 | Remove product directly from Cart page | Positive |
| **Cart** | `03_cart_operations.cy.js` | TC-CART-06 | Continue Shopping returns to inventory with cart intact | Positive |
| **Checkout** | `04_checkout_e2e.cy.js` | TC-CHK-01 | Full E2E checkout journey + price calculations | E2E Happy Path |
| **Checkout** | `04_checkout_e2e.cy.js` | TC-CHK-02 | Validate mandatory First Name | Negative |
| **Checkout** | `04_checkout_e2e.cy.js` | TC-CHK-03 | Validate mandatory Last Name | Negative |
| **Checkout** | `04_checkout_e2e.cy.js` | TC-CHK-04 | Validate mandatory Postal Code | Negative |
| **Checkout** | `04_checkout_e2e.cy.js` | TC-CHK-05 | Cancel on step 1 returns to Cart | Negative / Flow |
| **Checkout** | `04_checkout_e2e.cy.js` | TC-CHK-06 | Cancel on step 2 returns to Inventory | Negative / Flow |

---

## ⚡ Prerequisites

- **Node.js**: v18.x or higher (tested on Node v20+ / v24+)
- **NPM**: v9.x or higher

---

## 📥 Installation & Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd d:/Cypress/cypress_2
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Verify Cypress binary:**
   ```bash
   npx cypress verify
   ```

---

## 🚀 Running Tests

### 1. Interactive Test Runner (Cypress GUI)
Opens Cypress Launchpad where you can choose browser, inspect DOM live, and debug steps:
```bash
npm run cypress:open
# Or directly:
npx cypress open
```

### 2. Headless Mode (All Specs)
Executes all test suites in the terminal in headless Electron:
```bash
npm run cypress:run
# Or directly:
npx cypress run
```

### 3. Run on Specific Browsers
```bash
# Chrome
npm run cypress:run:chrome
# Or: npx cypress run --browser chrome

# Firefox
npm run cypress:run:firefox
# Or: npx cypress run --browser firefox

# Edge
npm run cypress:run:edge
# Or: npx cypress run --browser edge
```

### 4. Run Individual Test Suites
```bash
# Authentication tests
npm run test:auth

# Inventory & sorting tests
npm run test:inventory

# Cart operations tests
npm run test:cart

# Full Checkout E2E tests
npm run test:checkout
```

---

## 💡 Best Practices Implemented

- **Page Object Model**: Keeps test specifications clean, readable, and free of low-level DOM queries.
- **Dynamic Price Calculations**: The checkout test dynamically sums the price of each item on the overview page, verifies the Subtotal label, checks the Tax calculation, and ensures `Total = Subtotal + Tax`.
- **Custom Cypress Commands**: Custom helper commands like `cy.login()`, `cy.loginBySession()`, `cy.addProductToCart()`, and `cy.verifyCartBadge()` are registered in `cypress/support/commands.js`.
- **TypeScript Definitions**: Defined in `cypress/support/index.d.ts` for full autocompletion and type safety in VS Code.
- **Auto Screenshots on Failure**: Configured in `cypress.config.js` (`screenshotOnRunFailure: true`).
- **Retries**: 1 automatic retry on run mode (`retries: { runMode: 1, openMode: 0 }`) to guard against intermittent network blips in CI.

---

## 📊 Reporting & Artifacts

- Failed test screenshots are automatically captured under `cypress/screenshots/`.
- Test execution videos (when enabled) are saved under `cypress/videos/`.
