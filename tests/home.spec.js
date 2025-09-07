const { test, expect } = require('@playwright/test');
const { HomePage } = require('../Pages/Homepage');
const { RegisterPage } = require('../Pages/registerpage');

test('Navigate to Notebooks from Home Page', async ({ page }) => {
  // Create HomePage object
  const homePage = new HomePage(page);
const registerPage = new RegisterPage(page);

  // Step 2: Go to homepage
  await registerPage.goto();

  // Step 3: Open Register page
  await registerPage.openRegisterPage();

  // Step 4: Fill form and complete registration
  const email = await registerPage.registerUser('Simra', 'Majeed', 'simra123');

  // Step 5: Assertion - Verify user email is visible in top menu (logged in state)
  await expect(page.getByRole('link', { name: email })).toBeVisible();

  // Step 1: Go to homepage
  await homePage.goto();

  // Step 2: Navigate to Notebooks
  await homePage.navigateToNotebooks();

  // Assertion: Verify that the URL is correct
  await expect(page).toHaveURL(/.*notebooks/);

  // (Optional) Verify page title
  await expect(page).toHaveTitle(/Demo Web Shop/);
});
