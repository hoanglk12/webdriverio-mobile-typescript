import { logger } from '../../utils/logger';

type ElementType = WebdriverIO.Element | ChainablePromiseElement;

/**
 * Base Page class containing common methods for all page objects
 * Implements Page Object Model (POM) design pattern
 */
export abstract class BasePage {
  /**
   * Wait for an element to be displayed
   * @param element - WebdriverIO element
   * @param timeout - Timeout in milliseconds
   */
  protected async waitForElementDisplayed(
    element: ElementType,
    timeout: number = 10000
  ): Promise<void> {
    try {
      const el = element as WebdriverIO.Element;
      await el.waitForDisplayed({ timeout });
      logger.debug(`Element displayed`);
    } catch (error) {
      logger.error(`Element not displayed`);
      throw error;
    }
  }

  /**
   * Wait for an element to be clickable
   * @param element - WebdriverIO element
   * @param timeout - Timeout in milliseconds
   */
  protected async waitForElementClickable(
    element: ElementType,
    timeout: number = 10000
  ): Promise<void> {
    try {
      const el = element as WebdriverIO.Element;
      await el.waitForClickable({ timeout });
      logger.debug(`Element clickable`);
    } catch (error) {
      logger.error(`Element not clickable`);
      throw error;
    }
  }

  /**
   * Wait for an element to exist in DOM
   * @param element - WebdriverIO element
   * @param timeout - Timeout in milliseconds
   */
  protected async waitForElementExist(
    element: ElementType,
    timeout: number = 10000
  ): Promise<void> {
    try {
      const el = element as WebdriverIO.Element;
      await el.waitForExist({ timeout });
      logger.debug(`Element exists`);
    } catch (error) {
      logger.error(`Element does not exist`);
      throw error;
    }
  }

  /**
   * Click on an element with wait
   * @param element - WebdriverIO element
   */
  protected async click(element: ElementType): Promise<void> {
    try {
      const el = element as WebdriverIO.Element;
      await this.waitForElementClickable(el);
      await el.click();
      logger.info(`Clicked on element`);
    } catch (error) {
      logger.error(`Failed to click element`);
      throw error;
    }
  }

  /**
   * Set value to an input field
   * @param element - WebdriverIO element
   * @param value - Value to set
   */
  protected async setValue(element: ElementType, value: string): Promise<void> {
    try {
      const el = element as WebdriverIO.Element;
      await this.waitForElementDisplayed(el);
      await el.setValue(value);
      logger.info(`Set value "${value}" to element`);
    } catch (error) {
      logger.error(`Failed to set value to element`);
      throw error;
    }
  }

  /**
   * Add value to an input field (append)
   * @param element - WebdriverIO element
   * @param value - Value to add
   */
  protected async addValue(element: ElementType, value: string): Promise<void> {
    try {
      const el = element as WebdriverIO.Element;
      await this.waitForElementDisplayed(el);
      await el.addValue(value);
      logger.info(`Added value "${value}" to element`);
    } catch (error) {
      logger.error(`Failed to add value to element`);
      throw error;
    }
  }

  /**
   * Get text from an element
   * @param element - WebdriverIO element
   * @returns Text content
   */
  protected async getText(element: ElementType): Promise<string> {
    try {
      const el = element as WebdriverIO.Element;
      await this.waitForElementDisplayed(el);
      const text = await el.getText();
      logger.debug(`Got text "${text}" from element`);
      return text;
    } catch (error) {
      logger.error(`Failed to get text from element`);
      throw error;
    }
  }

  /**
   * Get attribute value from an element
   * @param element - WebdriverIO element
   * @param attribute - Attribute name
   * @returns Attribute value
   */
  protected async getAttribute(element: WebdriverIO.Element, attribute: string): Promise<string> {
    try {
      await this.waitForElementDisplayed(element);
      const value = await element.getAttribute(attribute);
      logger.debug(
        `Got attribute "${attribute}" = "${value}" from element: ${await element.selector}`
      );
      return value;
    } catch (error) {
      logger.error(`Failed to get attribute from element: ${await element.selector}`);
      throw error;
    }
  }

  /**
   * Check if element is displayed
   * @param element - WebdriverIO element
   * @returns True if displayed
   */
  protected async isDisplayed(element: ElementType): Promise<boolean> {
    try {
      const el = element as any;
      return await el.isDisplayed();
    } catch (error) {
      logger.debug(`Element not displayed`);
      return false;
    }
  }

  /**
   * Check if element exists
   * @param element - WebdriverIO element
   * @returns True if exists
   */
  protected async isExisting(element: WebdriverIO.Element): Promise<boolean> {
    try {
      return await element.isExisting();
    } catch (error) {
      logger.debug(`Element does not exist: ${await element.selector}`);
      return false;
    }
  }

  /**
   * Scroll to element
   * @param element - WebdriverIO element
   */
  protected async scrollToElement(element: ElementType): Promise<void> {
    try {
      const el = element as WebdriverIO.Element;
      await el.scrollIntoView();
      logger.info(`Scrolled to element`);
    } catch (error) {
      logger.error(`Failed to scroll to element: ${await element.selector}`);
      throw error;
    }
  }

  /**
   * Swipe on screen
   * @param direction - Direction to swipe (up, down, left, right)
   * @param percentage - Percentage of screen to swipe (0-1)
   */
  protected async swipe(
    direction: 'up' | 'down' | 'left' | 'right',
    percentage: number = 0.5
  ): Promise<void> {
    try {
      const { width, height } = await driver.getWindowSize();
      const centerX = width / 2;
      const centerY = height / 2;
      const distance = direction === 'up' || direction === 'down' ? height : width;
      const offset = distance * percentage;

      let startX = centerX;
      let startY = centerY;
      let endX = centerX;
      let endY = centerY;

      switch (direction) {
        case 'up':
          startY = centerY + offset / 2;
          endY = centerY - offset / 2;
          break;
        case 'down':
          startY = centerY - offset / 2;
          endY = centerY + offset / 2;
          break;
        case 'left':
          startX = centerX + offset / 2;
          endX = centerX - offset / 2;
          break;
        case 'right':
          startX = centerX - offset / 2;
          endX = centerX + offset / 2;
          break;
      }

      await driver.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: startX, y: startY },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', duration: 1000, x: endX, y: endY },
            { type: 'pointerUp', button: 0 },
          ],
        },
      ]);

      await driver.releaseActions();
      logger.info(`Swiped ${direction} with ${percentage * 100}% distance`);
    } catch (error) {
      logger.error(`Failed to swipe ${direction}`);
      throw error;
    }
  }

  /**
   * Hide keyboard if visible (Android/iOS)
   */
  protected async hideKeyboard(): Promise<void> {
    try {
      const isShown = await browser.isKeyboardShown();
      if (isShown) {
        await browser.hideKeyboard();
        logger.info('Keyboard hidden');
      }
    } catch (error) {
      logger.warn(`Failed to hide keyboard: ${error}`);
      logger.debug('Keyboard not shown or unable to hide');
    }
  }

  /**
   * Take screenshot
   * @param fileName - Screenshot file name
   */
  protected async takeScreenshot(fileName: string): Promise<void> {
    try {
      const screenshotPath = `${process.env.SCREENSHOT_DIR || './reports/screenshots'}/${fileName}.png`;
      await driver.saveScreenshot(screenshotPath);
      logger.info(`Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      logger.error(`Failed to take screenshot: ${error}`);
      throw error;
    }
  }

  /**
   * Wait for specific time
   * @param milliseconds - Time to wait in milliseconds
   */
  protected async pause(milliseconds: number): Promise<void> {
    await driver.pause(milliseconds);
    logger.debug(`Paused for ${milliseconds}ms`);
  }

  /**
   * Get current platform (Android/iOS)
   * @returns Platform name
   */
  protected async getPlatform(): Promise<string> {
    const capabilities = driver.capabilities;
    return capabilities.platformName?.toLowerCase() || 'unknown';
  }

  /**
   * Execute platform-specific action
   * @param androidAction - Action for Android
   * @param iosAction - Action for iOS
   */
  protected async executePlatformSpecific<T>(
    androidAction: () => Promise<T>,
    iosAction: () => Promise<T>
  ): Promise<T> {
    const platform = await this.getPlatform();
    if (platform === 'android') {
      return await androidAction();
    } else if (platform === 'ios') {
      return await iosAction();
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}
