import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
    getPriceWithRetry() {
        throw new Error('Method not implemented.');
    }
    private readonly selectors = {
        addToCartButton: (itemName: string) => 
            `//div[text()="${itemName}"]/ancestor::div[contains(@class, "inventory_item")]//button`,
        cartBadge: '.shopping_cart_badge',
        cartLink: '.shopping_cart_link',
        sortDropdown: '[data-test="product_sort_container"]',
        productLink: (name: string) => `//div[text()="${name}"]`,
        productPrices: '.inventory_item_price',
        itemNames: '.inventory_item_name',
        removeItem: '.btn_secondary cart_button',
        addToCartButtons: '[data-test*="add-to-cart"]',
        productPrice: '.inventory_details_price',
        genericAddToCartButton: '[data-test*="add-to-cart"]',
        getAddToCartButton: (productName: string) => 
            `//div[text()="${productName}"]/ancestor::div[contains(@class, "inventory_item")]//button[contains(@data-test, "add-to-cart")]`,
        productContainer: (productName: string) => 
            `//div[text()="${productName}"]/ancestor::div[contains(@class, "inventory_item")]`,
        itemPrice: (productName: string) => 
            `//div[text()="${productName}"]/ancestor::div[contains(@class, "inventory_item")]//div[@class="inventory_item_price"]`
      
        
    };

    async addToCart(itemName: string): Promise<void> {
        await this.page.click(this.selectors.addToCartButton(itemName));
    }

    async getCartCount(): Promise<string | null> {
        try {
            return await this.page.textContent(this.selectors.cartBadge);
        } catch {
            return null;
        }
    }

    async clickCart(): Promise<void> {
        await this.page.click(this.selectors.cartLink);
    }

    async sortProducts(option: string): Promise<void> {
        await this.page.selectOption(this.selectors.sortDropdown, option);
    }

    async getProductPrices(): Promise<number[]> {
        const prices = await this.page.$$eval(
            this.selectors.productPrices,
            elements => elements.map(e => parseFloat(e.textContent!.replace('$', '')))
        );
        return prices;
    }

    async clickProduct(name: string): Promise<void> {
        await this.page.click(this.selectors.productLink(name));
    }
   
    
    async isAddToCartButtonVisible(productName: string): Promise<boolean> {
        try {
            await this.waitForElement(this.selectors.addToCartButtons);
            return true;
        } catch {
            return false;
        }
    }

    async getPriceText(): Promise<string> {
        try {
            await this.waitForElement(this.selectors.productPrices);
            const price = await this.page.textContent(this.selectors.productPrices);
            return price?.trim() || '';
        } catch (error) {
            throw new Error(`Failed to get price text: ${error}`);
        }
    }

    private async isImageLoaded(imageElement: any): Promise<boolean> {
        try {
            return await this.page.evaluate((img) => {
                const htmlImg = img as HTMLImageElement;
                return htmlImg.complete && htmlImg.naturalHeight !== 0;
            }, imageElement);
        } catch {
            return false;
        }
    }
}

 


