import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
    private readonly selectors = {
        completeContainer: '#checkout_complete_container',
        thankYouHeader: '.complete-header',
        completeText: '.complete-text',
        ponyExpressImage: '.pony_express',
        backHomeButton: '[data-test="back-to-products"]',
        checkoutComplete: '.checkout_complete_container',
        confirmationTitle: '.title'
    };

    async verifyOrderConfirmationPage(): Promise<{
        isDisplayed: boolean;
        elements: {
            header: boolean;
            text: boolean;
            image: boolean;
            backButton: boolean;
            title: boolean;
        };
    }> {
        try {
            // Wait for the main container
            await this.waitForElement(this.selectors.completeContainer);

            // Check all required elements
            const elements = {
                header: await this.isElementVisible(this.selectors.thankYouHeader),
                text: await this.isElementVisible(this.selectors.completeText),
                image: await this.isElementVisible(this.selectors.ponyExpressImage),
                backButton: await this.isElementVisible(this.selectors.backHomeButton),
                title: await this.isElementVisible(this.selectors.confirmationTitle)
            };

            return {
                isDisplayed: true,
                elements
            };
        } catch (error) {
            console.error('Failed to verify order confirmation page:', error);
            return {
                isDisplayed: false,
                elements: {
                    header: false,
                    text: false,
                    image: false,
                    backButton: false,
                    title: false
                }
            };
        }
    }

    async getConfirmationDetails(): Promise<{
        headerText: string;
        completeText: string;
        title: string;
    }> {
        try {
            return {
                headerText: await this.getText(this.selectors.thankYouHeader),
                completeText: await this.getText(this.selectors.completeText),
                title: await this.getText(this.selectors.confirmationTitle)
            };
        } catch (error) {
            throw new Error(`Failed to get confirmation details: ${error}`);
        }
    }

    async clickBackHome(): Promise<void> {
        try {
            await this.waitForElement(this.selectors.backHomeButton);
            await this.page.click(this.selectors.backHomeButton);
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            throw new Error(`Failed to click back home button: ${error}`);
        }
    }
}