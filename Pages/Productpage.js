class ProductPage {
  constructor(page) {
    this.page = page;
    // maybe missing this line 👇
    this.productTitle = page.locator('div.product-name h1');
    this.productPrice = page.locator('span[itemprop="price"]');
    this.addToCartBtn = page.locator('#add-to-cart-button-31'); // ✅ specific locator

    this.cartQty = page.locator('span.cart-qty'); // example
  }

  async openLaptopProduct() {
  // precise: clicks the link with visible text "14.1-inch Laptop"
  await this.page.getByRole('link', { name: '14.1-inch Laptop', exact: true }).click();
}

  async getProductName() {
    return this.productTitle.textContent(); // this was undefined
  }

  async getProductPrice() {
    return this.productPrice.textContent();
  }

  async addToCart() {
    await this.addToCartBtn.click();
    await this.page.waitForTimeout(2000);
  }

 async getCartQuantity() {
  // Wait until cart quantity is no longer "(0)"
  await this.page.waitForFunction(() => {
    const qty = document.querySelector('span.cart-qty')?.textContent;
    return qty && qty !== '(0)';
  });
  return await this.cartQty.textContent();
 
}

}
module.exports = { ProductPage };