// Pages/CartPage.js
class CartPage {
  constructor(page) {
    this.page = page;

    // Page Title
    this.pageTitle = page.locator('.page-title h1');

    // Product in cart
    this.firstProductName = page.locator('.cart-item-row .product a.product-name');

    // Cart Totals
    this.cartSubTotal = page.locator('.cart-total tr:nth-child(1) .product-price');
    this.shippingCost = page.locator('.cart-total tr:nth-child(2) .product-price');
    this.tax = page.locator('.cart-total tr:nth-child(3) .product-price');
    this.total = page.locator('.cart-total tr:nth-child(4) .product-price.order-total');

    // 🔹 Address Section
    this.countryDropdown = page.locator('#CountryId');
    this.stateDropdown = page.locator('#StateProvinceId');
    this.postalCodeInput = page.locator('#ZipPostalCode');

    this.termsCheckbox = page.locator('#termsofservice');
    
  }

  async goto() {
    await this.page.goto('https://demowebshop.tricentis.com/cart');
  }

  async getPageTitle() {
    return this.pageTitle.textContent();
  }

  async getFirstProductName() {
    return this.firstProductName.textContent();
  }

  async getCartTotals() {
    // Wait for all cart total elements to be visible
    await this.cartSubTotal.waitFor({ state: 'visible', timeout: 10000 });
    await this.shippingCost.waitFor({ state: 'visible', timeout: 10000 });
    await this.tax.waitFor({ state: 'visible', timeout: 10000 });
    await this.total.waitFor({ state: 'visible', timeout: 10000 });

    const subtotal = parseFloat(await this.cartSubTotal.textContent());
    const shipping = parseFloat(await this.shippingCost.textContent());
    const tax = parseFloat(await this.tax.textContent());
    const total = parseFloat(await this.total.textContent());

    return { subtotal, shipping, tax, total };
}


  // 🔹 Address Methods
  async selectCountry(countryName) {
    await this.countryDropdown.selectOption({ label: countryName });
  }

  async selectState(stateName) {
  const dropdown = this.stateDropdown;
  await dropdown.waitFor({ state: 'visible', timeout: 5000 });

  // Get all option elements
  const options = await dropdown.locator('option').all();

  let found = false;
  for (const option of options) {
    const text = await option.innerText();
    const value = await option.getAttribute('value');

    if (text.trim() === stateName) {
      await dropdown.selectOption(value); // select by numeric value
      found = true;
      break;
    }
  }

  // Fallback if not found
  if (!found) {
    await dropdown.selectOption('0'); // default "Other (Non US)"
  }
}


  async enterPostalCode(zip) {
    await this.postalCodeInput.fill(zip);
  }

  // For assertions
  async getSelectedCountry() {
    return this.countryDropdown.inputValue();
  }

  async getSelectedState() {
    return this.stateDropdown.inputValue();
  }

  async getPostalCode() {
    return this.postalCodeInput.inputValue();
  }
  // Terms of Service
  async checkTermsOfService() {
    await this.termsCheckbox.check();
  }

  async isTermsChecked() {
    return this.termsCheckbox.isChecked();
  }

}

module.exports = { CartPage };
