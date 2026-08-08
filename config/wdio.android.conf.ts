import { config as baseConfig } from './wdio.conf';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ quiet: true });

export const config: WebdriverIO.Config = {
  ...baseConfig,

  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
      'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '13.0',
      'appium:automationName': 'UiAutomator2',
      'appium:app': process.env.ANDROID_APP_PATH,
      'appium:autoGrantPermissions': true,
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 300,
      'appium:androidInstallTimeout': 90000,
      'appium:uiautomator2ServerInstallTimeout': 60000,
      'appium:adbExecTimeout': 60000,
      'appium:disableWindowAnimation': true,
      'appium:skipServerInstallation': false,
    },
  ],
};
