import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
    private readonly selectors = {
        usernameInput: '[data-test="username"]',
        passwordInput: '[data-test="password"]',
        loginButton: '[data-test="login-button"]',
        shoppingCartButton: '.shopping_cart_link'
    };

    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string): Promise<void> {
        try {
            await this.waitForElement(this.selectors.usernameInput);
            await this.page.fill(this.selectors.usernameInput, username);
            await this.page.fill(this.selectors.passwordInput, password);
            await this.page.click(this.selectors.loginButton);
        } catch (error) {
            throw new Error(`Failed to login: ${error}`);
        }
    }

    async isShoppingCartVisible(): Promise<boolean> {
        try {
            await this.waitForElement(this.selectors.shoppingCartButton);
            return true;
        } catch {
            return false;
        }
    }
}