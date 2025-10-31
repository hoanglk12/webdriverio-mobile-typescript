/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { logger } from './logger';

/**
 * Custom assertions for mobile automation
 */
export class Assertions {
  /**
   * Assert element is displayed
   * @param element - WebdriverIO element
   * @param message - Custom error message
   */
  static async assertDisplayed(element: WebdriverIO.Element, message?: string): Promise<void> {
    const isDisplayed = await element.isDisplayed();
    const selector = await element.selector;
    const errorMessage = message || `Element ${selector} is not displayed`;

    expect(isDisplayed, errorMessage).to.be.true;
    logger.info(`Assertion passed: Element ${selector} is displayed`);
  }

  /**
   * Assert element is not displayed
   * @param element - WebdriverIO element
   * @param message - Custom error message
   */
  static async assertNotDisplayed(element: WebdriverIO.Element, message?: string): Promise<void> {
    const isDisplayed = await element.isDisplayed().catch(() => false);
    const selector = await element.selector;
    const errorMessage = message || `Element ${selector} is displayed`;

    expect(isDisplayed, errorMessage).to.be.false;
    logger.info(`Assertion passed: Element ${selector} is not displayed`);
  }

  /**
   * Assert element exists
   * @param element - WebdriverIO element
   * @param message - Custom error message
   */
  static async assertExists(element: WebdriverIO.Element, message?: string): Promise<void> {
    const exists = await element.isExisting();
    const selector = await element.selector;
    const errorMessage = message || `Element ${selector} does not exist`;

    expect(exists, errorMessage).to.be.true;
    logger.info(`Assertion passed: Element ${selector} exists`);
  }

  /**
   * Assert element text equals
   * @param element - WebdriverIO element
   * @param expectedText - Expected text
   * @param message - Custom error message
   */
  static async assertTextEquals(
    element: WebdriverIO.Element,
    expectedText: string,
    message?: string
  ): Promise<void> {
    const actualText = await element.getText();
    const selector = await element.selector;
    const errorMessage =
      message ||
      `Element ${selector} text does not match. Expected: "${expectedText}", Actual: "${actualText}"`;

    expect(actualText, errorMessage).to.equal(expectedText);
    logger.info(`Assertion passed: Element ${selector} text equals "${expectedText}"`);
  }

  /**
   * Assert element text contains
   * @param element - WebdriverIO element
   * @param expectedText - Expected text to contain
   * @param message - Custom error message
   */
  static async assertTextContains(
    element: WebdriverIO.Element,
    expectedText: string,
    message?: string
  ): Promise<void> {
    const actualText = await element.getText();
    const selector = await element.selector;
    const errorMessage =
      message ||
      `Element ${selector} text does not contain "${expectedText}". Actual: "${actualText}"`;

    expect(actualText, errorMessage).to.include(expectedText);
    logger.info(`Assertion passed: Element ${selector} text contains "${expectedText}"`);
  }

  /**
   * Assert attribute equals
   * @param element - WebdriverIO element
   * @param attribute - Attribute name
   * @param expectedValue - Expected value
   * @param message - Custom error message
   */
  static async assertAttributeEquals(
    element: WebdriverIO.Element,
    attribute: string,
    expectedValue: string,
    message?: string
  ): Promise<void> {
    const actualValue = await element.getAttribute(attribute);
    const selector = await element.selector;
    const errorMessage =
      message ||
      `Element ${selector} attribute "${attribute}" does not match. Expected: "${expectedValue}", Actual: "${actualValue}"`;

    expect(actualValue, errorMessage).to.equal(expectedValue);
    logger.info(
      `Assertion passed: Element ${selector} attribute "${attribute}" equals "${expectedValue}"`
    );
  }

  /**
   * Assert element is clickable
   * @param element - WebdriverIO element
   * @param message - Custom error message
   */
  static async assertClickable(element: WebdriverIO.Element, message?: string): Promise<void> {
    const isClickable = await element.isClickable();
    const selector = await element.selector;
    const errorMessage = message || `Element ${selector} is not clickable`;

    expect(isClickable, errorMessage).to.be.true;
    logger.info(`Assertion passed: Element ${selector} is clickable`);
  }

  /**
   * Assert element is enabled
   * @param element - WebdriverIO element
   * @param message - Custom error message
   */
  static async assertEnabled(element: WebdriverIO.Element, message?: string): Promise<void> {
    const isEnabled = await element.isEnabled();
    const selector = await element.selector;
    const errorMessage = message || `Element ${selector} is not enabled`;

    expect(isEnabled, errorMessage).to.be.true;
    logger.info(`Assertion passed: Element ${selector} is enabled`);
  }

  /**
   * Assert element is disabled
   * @param element - WebdriverIO element
   * @param message - Custom error message
   */
  static async assertDisabled(element: WebdriverIO.Element, message?: string): Promise<void> {
    const isEnabled = await element.isEnabled();
    const selector = await element.selector;
    const errorMessage = message || `Element ${selector} is enabled`;

    expect(isEnabled, errorMessage).to.be.false;
    logger.info(`Assertion passed: Element ${selector} is disabled`);
  }

  /**
   * Assert elements count
   * @param elements - Array of WebdriverIO elements
   * @param expectedCount - Expected count
   * @param message - Custom error message
   */
  static async assertElementsCount(
    elements: WebdriverIO.ElementArray,
    expectedCount: number,
    message?: string
  ): Promise<void> {
    const actualCount = elements.length;
    const errorMessage =
      message ||
      `Elements count does not match. Expected: ${expectedCount}, Actual: ${actualCount}`;

    expect(actualCount, errorMessage).to.equal(expectedCount);
    logger.info(`Assertion passed: Elements count equals ${expectedCount}`);
  }

  /**
   * Assert URL contains
   * @param expectedUrlPart - Expected URL part
   * @param message - Custom error message
   */
  static async assertUrlContains(expectedUrlPart: string, message?: string): Promise<void> {
    const currentUrl = await driver.getUrl();
    const errorMessage =
      message || `URL does not contain "${expectedUrlPart}". Actual URL: "${currentUrl}"`;

    expect(currentUrl, errorMessage).to.include(expectedUrlPart);
    logger.info(`Assertion passed: URL contains "${expectedUrlPart}"`);
  }

  /**
   * Soft assertion - logs failure but doesn't throw error
   * @param condition - Condition to check
   * @param message - Message to log
   */
  static softAssert(condition: boolean, message: string): void {
    if (!condition) {
      logger.warn(`Soft assertion failed: ${message}`);
    } else {
      logger.info(`Soft assertion passed: ${message}`);
    }
  }
}

export default Assertions;
