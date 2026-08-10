import { config as baseConfig } from './wdio.conf';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ quiet: true });

export const config: WebdriverIO.Config = {
  ...baseConfig,

  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  // BrowserStack is the Appium server here, so the local appium service from
  // wdio.conf.ts (which spawns its own server process) is replaced entirely.
  services: [
    [
      'browserstack',
      {
        app: process.env.BROWSERSTACK_ANDROID_APP_ID,
        buildIdentifier: '#${BUILD_NUMBER}',
        browserstackLocal: false,
      },
    ],
  ],

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'bstack:options': {
        deviceName: process.env.BROWSERSTACK_ANDROID_DEVICE_NAME || 'Google Pixel 7',
        platformVersion: process.env.BROWSERSTACK_ANDROID_OS_VERSION || '13.0',
        projectName: 'webdriverio-mobile-typescript',
        buildName: 'Android Cloud Run',
      },
    },
  ],
};
