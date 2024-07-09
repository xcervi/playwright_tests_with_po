const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    get headerTitle() { return this.page.locator('.title'); } //

    get inventoryItems() { return this.page.locator('.inventory_item'); }

    get addItemToCartBtns() { return this.page.locator('[id^="add-to-cart"]'); }

    get sortDropDown() { return this.page.locator('[data-test="product-sort-container"]'); }

    async addItemToCartById(id) {
        await this.addItemToCartBtns.nth(id).click();
    }

    async addItemToCartByName(itemName) {
        const item = this.page.locator('.inventory_item').filter({ hasText: itemName });
        const addButton = item.locator('[id^="add-to-cart"]');
        await addButton.click();
    }

    async sortItems(optionText) {
        await this.sortDropDown.selectOption({ label: optionText });
    }

    async getItemNames() {
        return this.inventoryItems.locator('[data-test="inventory-item-name"]').allTextContents();
    }

    async getItemDescriptions() {
        return this.inventoryItems.locator('[data-test="inventory-item-desc"]').allTextContents();
    }

    async getItemPrices() {
        const pricesValue = await this.inventoryItems.locator('[data-test="inventory-item-price"]').allTextContents();
        return pricesValue.map((price) => parseFloat(price.replace('$', '')));
    }
}
