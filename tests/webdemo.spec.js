const { test, expect } = require('@playwright/test');
const { HomePage } = require('../Pages/Homepage');
const { ProductPage } = require('../Pages/Productpage');
const { CartPage } = require('../Pages/Cartpage');
const { CheckoutPage } = require('../Pages/Checkoutpage');
const { RegisterPage } = require('../Pages/registerpage');
const { ConfirmPage } = require('../Pages/Confirmationpage');



test('Complete ecommerce web demo purchase flow', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  // Step 2: Go to homepage
  await registerPage.goto();

  // Step 3: Open Register page
  await registerPage.openRegisterPage();

  // Step 4: Fill form and complete registration
  const email = await registerPage.registerUser('Simra', 'Majeed', 'simra222');
  // Step 1: Go to homepage
  
  const homePage = new HomePage(page);
  await homePage.goto();

  // Step 2: Navigate to Notebooks
  await homePage.navigateToNotebooks();

  // Step 3: Open product page
  const productPage = new ProductPage(page);
  await productPage.openLaptopProduct();

  // Step 4: Add product to cart
  await productPage.addToCart();

  // Step 5: Go to Cart
  const cartPage = new CartPage(page);
  await cartPage.goto();

  // Step 6: Assertions - Page title
  const title = await cartPage.getPageTitle();
  await expect(title).toContain('Shopping cart');

  // Step 7: Assertions - Product name
  const productName = await cartPage.getFirstProductName();
  await expect(productName).toContain('14.1-inch Laptop');

  // Step 8: Assertions - Cart Totals
  const totals = await cartPage.getCartTotals();
  await expect(totals.subtotal).toBe(1590.00);
  await expect(totals.shipping).toBe(0.00);
  await expect(totals.tax).toBe(0.00);
  await expect(totals.total).toBe(1590.00);

  // Step 9: Set Address (Country, State, Zip)
  await cartPage.selectCountry('Pakistan');
  await cartPage.selectState('Other (Non US)');
  await cartPage.enterPostalCode('74800');

  // Step 10: Assertions - Address
  const countryValue = await cartPage.getSelectedCountry();
  const stateValue = await cartPage.getSelectedState();
  const postalCode = await cartPage.getPostalCode();

  await expect(countryValue).toBe('57');  // Pakistan has value=57
  await expect(stateValue).toBe('0');     // Non US has value=0
  await expect(postalCode).toBe('74800');

  // Step 11: Accept Terms of Service
await cartPage.checkTermsOfService();

// Assertion - Verify it is checked
const isChecked = await cartPage.isTermsChecked();
await expect(isChecked).toBeTruthy();
 await page.screenshot({ path: 'terms-checked.png' });

 const checkoutButton = page.locator('button#checkout');
  await expect(checkoutButton).toBeVisible();   // Assertion: Checkout button is visible
  await checkoutButton.click();

  // Step 10: Assert we are on Checkout page
  const checkoutPage = new CheckoutPage(page);
  const onCheckout = await checkoutPage.assertOnCheckoutPage();
  await expect(onCheckout).toBeTruthy(); 
  await page.screenshot({ path: 'final-checkout.png', fullPage: true });

  // Step 11: Fill Billing Address
    const registeredEmail = 'simramajeed97@gmail.com';
    await checkoutPage.fillBillingAddress(registeredEmail);

    // Step 12: Assert Billing Address is filled correctly
    await checkoutPage.assertBillingAddress(registeredEmail);

    // Step 13: Click Continue to proceed
    await checkoutPage.clickBillingContinue();

    // Optional screenshot after continue
    await page.screenshot({ path: 'billing-continue.png', fullPage: true });

    // ---------- Shipping Step ----------
    // Step 5: Wait for Shipping Page
    await checkoutPage.waitForShippingPage();

    // Step 7: Click Continue for Shipping
    await checkoutPage.clickShippingContinue();

    //Optional: Screenshot after shipping step
    await page.screenshot({ path: 'shipping-step.png', fullPage: true });

    //SHIPPING METHOD FUNCTIONS CALL
    await checkoutPage.waitForShippingMethodPage();
    await checkoutPage.assertGroundShippingSelected();
    await checkoutPage.clickShippingMethodContinue();
// Optional screenshot
await page.screenshot({ path: 'shipping-method-step.png', fullPage: true });

// Wait for Payment Method page
await checkoutPage.waitForPaymentMethodPage();

// Assert Cash On Delivery is selected
await checkoutPage.assertCashOnDeliverySelected();

// Click Continue to go to the next step
await checkoutPage.clickPaymentMethodContinue();

// Optional screenshot
await page.screenshot({ path: 'payment-method-step.png', fullPage: true });

// Wait for Payment Information page
await checkoutPage.waitForPaymentInfoPage();
// Assert the payment method info (COD)
// Here we can check for specific text or elements that confirm COD is selected
const paymentInfoText = await page.locator(checkoutPage.paymentInfoMessage).innerText();
await expect(paymentInfoText).toContain('You will pay by COD');
// Click Continue to proceed
await checkoutPage.clickPaymentInfoContinue();
// Optional screenshot
await page.screenshot({ path: 'payment-info-step.png', fullPage: true });

  // ---------- Confirm Order Step ----------
  const confirmPage = new ConfirmPage(page);

  // Step 1: Wait for Confirm Order Page
  await confirmPage.waitForConfirmOrderPage();

  // Step 2: Assert addresses match expected input
  await confirmPage.assertConfirmOrderAddresses({
    name: "Simra Majeed",
    email: "simramajeed97@gmail.com",
    phone: "03312645078",
    city: "Karachi",
    address: "PIB Colony",
    zip: "74800",
    country: "Pakistan"
  });

  // Step 3: Click Confirm Order
  await confirmPage.clickConfirmOrder();

  // Screenshot after confirmation
  await page.screenshot({ path: 'confirm-order.png', fullPage: true });
  // Verify Thank You page
  await confirmPage.assertThankYouPage();

  // ✅ New (dynamic)
const actualOrderNumber = await confirmPage.getOrderNumber();
console.log(`✅ Order placed successfully. Order Number: ${actualOrderNumber}`);

// You can add a basic assertion that it’s not empty / valid number
expect(Number(actualOrderNumber)).toBeGreaterThan(0);


  await page.screenshot({ path: 'thankyou-page.png', fullPage: true });


});
