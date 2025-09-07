const { test, expect } = require('@playwright/test');
const { HomePage } = require('../Pages/Homepage');
const { ProductPage } = require('../Pages/Productpage');
const { CartPage } = require('../Pages/Cartpage');
const { CheckoutPage } = require('../Pages/Checkoutpage');
const { RegisterPage } = require('../Pages/registerpage');
const { ConfirmPage } = require('../Pages/Confirmationpage');

const datasets = require('../Pages/Testdata/datasets.json');

datasets.forEach(data => {
  test(`Data-driven purchase flow for ${data.firstName} ${data.lastName}`, async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Go to homepage & open register page
    await registerPage.goto();
    await registerPage.openRegisterPage();

    // ✅ Use dataset email directly instead of generating unique one
await registerPage.registerUserWithData(data.firstName, data.lastName, data.email, data.password);

    // ✅ Assert dataset email is visible in the header after registration
await expect(page.getByRole('link', { name: data.email })).toBeVisible();
// ✅ Assert dataset email is visible in the header after registration
await expect(page.getByRole('link', { name: data.email })).toBeVisible();

    // Navigate to product
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.navigateToNotebooks();

    const productPage = new ProductPage(page);
    await productPage.openLaptopProduct();
    await productPage.addToCart();

    // Cart page
    const cartPage = new CartPage(page);
    await cartPage.goto();

    const title = await cartPage.getPageTitle();
    await expect(title).toContain('Shopping cart');

    const productName = await cartPage.getFirstProductName();
    await expect(productName).toContain('14.1-inch Laptop');

    const totals = await cartPage.getCartTotals();
    await expect(totals.total).toBe(1590.00);

    // Address
    await cartPage.selectCountry(data.country);
    await cartPage.selectState(data.state);
    await cartPage.enterPostalCode(data.zip);

    await cartPage.checkTermsOfService();
    const checkoutButton = page.locator('button#checkout');
    await checkoutButton.click();

    // Checkout page
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.assertOnCheckoutPage();
    await checkoutPage.fillBillingAddressWithData(data);

    await checkoutPage.assertBillingAddressWithData(data);
    await checkoutPage.clickBillingContinue();

    await checkoutPage.waitForShippingPage();
    await checkoutPage.clickShippingContinue();

    await checkoutPage.waitForShippingMethodPage();
    await checkoutPage.assertGroundShippingSelected();
    await checkoutPage.clickShippingMethodContinue();

    await checkoutPage.waitForPaymentMethodPage();
    await checkoutPage.assertCashOnDeliverySelected();
    await checkoutPage.clickPaymentMethodContinue();

    await checkoutPage.waitForPaymentInfoPage();
    const paymentInfoText = await page.locator(checkoutPage.paymentInfoMessage).innerText();
    await expect(paymentInfoText).toContain('You will pay by COD');
    await checkoutPage.clickPaymentInfoContinue();

    // Confirm order
    const confirmPage = new ConfirmPage(page);
    await confirmPage.waitForConfirmOrderPage();

    await confirmPage.assertConfirmOrderAddressesWithDataset(data);


    await confirmPage.clickConfirmOrder();
    await confirmPage.assertThankYouPage();

    // Get dynamic order number
    const actualOrderNumber = await confirmPage.getOrderNumber();
    console.log(`✅ Order placed for ${data.firstName} ${data.lastName}. Order Number: ${actualOrderNumber}`);
    expect(Number(actualOrderNumber)).toBeGreaterThan(0);

    await page.screenshot({ path: `thankyou-${data.firstName}.png`, fullPage: true });
  });
});
