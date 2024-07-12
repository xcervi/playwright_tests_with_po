import { userCredentials } from '../pages/Credentials';

const { expect } = require('@playwright/test');
const { test } = require('../fixture');
const { getRandomUniqueIndexes } = require('../utils').default;

test.beforeEach(async ({ loginPage }) => {
    const { username, password } = userCredentials.standardUser;
    await loginPage.navigate();
    await loginPage.performLogin(username, password);
});

const sortingScenarios = [
    {
        option: 'Name (A to Z)',
        getItems: async (inventoryPage) => inventoryPage.getItemNames(),
        sortFn: (items) => items.slice().sort(),
    },
    {
        option: 'Name (Z to A)',
        getItems: async (inventoryPage) => inventoryPage.getItemNames(),
        sortFn: (items) => items.slice().sort().reverse(),
    },
    {
        option: 'Price (low to high)',
        getItems: async (inventoryPage) => inventoryPage.getItemPrices(),
        sortFn: (items) => items.slice().sort((a, b) => a - b),
    },
    {
        option: 'Price (high to low)',
        getItems: async (inventoryPage) => inventoryPage.getItemPrices(),
        sortFn: (items) => items.slice().sort((a, b) => b - a),
    },
];

sortingScenarios.forEach(({ option, getItems, sortFn }) => {
    test(`Verify sorting by ${option}`, async ({ inventoryPage }) => {
        await inventoryPage.sortItems(option);
        const items = await getItems(inventoryPage);
        const sortedItems = sortFn(items);
        expect(items).toEqual(sortedItems);
    });
});

test.describe('Shopping Cart', () => {
    test('Add several random products and verify they are displayed correctly', async ({ inventoryPage, shopingCartPage }) => {
        const itemNamesArray = await inventoryPage.getItemNames();
        const itemDescriptionsArray = await inventoryPage.getItemDescriptions();
        const itemPricesArray = await inventoryPage.getItemPrices();
        const numberOfItemsToAdd = Math.floor(Math.random() * (itemNamesArray.length - 1)) + 1;

        const selectedItemsArray = [];
        const selectedIndexes = getRandomUniqueIndexes(numberOfItemsToAdd, itemNamesArray.length);

        for (const i of selectedIndexes) {
            await inventoryPage.addItemToCartByName(itemNamesArray[i]);

            selectedItemsArray.push({
                name: itemNamesArray[i],
                description: itemDescriptionsArray[i],
                price: itemPricesArray[i],
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

    test('E2E purchase', async ({ inventoryPage, shopingCartPage, checkoutPageOne, checkoutPageTwo }) => {
        const itemNamesArray = await inventoryPage.getItemNames();
        const itemDescriptionsArray = await inventoryPage.getItemDescriptions();
        const itemPricesArray = await inventoryPage.getItemPrices();
        const numberOfItemsToAdd = Math.floor(Math.random() * (itemNamesArray.length - 1)) + 1;

        const selectedItemsArray = [];
        const selectedIndexes = getRandomUniqueIndexes(numberOfItemsToAdd, itemNamesArray.length);

        for (const i of selectedIndexes) {
            await inventoryPage.addItemToCartByName(itemNamesArray[i]);

            selectedItemsArray.push({
                name: itemNamesArray[i],
                description: itemDescriptionsArray[i],
                price: itemPricesArray[i],
            });
        }

        await inventoryPage.shopingCart.click();
        await expect(shopingCartPage.headerTitle).toBeVisible();

        await shopingCartPage.checkoutButton.click();

        await checkoutPageOne.firstNameField.fill('Tyler');
        await checkoutPageOne.lastNameField.fill('Joseph');
        await checkoutPageOne.postalCodeField.fill('43010');

        await checkoutPageOne.continueButton.click();
        await expect(checkoutPageTwo.headerTitle).toBeVisible();

        const checkoutItemNamesArray = await checkoutPageTwo.getCheckoutItemNames();
        const checkoutItemDescriptionsArray = await checkoutPageTwo.getCheckoutItemDescriptions();
        const checkoutItemPricesArray = await checkoutPageTwo.getCheckoutItemPrices();

        selectedItemsArray.forEach((item) => {
            expect(checkoutItemNamesArray).toContain(item.name);
            expect(checkoutItemDescriptionsArray).toContain(item.description);
            expect(checkoutItemPricesArray).toContain(item.price);
        });

        const pricesSum = checkoutItemPricesArray.reduce(((accumulator, currentValue) => accumulator + parseFloat(currentValue)));
        const taxValue = await checkoutPageTwo.getTax();
        const totalPrice = Math.round(parseFloat(pricesSum + parseFloat(taxValue)) * 100) / 100;

        expect(totalPrice).toEqual(await checkoutPageTwo.getTotalPrice())

    });
});
