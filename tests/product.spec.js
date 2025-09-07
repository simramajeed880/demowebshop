const { test, expect } = require('@playwright/test');
const { HomePage } = require('../Pages/Homepage');
const { ProductPage } = require('../Pages/Productpage');
const { RegisterPage } = require('../Pages/registerpage');


test('Verify product page for 14.1-inch Laptop', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  // Step 2: Go to homepage
  await registerPage.goto();

  // Step 3: Open Register page
  await registerPage.openRegisterPage();

  // Step 4: Fill form and complete registration
  const email = await registerPage.registerUser('Simra', 'Majeed', 'simra123');
  // Step 1: Open homepage
  const homePage = new HomePage(page);
  await homePage.goto();

  // Step 2: Navigate to Notebooks page
  await homePage.navigateToNotebooks();

  // Step 3: Open product "14.1-inch Laptop"y
  
  const productPage = new ProductPage(page);
  await productPage.openLaptopProduct();
await page.screenshot({ path: 'after-product-open.png' });

  // Step 4: Verify product page details

  // Check product name
  const name = await productPage.getProductName();
  await expect(name).toContain('14.1-inch Laptop');

  // Check product price (dummy check, will depend on site data)
  const price = await productPage.getProductPrice();
  await expect(price).toContain('1590.00');

  // Step 5: Add to cart
  await productPage.addToCart();

  // Verify cart quantity is updated
  const qty = await productPage.getCartQuantity();
  await expect(qty).toContain('(1)');
});
