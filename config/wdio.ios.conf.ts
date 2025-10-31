import { config as baseConfig } from './wdio.conf';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config: WebdriverIO.Config = {
  ...baseConfig,

  capabilities: [
    {
      platformName: 'iOS',
      'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 14 Pro',
      'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '16.0',
      'appium:automationName': 'XCUITest',
      'appium:app': process.env.IOS_APP_PATH,
      'appium:udid': process.env.IOS_UDID || 'auto',
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 300,
      'appium:wdaLaunchTimeout': 120000,
      'appium:wdaConnectionTimeout': 120000,
      'appium:autoAcceptAlerts': false,
      'appium:autoDismissAlerts': false,
    },
  ],
};
