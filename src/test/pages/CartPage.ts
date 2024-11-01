import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    private readonly selectors = {
        removeButton: '[data-test="remove-sauce-labs-backpack"]',
        checkoutButton: '[data-test="checkout"]',
        cartItem: '.cart_item',
        itemName: '.inventory_item_name',
        cartBadge: '.shopping_cart_badge'
    };
    

    async removeItem(): Promise<void> {
        await this.page.click(this.selectors.removeButton);
    }

    async proceedToCheckout(): Promise<void> {
        await this.page.click(this.selectors.checkoutButton);
    }

    async isCartEmpty(): Promise<boolean> {
        const items = await this.page.$$(this.selectors.cartItem);
        return items.length === 0;
    }
    async isCartBadgeVisible(): Promise<boolean> {
        try {
            const badge = await this.page.$(this.selectors.cartBadge);
            return badge !== null;
        } catch {
            return false;
        }
    }
    async getCartItemsCount(): Promise<number> {
        const items = await this.page.$$(this.selectors.cartItem);
        return items.length;
    }

    async getItemNames(): Promise<string[]> {
        return this.page.$$eval(
            this.selectors.itemName,
            elements => elements.map(e => e.textContent || '')
        );
    }
}
