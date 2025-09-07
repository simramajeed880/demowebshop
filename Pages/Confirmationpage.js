// Pages/ConfirmPage.js
class ConfirmPage {
    constructor(page) {
        this.page = page;

        // Selectors
        this.confirmOrderStepTitle = 'li#opc-confirm_order .step-title h2';
        this.billingInfoBlock = 'ul.billing-info';
        this.shippingInfoBlock = 'ul.shipping-info';
        this.confirmOrderButton = '#confirm-order-buttons-container input.confirm-order-next-step-button';
       this.thankYouTitle = 'div.page-title h1'; 
this.successMessage = 'div.order-completed .title strong';
this.orderNumber = 'ul.details li:first-child'; // "Order number: 2095501"
    }

    // ✅ Wait for Confirm Order Page
    async waitForConfirmOrderPage() {
        const headingLocator = this.page.locator(this.confirmOrderStepTitle);
        await headingLocator.waitFor({ state: 'visible', timeout: 5000 });
        const heading = await headingLocator.innerText();
        if (heading.trim() !== 'Confirm Order') {
            throw new Error(`Confirm order page not displayed. Found: "${heading}"`);
        }
    }

    // ✅ Assert Billing & Shipping addresses
    async assertConfirmOrderAddresses(expected) {
    // Wait for billing & shipping info to be visible
    await this.page.locator(this.billingInfoBlock).waitFor({ state: 'visible', timeout: 15000 });
    await this.page.locator(this.shippingInfoBlock).waitFor({ state: 'visible', timeout: 15000 });

    const billingText = await this.page.locator(this.billingInfoBlock).innerText();
    const shippingText = await this.page.locator(this.shippingInfoBlock).innerText();

    const billing = billingText.toLowerCase();
    const shipping = shippingText.toLowerCase();

    for (const value of Object.values(expected)) {
        if (!billing.includes(value.toLowerCase())) {
            throw new Error(`Billing address mismatch. Expected "${value}" not found.`);
        }
        if (!shipping.includes(value.toLowerCase())) {
            throw new Error(`Shipping address mismatch. Expected "${value}" not found.`);
        }
    }
}

    // 🔹 New function for dataset-driven tests
    async assertConfirmOrderAddressesWithDataset(data) {
        const expected = {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone,
            city: data.city,
            address: data.address,
            zip: data.zip,
            country: data.country
        };

        await this.assertConfirmOrderAddresses(expected);
    }

    // ✅ Click Confirm Order
    async clickConfirmOrder() {
        const button = this.page.locator(this.confirmOrderButton);
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await button.click();
    }
    async assertThankYouPage() {
    // 🔹 Wait for the completed page to load
    await this.page.waitForURL('**/checkout/completed/**', { timeout: 30000 });
        

        const heading = await this.page.locator(this.thankYouTitle).innerText();
    if (heading.trim() !== 'Thank you') {
        throw new Error(`Thank You page not displayed. Found: "${heading}"`);
    }
    await this.page.screenshot({ path: 'thankyoupagedisplayed.png', fullPage: false });
    console.log("✅ Thank You page loaded successfully");
    }
    
    // In ConfirmPage.js
async getOrderNumber() {
    const orderText = await this.page.locator(this.orderNumber).innerText();
    // "Order number: 2095529" → extract the number
    const match = orderText.match(/\d+/);
    if (!match) {
        throw new Error(`Order number not found in text: "${orderText}"`);
    }
    return match[0]; // return just the number
}

}

module.exports = { ConfirmPage };
