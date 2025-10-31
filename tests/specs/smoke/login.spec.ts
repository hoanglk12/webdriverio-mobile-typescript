import { describe, it } from 'mocha';
import { expect } from 'chai';
import LoginPage from '../../../src/pages/LoginPage';
import HomePage from '../../../src/pages/HomePage';
import { validUsers, invalidUsers } from '../../data/testData';
import { Assertions } from '../../../utils/assertions';
import AllureReporter from '@wdio/allure-reporter';

describe('Login Feature', () => {
  beforeEach(async () => {
    AllureReporter.addFeature('Authentication');
    AllureReporter.addSeverity('critical');
  });

  describe('Valid Login Scenarios', () => {
    it('should login successfully with valid credentials', async () => {
      AllureReporter.addStory('Successful Login');
      AllureReporter.addDescription('Verify user can login with valid credentials');

      const user = validUsers[0];

      // Wait for login page
      await LoginPage.waitForLoginPage();

      // Verify login page is displayed
      await Assertions.assertDisplayed(
        LoginPage['loginButton'] as any,
        'Login button should be displayed'
      );

      // Perform login
      await LoginPage.login(user.username, user.password);

      // Verify home page is displayed
      await HomePage.waitForHomePage();
      const isHomeDisplayed = await HomePage.isHomePageDisplayed();
      expect(isHomeDisplayed, 'Home page should be displayed after login').to.be.true;

      // Verify welcome message
      const welcomeMessage = await HomePage.getWelcomeMessage();
      expect(welcomeMessage).to.include(user.displayName);

      AllureReporter.addStep('Login completed successfully');
    });

    it('should handle keyboard properly during login', async () => {
      AllureReporter.addStory('Keyboard Handling');

      const user = validUsers[0];

      await LoginPage.waitForLoginPage();
      await LoginPage.enterUsername(user.username);
      await LoginPage.enterPassword(user.password);

      // Keyboard should be hidden before clicking login
      await LoginPage['hideKeyboard']();
      await LoginPage.clickLoginButton();

      await HomePage.waitForHomePage();
      const isHomeDisplayed = await HomePage.isHomePageDisplayed();
      expect(isHomeDisplayed).to.be.true;
    });
  });

  describe('Invalid Login Scenarios', () => {
    invalidUsers.forEach((invalidUser: (typeof invalidUsers)[0], index: number) => {
      it(`should show error for invalid credentials - Case ${index + 1}`, async () => {
        AllureReporter.addStory('Invalid Login');
        AllureReporter.addDescription(`Verify error message for: ${invalidUser.expectedError}`);

        await LoginPage.waitForLoginPage();
        await LoginPage.login(invalidUser.username, invalidUser.password);

        // Verify error message is displayed
        const isErrorDisplayed = await LoginPage.isErrorMessageDisplayed();
        expect(isErrorDisplayed, 'Error message should be displayed').to.be.true;

        // Verify error message text
        const errorMessage = await LoginPage.getErrorMessage();
        expect(errorMessage).to.include(invalidUser.expectedError);

        AllureReporter.addStep(`Error message verified: ${errorMessage}`);
      });
    });

    it('should not login with empty credentials', async () => {
      AllureReporter.addStory('Empty Credentials');

      await LoginPage.waitForLoginPage();
      await LoginPage.clickLoginButton();

      // Verify error or login button remains enabled
      const isLoginPageStillDisplayed = await LoginPage.isLoginPageDisplayed();
      expect(isLoginPageStillDisplayed, 'Should remain on login page').to.be.true;
    });
  });

  describe('Login Page Navigation', () => {
    it('should navigate to forgot password screen', async () => {
      AllureReporter.addStory('Forgot Password');

      await LoginPage.waitForLoginPage();
      await LoginPage.clickForgotPassword();

      // Add verification for forgot password screen
      await driver.pause(2000);
      AllureReporter.addStep('Navigated to forgot password screen');
    });

    it('should navigate to sign up screen', async () => {
      AllureReporter.addStory('Sign Up');

      await LoginPage.waitForLoginPage();
      await LoginPage.clickSignUp();

      // Add verification for sign up screen
      await driver.pause(2000);
      AllureReporter.addStep('Navigated to sign up screen');
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
