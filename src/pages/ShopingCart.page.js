const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class ShopingCartPage extends BaseSwagLabPage {
    url = '/cart.html';

    cartItemSelector = '.cart_item';

    removeItemSelector = '[id^="remove"]';

    get headerTitle() { return this.page.locator('.title'); }

    get cartItems() { return this.page.locator(this.cartItemSelector); }

    get checkoutButton() { return this.page.locator('#checkout'); }

    // async below added to show the function returns a promise
    async getCartItemByName(name) {
        return this.page.locator(this.cartItemSelector, { hasText: name });
    }

    async removeCartItemByName(name) {
        const item = await this.getCartItemByName(name);
        return item.locator(this.removeItemSelector);
    }

    async removeCartItemById(id) {
        await this.cartItems.nth(id).locator(this.removeItemSelector).click();
    }

    async getCartItemNames() {
        return this.cartItems.locator('[data-test="inventory-item-name"]').allTextContents();
    }

    async getCartItemDescriptions() {
        return this.cartItems.locator('[data-test="inventory-item-desc"]').allTextContents();
    }

    async getCartItemPrices() {
        const pricesValue = await this.cartItems.locator('[data-test="inventory-item-price"]').allTextContents();
        return pricesValue.map((price) => parseFloat(price.replace('$', '')));
    }
}
