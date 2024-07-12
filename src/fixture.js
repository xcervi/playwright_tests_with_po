import { test as base } from '@playwright/test';
import { LoginPage } from './pages/Login.page';
import { InventoryPage } from './pages/Inventory.page';
import { ShopingCartPage } from './pages/ShopingCart.page';
import { CheckoutPageOne } from './pages/CheckoutOne.page';
import { CheckoutPageTwo } from './pages/CheckoutTwo.page';

export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    shopingCartPage: async ({ page }, use) => {
        await use(new ShopingCartPage(page));
    },
    checkoutPageOne: async ({ page }, use) => {
        await use(new CheckoutPageOne(page));
    },
    checkoutPageTwo: async ({ page }, use) => {
        await use(new CheckoutPageTwo(page));
    },
});
