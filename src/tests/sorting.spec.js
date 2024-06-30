const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate();
    await loginPage.performLogin('standard_user', 'secret_sauce');

    await expect(inventoryPage.headerTitle).toBeVisible();
    expect(await inventoryPage.inventoryItems.count()).toBeGreaterThanOrEqual(1);
});

test.describe('Inventory Sorting', () => {
    test('Perform and verify sorting on the Inventory page', async ({ inventoryPage }) => {
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
