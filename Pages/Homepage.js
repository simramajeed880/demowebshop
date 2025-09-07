class HomePage {
  constructor(page) {
    this.page = page;

    // Locators
    this.computersMenu = page.getByRole('link', { name: 'Computers' }).first();
    this.notebooksMenu = page.locator('ul.top-menu').getByRole('link', { name: 'Notebooks' });
  }

  async goto() {
    await this.page.goto('https://demowebshop.tricentis.com/');
  }
//these are the actions 

  async navigateToNotebooks() {
    await this.computersMenu.click();
  await this.notebooksMenu.click();

  // ✅ Wait until the Notebooks page heading is visible
  await this.page.getByRole('heading', { name: 'Notebooks' }).waitFor();
await this.page.waitForTimeout(2000);//this i have applied hard wait for debugging purpose
  }
}

module.exports = { HomePage };
