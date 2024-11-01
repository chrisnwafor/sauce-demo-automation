import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) {
        if (!page) throw new Error('Page is required');
    }

    async waitForElement(selector: string, timeout = 10000): Promise<void> {
        try {
            await this.page.waitForSelector(selector, {
                state: 'visible',
                timeout
            });
        } catch (error) {
            throw new Error(`Element not found: ${selector} (${error})`);
        }
    }

    async getText(selector: string): Promise<string> {
        try {
            await this.waitForElement(selector);
            const text = await this.page.textContent(selector);
            return text?.trim() || '';
        } catch (error) {
            throw new Error(`Failed to get text from ${selector}: ${error}`);
        }
    }

    async isElementVisible(selector: string): Promise<boolean> {
        try {
            await this.waitForElement(selector);
            const element = await this.page.$(selector);
            if (!element) return false;
            
            return await element.isVisible();
        } catch {
            return false;
        }
    }

    async waitForPageLoad(): Promise<void> {
        try {
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForLoadState('domcontentloaded');
        } catch (error) {
            throw new Error(`Failed to wait for page load: ${error}`);
        }
    }
}