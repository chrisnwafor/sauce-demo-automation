import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';
import { CustomWorld } from '../support/world';

let browser: Browser;

BeforeAll(async function() {
    browser = await chromium.launch({
        headless: false,
        slowMo: 500  // Added slight delay between actions
    });
});

Before(async function(this: CustomWorld) {
    this.browser = browser;
    this.context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    this.page = await this.context.newPage();
    
    // Add initial navigation with wait
    await this.page.goto('https://www.saucedemo.com', {
        waitUntil: 'networkidle',
        timeout: 10000
    });
});

After(async function(this: CustomWorld) {
    await this.context?.close();
});

AfterAll(async function() {
    await browser?.close();
});

// src/test/pages/BasePage.ts
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

    async waitForElementToBeStable(selector: string, timeout = 10000): Promise<void> {
        await this.waitForElement(selector, timeout);
        // Add small delay to ensure element is interactive
        await this.page.waitForTimeout(500);
    }
}