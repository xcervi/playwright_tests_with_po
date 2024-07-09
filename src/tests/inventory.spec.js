import { userCredentials } from '../pages/Credentials';

const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.beforeEach(async ({ loginPage }) => {
    const { username, password } = userCredentials.standardUser;
    await loginPage.navigate();
    await loginPage.performLogin(username, password);
});

test.describe('Inventory Sorting', () => {
    test('Perform and verify sorting on the Inventory page', async ({ inventoryPage }) => {
        await expect(inventoryPage.headerTitle).toBeVisible();
        expect(await inventoryPage.inventoryItems.count()).toBeGreaterThanOrEqual(1);

        await inventoryPage.sortItems('Name (A to Z)');
        const namesAZ = await inventoryPage.getItemNames();
        const sortedNamesAZ = namesAZ.slice().sort();
        expect(namesAZ).toEqual(sortedNamesAZ);

        await inventoryPage.sortItems('Name (Z to A)');
        const namesZA = await inventoryPage.getItemNames();
        const sortedNamesZA = namesZA.slice().sort().reverse();
        expect(namesZA).toEqual(sortedNamesZA);

        await inventoryPage.sortItems('Price (low to high)');
        const pricesLtoH = await inventoryPage.getItemPrices();
        const sortedPricesLtoH = pricesLtoH.slice().sort((a, b) => a - b);
        expect(pricesLtoH).toEqual(sortedPricesLtoH);

        await inventoryPage.sortItems('Price (high to low)');
        const pricesHtoL = await inventoryPage.getItemPrices();
        const sortedPricesHtoL = pricesHtoL.slice().sort((a, b) => b - a);
        expect(pricesHtoL).toEqual(sortedPricesHtoL);
    });
});

test.describe('Shopping Cart', () => {
    test('Add several random products and verify they are displayed correctly', async ({ inventoryPage, shopingCartPage }) => {
        const numberOfItemsToAdd = Math.floor(Math.random() * 5) + 1;

        const itemNamesArray = await inventoryPage.getItemNames();
        const itemDescriptionsArray = await inventoryPage.getItemDescriptions();
        const itemPricesArray = await inventoryPage.getItemPrices();

        const selectedItemsArray = [];
        const selectedIndexes = new Set();
        for (let i = 0; i < numberOfItemsToAdd; i++) {
            let randomIndex;

            do {
                randomIndex = Math.floor(Math.random() * itemNamesArray.length);
            } while (selectedIndexes.has(randomIndex));

            selectedIndexes.add(randomIndex);
            await inventoryPage.addItemToCartByName(itemNamesArray[randomIndex]);

            selectedItemsArray.push({
                name: itemNamesArray[randomIndex],
                description: itemDescriptionsArray[randomIndex],
                price: itemPricesArray[randomIndex],
            });
        }

        await inventoryPage.shopingCart.click();
        await expect(shopingCartPage.headerTitle).toBeVisible();

        const cartItemNamesArray = await shopingCartPage.getCartItemNames();
        const cartItemDescriptionsArray = await shopingCartPage.getCartItemDescriptions();
        const cartItemPricesArray = await shopingCartPage.getCartItemPrices();

        selectedItemsArray.forEach((item) => {
            expect(cartItemNamesArray).toContain(item.name);
            expect(cartItemDescriptionsArray).toContain(item.description);
            expect(cartItemPricesArray).toContain(item.price);
        });
    });
});
