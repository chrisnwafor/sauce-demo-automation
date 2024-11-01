import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
    private readonly selectors = {
        productTitle: '.inventory_details_name',
        productDescription: '.inventory_details_desc',
        productPrice: '.inventory_details_price',
        addToCartButton: 'button[data-test*="add-to-cart"]',
        removeButton: 'button[data-test*="remove"]',
        backButton: '#back-to-products',
        productImage: '.inventory_details_img'
    };

    async getProductTitle(): Promise<string> {
        await this.waitForElement(this.selectors.productTitle);
        return this.getText(this.selectors.productTitle);
    }

    async getProductPrice(): Promise<string> {
        await this.waitForElement(this.selectors.productPrice);
        return this.getText(this.selectors.productPrice);
    }

    async isAddToCartButtonVisible(): Promise<boolean> {
        try {
            await this.waitForElement(this.selectors.addToCartButton);
            return true;
        } catch {
            return false;
        }
    }

    async getProductDetails(): Promise<{
        title: string;
        description: string;
        price: string;
    }> {
        await this.waitForElement(this.selectors.productTitle);
        
        return {
            title: await this.getText(this.selectors.productTitle),
            description: await this.getText(this.selectors.productDescription),
            price: await this.getText(this.selectors.productPrice)
        };
    }

    async verifyProductImage(): Promise<boolean> {
        try {
            await this.waitForElement(this.selectors.productImage);
            const image = await this.page.$(this.selectors.productImage);
            if (!image) return false;
            
            // Check if image is loaded
            const imageLoaded = await this.page.evaluate((img) => {
                const htmlImg = img as HTMLImageElement;
                return htmlImg.complete && htmlImg.naturalHeight !== 0;
            }, image);
            
            return imageLoaded;
        } catch {
            return false;
        }
    }
}

