import { userCredentials } from '../pages/Credentials';

const { expect } = require('@playwright/test');
const { test } = require('../fixture');

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

        function getRandomUniqueIndexes(count) {
            const indexes = [];
            while (indexes.length < count) {
                const randomIndex = Math.floor(Math.random() * itemNamesArray.length);
                if (!indexes.includes(randomIndex)) {
                    indexes.push(randomIndex);
                }
            }
            return indexes;
        }
        const selectedItemsArray = [];
        const selectedIndexes = getRandomUniqueIndexes(numberOfItemsToAdd);

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
});
