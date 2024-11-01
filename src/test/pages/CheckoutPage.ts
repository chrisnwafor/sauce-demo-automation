import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    private readonly selectors = {
        firstNameInput: '[data-test="firstName"]',
        lastNameInput: '[data-test="lastName"]',
        postalCodeInput: '[data-test="postalCode"]',
        continueButton: '[data-test="continue"]',
        finishButton: '[data-test="finish"]',
        confirmationMessage: '.complete-header'
    };

    async fillShippingInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.page.fill(this.selectors.firstNameInput, firstName);
        await this.page.fill(this.selectors.lastNameInput, lastName);
        await this.page.fill(this.selectors.postalCodeInput, postalCode);
        await this.page.click(this.selectors.continueButton);
    }

    async finishCheckout(): Promise<void> {
        await this.page.click(this.selectors.finishButton);
    }

    async getConfirmationMessage(): Promise<string | null> {
        return this.page.textContent(this.selectors.confirmationMessage);
    }
}
