const { CheckoutPageOne } = require('./CheckoutOne.page');

export class CheckoutPageTwo extends CheckoutPageOne {
    url = '/checkout-step-two.html';

    checkoutItemSelector = '.cart_item';

    get headerTitle() { return this.page.locator('.title'); }

    get checkoutItems() { return this.page.locator(this.checkoutItemSelector); }

    get taxLabel() { return this.page.locator('[data-test="tax-label"]'); }

    get totalPriceLabel() { return this.page.locator('[data-test="total-label"]'); }

    async getCheckoutItemNames() {
        return this.checkoutItems.locator('[data-test="inventory-item-name"]').allTextContents();
    }

    async getCheckoutItemDescriptions() {
        return this.checkoutItems.locator('[data-test="inventory-item-desc"]').allTextContents();
    }

    async getCheckoutItemPrices() {
        const pricesValue = await this.checkoutItems.locator('[data-test="inventory-item-price"]').allTextContents();
        return pricesValue.map((price) => parseFloat(price.replace('$', '')));
    }

    async getTax() {
        const taxValue = await this.taxLabel.textContent();
        return parseFloat(taxValue.replace('Tax: $', ''));
    }

    async getTotalPrice() {
        const totalPriceValue = await this.totalPriceLabel.textContent();
        return parseFloat(totalPriceValue.replace('Total: $', ''));
    }
}
