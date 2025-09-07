// Pages/CheckoutPage.js
class CheckoutPage {
    constructor(page) {
        this.page = page;

        // Billing Address Selectors
        this.firstName = '#BillingNewAddress_FirstName';
        this.lastName = '#BillingNewAddress_LastName';
        this.email = '#BillingNewAddress_Email';
        this.country = '#BillingNewAddress_CountryId';
        this.state = '#BillingNewAddress_StateProvinceId';
        this.city = '#BillingNewAddress_City';
        this.address1 = '#BillingNewAddress_Address1';
        this.zip = '#BillingNewAddress_ZipPostalCode';
        this.phone = '#BillingNewAddress_PhoneNumber';
        this.billingContinueButton = '#billing-buttons-container input.new-address-next-step-button';

        // Shipping Address Selectors
       
        this.shippingStepTitle = 'li#opc-shipping .step-title h2';
        this.shippingContinueButton = 'li#opc-shipping input.new-address-next-step-button';
        //shipping method page 
        this.shippingMethodStepTitle = 'li#opc-shipping_method .step-title h2';
        this.groundShippingRadio = '#shippingoption_0';
this.shippingMethodContinueButton = 'li#opc-shipping_method input.shipping-method-next-step-button';

// Payment Method Selectors
this.paymentMethodStepTitle = 'li#opc-payment_method .step-title h2';
this.cashOnDeliveryRadio = '#paymentmethod_0';
this.paymentMethodContinueButton = 'li#opc-payment_method input.payment-method-next-step-button';

// Payment Information Selectors
this.paymentInfoStepTitle = 'li#opc-payment_info .step-title h2';
this.paymentInfoMessage = 'li#opc-payment_info .info p';
this.paymentInfoContinueButton = 'li#opc-payment_info input.payment-info-next-step-button';



    
    }

    // -------------------- Billing --------------------
    async assertOnCheckoutPage() {
        return this.page.url().includes('checkout');
    }

    async fillBillingAddress(email) {
        await this.page.fill(this.firstName, 'Simra');
        await this.page.fill(this.lastName, 'Majeed');
        await this.page.fill(this.email, email);
        await this.page.selectOption(this.country, '57'); // Pakistan
        await this.page.selectOption(this.state, '0');    // Other (Non US)
        await this.page.fill(this.city, 'Karachi');
        await this.page.fill(this.address1, 'PIB Colony');
        await this.page.fill(this.zip, '74800');
        await this.page.fill(this.phone, '03312645078');
    }

    // 🔹 New method → for dataset-driven tests
    async fillBillingAddressWithData(data) {
        await this.page.fill(this.firstName, data.firstName);
        await this.page.fill(this.lastName, data.lastName);
        await this.page.fill(this.email, data.email);
        await this.page.selectOption(this.country, { label: data.country });
        if (data.state) {
            await this.page.selectOption(this.state, { label: data.state });
        }
        await this.page.fill(this.city, data.city);
        await this.page.fill(this.address1, data.address);
        await this.page.fill(this.zip, data.zip);
        await this.page.fill(this.phone, data.phone);
    }

    // ✅ New assertion (dataset-driven)
    async assertBillingAddressWithData(data) {
        const firstNameValue = await this.page.inputValue(this.firstName);
        const lastNameValue = await this.page.inputValue(this.lastName);
        const emailValue = await this.page.inputValue(this.email);
        const cityValue = await this.page.inputValue(this.city);
        const addressValue = await this.page.inputValue(this.address1);
        const zipValue = await this.page.inputValue(this.zip);
        const phoneValue = await this.page.inputValue(this.phone);

        if (
            firstNameValue !== data.firstName ||
            lastNameValue !== data.lastName ||
            emailValue !== data.email ||
            cityValue !== data.city ||
            addressValue !== data.address ||
            zipValue !== data.zip ||
            phoneValue !== data.phone
        ) {
            throw new Error(
              `Billing address assertion failed for dataset: ${JSON.stringify(data)}`
            );
        }
    }

    async assertBillingAddress(email) {
        const firstNameValue = await this.page.inputValue(this.firstName);
        const lastNameValue = await this.page.inputValue(this.lastName);
        const emailValue = await this.page.inputValue(this.email);
        const cityValue = await this.page.inputValue(this.city);
        const addressValue = await this.page.inputValue(this.address1);
        const zipValue = await this.page.inputValue(this.zip);
        const phoneValue = await this.page.inputValue(this.phone);

        if (
            firstNameValue !== 'Simra' ||
            lastNameValue !== 'Majeed' ||
            emailValue !== email ||
            cityValue !== 'Karachi' ||
            addressValue !== 'PIB Colony' ||
            zipValue !== '74800' ||
            phoneValue !== '03312645078'
        ) {
            throw new Error('Billing address assertion failed');
        }
    }

    async clickBillingContinue() {
        const button = this.page.locator(this.billingContinueButton);
        await button.waitFor({ state: 'visible', timeout: 60000 });
        await button.click();
    }

    // -------------------- Shipping --------------------
    async waitForShippingPage() {
    const headingLocator = this.page.locator('li#opc-shipping .step-title h2');
    await headingLocator.waitFor({ state: 'visible', timeout: 5000 });
    const heading = await headingLocator.innerText();
    if (heading.trim() !== 'Shipping Address') {
    throw new Error(`Shipping address page not displayed. Found: "${heading}"`);
}
    }


    async clickShippingContinue() {
        const button = this.page.locator(this.shippingContinueButton);
        await button.waitFor({ state: 'visible', timeout: 30000 });
        await button.click();
    }

    async waitForShippingMethodPage() {
    // Hard wait: 2 seconds FOR DEBUGGIFN ONLY
    await this.page.waitForTimeout(2000);

    const headingLocator = this.page.locator(this.shippingMethodStepTitle);
    await headingLocator.waitFor({ state: 'visible', timeout: 5000 });
    const heading = await headingLocator.innerText();
    if (heading.trim() !== 'Shipping Method') {
        throw new Error(`Shipping Method page not displayed. Found: "${heading}"`);
    }
}
async assertGroundShippingSelected() {
    const isChecked = await this.page.isChecked(this.groundShippingRadio);
    if (!isChecked) {
        throw new Error('Ground shipping option is not selected by default');
    }
}
async clickShippingMethodContinue() {
    const button = this.page.locator(this.shippingMethodContinueButton);
    await button.click();
}

// Wait for Payment Method page
async waitForPaymentMethodPage() {
    

    const headingLocator = this.page.locator(this.paymentMethodStepTitle);
    await headingLocator.waitFor({ state: 'visible', timeout: 30000 });
    const heading = await headingLocator.innerText();
    if (heading.trim() !== 'Payment Method') {
        throw new Error(`Payment Method page not displayed. Found: "${heading}"`);
    }
}

// Assert Cash On Delivery is selected
async assertCashOnDeliverySelected() {
    const isChecked = await this.page.isChecked(this.cashOnDeliveryRadio);
    if (!isChecked) {
        throw new Error('Cash On Delivery option is not selected by default');
    }
}

// Click Continue on Payment Method
async clickPaymentMethodContinue() {
    const button = this.page.locator(this.paymentMethodContinueButton);
    await button.waitFor({ state: 'visible', timeout: 30000 });
    await button.click();
}

// Wait for Payment Information page
async waitForPaymentInfoPage() {
    // Optional hard wait to ensure page loads

    const headingLocator = this.page.locator(this.paymentInfoStepTitle);
    await headingLocator.waitFor({ state: 'visible', timeout: 5000 });
    const heading = await headingLocator.innerText();
    if (heading.trim() !== 'Payment Information') {
        throw new Error(`Payment information page not displayed. Found: "${heading}"`);
    }
}

// Assert the payment method info (COD)
async assertPaymentInfoCOD() {
    const infoText = await this.page.locator(this.paymentInfoMessage).innerText();
    if (!infoText.includes('You will pay by COD')) {
        throw new Error(`Expected payment info to mention COD. Found: "${infoText}"`);
    }
}
// Click Continue on Payment Information
async clickPaymentInfoContinue() {
    const button = this.page.locator(this.paymentInfoContinueButton);
    await button.waitFor({ state: 'visible', timeout: 30000 });
    await button.click();

}
}
module.exports = { CheckoutPage };
