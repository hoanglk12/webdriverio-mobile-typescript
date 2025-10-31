import { BasePage } from './BasePage';

/**
 * Login Page Object
 * Represents the login screen of the mobile application
 */
export class LoginPage extends BasePage {
  /**
   * Selectors for Login page elements
   */
  private get usernameInput() {
    return $('~username-input'); // Accessibility ID
  }

  private get passwordInput() {
    return $('~password-input');
  }

  private get loginButton() {
    return $('~login-button');
  }

  private get errorMessage() {
    return $('~error-message');
  }

  private get forgotPasswordLink() {
    return $('~forgot-password-link');
  }

  private get signUpButton() {
    return $('~sign-up-button');
  }

  /**
   * Android specific selectors
   */
  private get androidUsernameInput() {
    return $('android=new UiSelector().resourceId("com.example:id/username")');
  }

  private get androidPasswordInput() {
    return $('android=new UiSelector().resourceId("com.example:id/password")');
  }

  /**
   * iOS specific selectors
   */
  private get iosUsernameInput() {
    return $('ios=.textFields()[0]');
  }

  private get iosPasswordInput() {
    return $('ios=.secureTextFields()[0]');
  }

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.loginButton);
  }

  /**
   * Wait for login page to be displayed
   */
  async waitForLoginPage(): Promise<void> {
    await this.waitForElementDisplayed(this.loginButton, 15000);
  }

  /**
   * Enter username
   * @param username - Username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.setValue(this.usernameInput, username);
  }

  /**
   * Enter password
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.setValue(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Perform login action
   * @param username - Username
   * @param password - Password
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.hideKeyboard();
    await this.clickLoginButton();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.errorMessage);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Click sign up button
   */
  async clickSignUp(): Promise<void> {
    await this.click(this.signUpButton);
  }

  /**
   * Platform-specific login (example)
   * @param username - Username
   * @param password - Password
   */
  async platformSpecificLogin(username: string, password: string): Promise<void> {
    await this.executePlatformSpecific(
      // Android
      async () => {
        await this.setValue(this.androidUsernameInput, username);
        await this.setValue(this.androidPasswordInput, password);
      },
      // iOS
      async () => {
        await this.setValue(this.iosUsernameInput, username);
        await this.setValue(this.iosPasswordInput, password);
      }
    );
    await this.clickLoginButton();
  }
}

export default new LoginPage();
