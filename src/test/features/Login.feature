Feature: Sauce Demo E-commerce Functionality
    As a user of Sauce Demo
    I want to test the core functionality
    So that I can ensure the website works correctly

  Background: Common steps
    Given I am logged in as a standard user

  @TC01 @smoke
  Scenario: Add item to cart and verify cart count
    When I add "Sauce Labs Backpack" to the cart
    Then the shopping cart badge should show "1"
   

  @TC02 @smoke
  Scenario: Complete purchase flow with single item
    When I add "Sauce Labs Bike Light" to the cart
    And I proceed to checkout
    And I enter shipping information
      | firstName | lastName | postalCode |
      | John      | Doe      |      12345 |
    Then I should see the order confirmation page
    And I should see "Thank you for your order!"

  @TC03 @regression
  Scenario: Sort products by price low to high
    When I sort products by "Price (low to high)"
    Then products should be sorted by price in ascending order

  @TC04 @regression
  Scenario: Remove item from cart
    When I add "Sauce Labs Backpack" to the cart
    And I click on the cart
    And I remove the item from cart
    Then the cart should be empty
    

  @TC05 @regression
  Scenario: Verify product details page
    When I click on product "Sauce Labs Fleece Jacket"
    Then I should see the product details
    And the price should be displayed
  
