const { ShopingCartPage } = require('./ShopingCart.page');

export class CheckoutStepOnePage extends ShopingCartPage {
    url = '/checkout-step-one.html';

    get firstNameField() { return this.page.locator('#first-name'); }

    get lastNameField() { return this.page.locator('#last-name'); }

    get postalCodeField() { return this.page.locator('#postal-code'); }

    get continueButton() { return this.page.locator('#continue'); }
}
