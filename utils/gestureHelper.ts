/**
 * Gesture utilities for mobile interactions
 */
export class GestureHelper {
  /**
   * Perform vertical swipe
   * @param startPercentage - Start Y position (0-100)
   * @param endPercentage - End Y position (0-100)
   * @param duration - Duration in milliseconds
   */
  static async swipeVertical(
    startPercentage: number = 80,
    endPercentage: number = 20,
    duration: number = 1000
  ): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const x = width / 2;
    const startY = (height * startPercentage) / 100;
    const endY = (height * endPercentage) / 100;

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration, x, y: endY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);

    await driver.releaseActions();
  }

  /**
   * Perform horizontal swipe
   * @param startPercentage - Start X position (0-100)
   * @param endPercentage - End X position (0-100)
   * @param duration - Duration in milliseconds
   */
  static async swipeHorizontal(
    startPercentage: number = 80,
    endPercentage: number = 20,
    duration: number = 1000
  ): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const y = height / 2;
    const startX = (width * startPercentage) / 100;
    const endX = (width * endPercentage) / 100;

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration, x: endX, y },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);

    await driver.releaseActions();
  }

  /**
   * Scroll until element is visible
   * @param element - Element to find
   * @param maxScrolls - Maximum scroll attempts
   * @param direction - Scroll direction
   */
  static async scrollToElement(
    element: WebdriverIO.Element,
    maxScrolls: number = 10,
    direction: 'up' | 'down' = 'down'
  ): Promise<void> {
    let scrollCount = 0;

    while (scrollCount < maxScrolls) {
      if (await element.isDisplayed().catch(() => false)) {
        return;
      }

      if (direction === 'down') {
        await this.swipeVertical(80, 20);
      } else {
        await this.swipeVertical(20, 80);
      }

      scrollCount++;
      await driver.pause(500);
    }

    throw new Error(`Element not found after ${maxScrolls} scrolls`);
  }

  /**
   * Long press on element
   * @param element - Element to long press
   * @param duration - Press duration in milliseconds
   */
  static async longPress(element: WebdriverIO.Element, duration: number = 2000): Promise<void> {
    const location = await element.getLocation();
    const size = await element.getSize();
    const x = location.x + size.width / 2;
    const y = location.y + size.height / 2;

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);

    await driver.releaseActions();
  }

  /**
   * Tap at specific coordinates
   * @param x - X coordinate
   * @param y - Y coordinate
   */
  static async tapAtCoordinates(x: number, y: number): Promise<void> {
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);

    await driver.releaseActions();
  }

  /**
   * Double tap on element
   * @param element - Element to double tap
   */
  static async doubleTap(element: WebdriverIO.Element): Promise<void> {
    await element.click();
    await driver.pause(100);
    await element.click();
  }

  /**
   * Pinch to zoom (zoom out)
   */
  static async pinchOut(): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const centerX = width / 2;
    const centerY = height / 2;
    const offset = 100;

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX, y: centerY - offset },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: centerX, y: centerY - offset * 2 },
          { type: 'pointerUp', button: 0 },
        ],
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX, y: centerY + offset },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: centerX, y: centerY + offset * 2 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);

    await driver.releaseActions();
  }

  /**
   * Pinch to zoom (zoom in)
   */
  static async pinchIn(): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const centerX = width / 2;
    const centerY = height / 2;
    const offset = 200;

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX, y: centerY - offset },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: centerX, y: centerY - offset / 2 },
          { type: 'pointerUp', button: 0 },
        ],
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX, y: centerY + offset },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: centerX, y: centerY + offset / 2 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);

    await driver.releaseActions();
  }
}

export default GestureHelper;
