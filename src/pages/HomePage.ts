import { BasePage } from './BasePage';

/**
 * Home Page Object
 * Represents the home screen after successful login
 */
export class HomePage extends BasePage {
  /**
   * Selectors for Home page elements
   */
  private get welcomeMessage() {
    return $('~welcome-message');
  }

  private get profileIcon() {
    return $('~profile-icon');
  }

  private get settingsIcon() {
    return $('~settings-icon');
  }

  private get logoutButton() {
    return $('~logout-button');
  }

  private get searchBar() {
    return $('~search-bar');
  }

  private get menuButton() {
    return $('~menu-button');
  }

  /**
   * Product list elements
   */
  private get productList() {
    return $$('~product-item');
  }

  private productByName(name: string) {
    return $(`~product-${name}`);
  }

  /**
   * Check if home page is displayed
   */
  async isHomePageDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.welcomeMessage);
  }

  /**
   * Wait for home page to be displayed
   */
  async waitForHomePage(): Promise<void> {
    await this.waitForElementDisplayed(this.welcomeMessage, 15000);
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getText(this.welcomeMessage);
  }

  /**
   * Click profile icon
   */
  async clickProfileIcon(): Promise<void> {
    await this.click(this.profileIcon);
  }

  /**
   * Click settings icon
   */
  async clickSettingsIcon(): Promise<void> {
    await this.click(this.settingsIcon);
  }

  /**
   * Perform logout
   */
  async logout(): Promise<void> {
    await this.click(this.menuButton);
    await this.click(this.logoutButton);
  }

  /**
   * Search for a product
   * @param searchText - Text to search
   */
  async searchProduct(searchText: string): Promise<void> {
    await this.click(this.searchBar);
    await this.setValue(this.searchBar, searchText);
    await this.hideKeyboard();
  }

  /**
   * Get number of products displayed
   */
  async getProductCount(): Promise<number> {
    const products = await this.productList;
    return products.length;
  }

  /**
   * Click on a product by name
   * @param productName - Name of the product
   */
  async clickProduct(productName: string): Promise<void> {
    await this.click(this.productByName(productName));
  }

  /**
   * Scroll to product in list
   * @param productName - Name of the product
   */
  async scrollToProduct(productName: string): Promise<void> {
    await this.scrollToElement(this.productByName(productName));
  }

  /**
   * Swipe to refresh (pull to refresh)
   */
  async pullToRefresh(): Promise<void> {
    await this.swipe('down', 0.3);
    await this.pause(2000); // Wait for refresh to complete
  }
}

export default new HomePage();
