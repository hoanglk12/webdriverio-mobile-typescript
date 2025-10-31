import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import LoginPage from '../../../src/pages/LoginPage';
import HomePage from '../../../src/pages/HomePage';
import { validUsers } from '../../data/testData';
import { GestureHelper } from '../../../utils/gestureHelper';
import AllureReporter from '@wdio/allure-reporter';

describe('Home Page Feature', () => {
  before(async () => {
    AllureReporter.addFeature('Home Page');

    // Login before accessing home page
    const user = validUsers[0];
    await LoginPage.waitForLoginPage();
    await LoginPage.login(user.username, user.password);
    await HomePage.waitForHomePage();
  });

  describe('Home Page Display', () => {
    it('should display welcome message after login', async () => {
      AllureReporter.addStory('Welcome Message');
      AllureReporter.addSeverity('normal');

      const welcomeMessage = await HomePage.getWelcomeMessage();
      expect(welcomeMessage).to.not.be.empty;
      expect(welcomeMessage).to.be.a('string');

      AllureReporter.addStep(`Welcome message: ${welcomeMessage}`);
    });

    it('should display product list', async () => {
      AllureReporter.addStory('Product Display');

      const productCount = await HomePage.getProductCount();
      expect(productCount, 'Product count should be greater than 0').to.be.greaterThan(0);

      AllureReporter.addStep(`Products displayed: ${productCount}`);
    });
  });

  describe('Home Page Navigation', () => {
    it('should navigate to profile page', async () => {
      AllureReporter.addStory('Profile Navigation');

      await HomePage.clickProfileIcon();
      await driver.pause(2000);

      AllureReporter.addStep('Navigated to profile page');
    });

    it('should navigate to settings page', async () => {
      AllureReporter.addStory('Settings Navigation');

      await HomePage.clickSettingsIcon();
      await driver.pause(2000);

      AllureReporter.addStep('Navigated to settings page');
    });
  });

  describe('Search Functionality', () => {
    it('should search for products', async () => {
      AllureReporter.addStory('Product Search');

      const searchTerm = 'Product';
      await HomePage.searchProduct(searchTerm);
      await driver.pause(2000);

      const productCount = await HomePage.getProductCount();
      expect(productCount).to.be.greaterThan(0);

      AllureReporter.addStep(`Search results for "${searchTerm}": ${productCount} products`);
    });
  });

  describe('Gesture Interactions', () => {
    it('should perform pull to refresh', async () => {
      AllureReporter.addStory('Pull to Refresh');

      await HomePage.pullToRefresh();

      const isHomeDisplayed = await HomePage.isHomePageDisplayed();
      expect(isHomeDisplayed).to.be.true;

      AllureReporter.addStep('Pull to refresh completed');
    });

    it('should scroll vertically', async () => {
      AllureReporter.addStory('Vertical Scroll');

      await GestureHelper.swipeVertical(80, 20, 1000);
      await driver.pause(1000);

      AllureReporter.addStep('Scrolled down successfully');

      await GestureHelper.swipeVertical(20, 80, 1000);
      await driver.pause(1000);

      AllureReporter.addStep('Scrolled up successfully');
    });

    it('should perform horizontal swipe', async () => {
      AllureReporter.addStory('Horizontal Swipe');

      await GestureHelper.swipeHorizontal(80, 20, 1000);
      await driver.pause(1000);

      AllureReporter.addStep('Swiped left successfully');
    });
  });

  describe('Logout Functionality', () => {
    it('should logout successfully', async () => {
      AllureReporter.addStory('Logout');
      AllureReporter.addSeverity('critical');

      await HomePage.logout();
      await LoginPage.waitForLoginPage();

      const isLoginPageDisplayed = await LoginPage.isLoginPageDisplayed();
      expect(isLoginPageDisplayed, 'Should return to login page after logout').to.be.true;

      AllureReporter.addStep('Logout completed successfully');
    });
  });

  afterEach(async function () {
    if (this.currentTest?.state === 'failed') {
      AllureReporter.addAttachment(
        'Screenshot on Failure',
        await driver.takeScreenshot(),
        'image/png'
      );
    }
  });
});
