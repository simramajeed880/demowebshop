// tests/register.spec.js
const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../Pages/registerpage');

test('Register a new user', async ({ page }) => {
  // Step 1: Create RegisterPage object
  const registerPage = new RegisterPage(page);

  // Step 2: Go to homepage
  await registerPage.goto();

  // Step 3: Open Register page
  await registerPage.openRegisterPage();

  // Step 4: Fill form and complete registration
  const email = await registerPage.registerUser('Simra', 'Majeed', 'simra123');

  // Step 5: Assertion - Verify user email is visible in top menu (logged in state)
  await expect(page.getByRole('link', { name: email })).toBeVisible();

  // Step 6: Take final screenshot
  await page.screenshot({ path: 'final-registration.png', fullPage: true });
});
