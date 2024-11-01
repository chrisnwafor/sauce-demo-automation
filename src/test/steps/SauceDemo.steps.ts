import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CustomWorld } from '../support/world';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

Given('I am logged in as a standard user', async function (this: CustomWorld) {
  await this.page.goto('https://www.saucedemo.com');
  
  await this.page.fill('[data-test="username"]', 'standard_user');
  await this.page.fill('[data-test="password"]', 'secret_sauce');
  await this.page.click('[data-test="login-button"]');
});

When(
  'I add {string} to the cart',
  async function (this: CustomWorld, itemName: string) {
    const inventoryPage = new InventoryPage(this.page);
    await inventoryPage.addToCart(itemName);
  }
);

Then(
  'the shopping cart badge should show {string}',
  async function (this: CustomWorld, count: string) {
    const inventoryPage = new InventoryPage(this.page);
    expect(await inventoryPage.getCartCount()).toBe(count);
  }
);

When('I proceed to checkout', async function (this: CustomWorld) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.clickCart();
  const cartPage = new CartPage(this.page);
  await cartPage.proceedToCheckout();
});

When(
  'I enter shipping information',
  async function (this: CustomWorld, dataTable) {
    const checkoutPage = new CheckoutPage(this.page);
    const data = dataTable.hashes()[0];
    await checkoutPage.fillShippingInfo(
      data.firstName,
      data.lastName,
      data.postalCode
    );
    await checkoutPage.finishCheckout();
  }
);

Then(
  'I should see {string}',
  async function (this: CustomWorld, message: string) {
    const checkoutPage = new CheckoutPage(this.page);
    expect(await checkoutPage.getConfirmationMessage()).toContain(message);
  }
);

When(
  'I sort products by {string}',
  async function (this: CustomWorld, option: string) {
    const inventoryPage = new InventoryPage(this.page);
    await inventoryPage.sortProducts(option);
  }
);

Then(
  'products should be sorted by price in ascending order',
  async function (this: CustomWorld) {
    const inventoryPage = new InventoryPage(this.page);
    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  }
);
When('I click on the cart', async function (this: CustomWorld) {
  try {
    await this.page.click('.shopping_cart_link');
    console.log('Successfully clicked on cart');
  } catch (error) {
    console.error('Failed to click on cart:', error);
    throw error;
  }
});

When('I remove the item from cart', async function () {
  const cartPage = new CartPage(this.page);
  await cartPage.removeItem();

  Then(
    'the shopping cart badge should not be visible',
    async function (this: CustomWorld) {
      try {
        const cartPage = new CartPage(this.page);
        const isBadgeVisible = await cartPage.isCartBadgeVisible();

        expect(
          isBadgeVisible,
          'Shopping cart badge should not be visible'
        ).toBe(false);
        console.log('Successfully verified shopping cart badge is not visible');
      } catch (error) {
        console.error(
          'Failed to verify shopping cart badge visibility:',
          error
        );
        throw error;
      }
    }
  );

  Then('the cart should be empty', async function (this: CustomWorld) {
    try {
      const cartPage = new CartPage(this.page);

      // Verify cart is empty using multiple checks
      const isEmpty = await cartPage.isCartEmpty();
      const itemCount = await cartPage.getCartItemsCount();
      expect(isEmpty, 'Cart should be empty').toBe(true);
      expect(itemCount, 'Cart should have 0 items').toBe(0);

      console.log('Successfully verified cart is empty');
    } catch (error) {
      console.error('Failed to verify cart is empty:', error);
      throw error;
    }
  });

  Then(
    'I should see the order confirmation page',
    async function (this: CustomWorld) {
      try {
        console.log('Verifying order confirmation page...');
        const checkoutCompletePage = new CheckoutCompletePage(this.page);

        // Verify the confirmation page is displayed with all elements
        const confirmation =
          await checkoutCompletePage.verifyOrderConfirmationPage();
        expect(
          confirmation.isDisplayed,
          'Order confirmation page should be displayed'
        ).toBe(true);

        // Verify all required elements are present
        expect(
          confirmation.elements.header,
          'Thank you header should be visible'
        ).toBe(true);
        expect(
          confirmation.elements.text,
          'Confirmation text should be visible'
        ).toBe(true);
        expect(
          confirmation.elements.image,
          'Confirmation image should be visible'
        ).toBe(true);
        expect(
          confirmation.elements.backButton,
          'Back home button should be visible'
        ).toBe(true);
        expect(
          confirmation.elements.title,
          'Page title should be visible'
        ).toBe(true);

        // Verify the content of the confirmation page
        const details = await checkoutCompletePage.getConfirmationDetails();
        expect(details.headerText).toContain('Thank you for your order');
        expect(details.title).toContain('Checkout: Complete!');

        console.log('Order confirmation page verified successfully');
      } catch (error) {
        console.error('Failed to verify order confirmation page:', error);

        // Capture screenshot on failure
        await this.page.screenshot({
          path: `./screenshots/order-confirmation-error-${Date.now()}.png`,
          fullPage: true,
        });

        throw error;
      }
    }
  );
});

Then('the price should be displayed', async function(this: CustomWorld) {
    try {
        console.log('Starting price verification...');
        const inventoryPage = new InventoryPage(this.page);

        // Wait for page load
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
        console.log('Page load complete');

        // Get price with explicit wait
        const price = await inventoryPage.getPriceWithRetry();
        console.log(`Found price: ${price}`);

        // Verify price
        expect(price).toBeTruthy();
        expect(price).toMatch(/^\$\d+\.\d{2}$/);
        
        console.log('Price verification successful');
    } catch (error) {
        console.error('Price verification failed:', error);
        await this.page.screenshot({
            path: `./screenshots/price-error-${Date.now()}.png`,
            fullPage: true
        });
        throw error;
    }
});

Then('I should see the product details', async function (this: CustomWorld) {
  try {
    const productDetailsPage = new ProductDetailsPage(this.page);
    const details = await productDetailsPage.getProductDetails();

    // Verify all required elements are present and have content
    expect(details.title, 'Product title should not be empty').toBeTruthy();
    expect(
      details.description,
      'Product description should not be empty'
    ).toBeTruthy();
    expect(details.price, 'Product price should not be empty').toBeTruthy();

    // Verify image is loaded
    const isImageLoaded = await productDetailsPage.verifyProductImage();
    expect(isImageLoaded, 'Product image should be loaded').toBe(true);

    console.log('Product details verified successfully');
  } catch (error) {
    console.error('Failed to verify product details:', error);
    await this.page.screenshot({
      path: `./screenshots/product-details-error-${Date.now()}.png`,
      fullPage: true,
    });
    throw error;
  }
});

When(
  'I click on product {string}',
  async function (this: CustomWorld, productName: string) {
    try {
      console.log(`Clicking on product: ${productName}`);
      const inventoryPage = new InventoryPage(this.page);
      await inventoryPage.clickProduct(productName);
    } catch (error) {
      console.error(`Failed to click on product ${productName}:`, error);
      throw error;
    }
  }
);
