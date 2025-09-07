const { expect } = require('@playwright/test');

// Pages/RegisterPage.js
class RegisterPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.registerLink = page.locator('a.ico-register'); 
    this.genderFemale = page.locator('#gender-female');
    this.firstName = page.locator('#FirstName');
    this.lastName = page.locator('#LastName');
    this.email = page.locator('#Email');
    this.password = page.locator('#Password');
    this.confirmPassword = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('#register-button');
    this.successMessage = page.locator('text=Your registration completed');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async goto() {
    await this.page.goto('https://demowebshop.tricentis.com/');
  }

  async openRegisterPage() {
    await this.registerLink.click();
    await this.page.waitForSelector('h1:has-text("Register")');
  }

  async registerUser() {
    // ✅ Fixed dummy test data
    const firstName = 'Simra';
    const lastName = 'Majeed';
    const email = 'simra20010@gmail.com';
    const password = 'simra222';

    await this.genderFemale.check();
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.confirmPassword.fill(password);
    await this.registerButton.click();

    // Assertion: registration success
    await this.successMessage.waitFor();
    await this.continueButton.click();

    // Verify user is logged in (email visible top-right)
    await this.page.getByRole('link', { name: email }).waitFor();

    // Screenshot
    await this.page.screenshot({ path: 'registration-success.png', fullPage: true });

    // Return credentials so spec can use them for login
    return { email, password };
  }

  // ✅ New: dataset-based registration
  async registerUserWithData(firstName, lastName, email, password) {
    await this.genderFemale.check();
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.confirmPassword.fill(password);
    await this.registerButton.click();

    // Assertion: registration success
      await expect(this.successMessage).toBeVisible({ timeout: 60000 });

    await this.continueButton.click();

    // Verify user is logged in with dataset email
    await this.page.getByRole('link', { name: email }).waitFor();

    await this.page.screenshot({ path: `registration-${firstName}.png`, fullPage: true });

    return { email, password };
  }

}

module.exports = { RegisterPage };
