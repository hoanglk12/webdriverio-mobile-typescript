import type { Options } from '@wdio/types';
import { config as dotenvConfig } from 'dotenv';
import AllureReporter from '@wdio/allure-reporter';
import { logger } from '../utils/logger';

dotenvConfig();

export const config: any = {
  //
  // ==================
  // Runner Configuration
  // ==================
  runner: 'local',

  //
  // ==================
  // Specs & Suites
  // ==================
  specs: ['../tests/specs/**/*.spec.ts'],
  exclude: [],

  suites: {
    smoke: ['../tests/specs/smoke/**/*.spec.ts'],
    regression: ['../tests/specs/regression/**/*.spec.ts'],
    login: ['../tests/specs/**/login.spec.ts'],
  },

  //
  // ==================
  // Capabilities
  // ==================
  maxInstances: parseInt(process.env.MAX_INSTANCES || '2'),

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
    },
  ],

  //
  // ==================
  // Test Configurations
  // ==================
  logLevel: (process.env.LOG_LEVEL as Options.Testrunner['logLevel']) || 'info',
  bail: 0,
  baseUrl: '',
  waitforTimeout: parseInt(process.env.EXPLICIT_WAIT || '10000'),
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  //
  // ==================
  // Services
  // ==================
  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          address: process.env.APPIUM_HOST || 'localhost',
          port: parseInt(process.env.APPIUM_PORT || '4723'),
          relaxedSecurity: true,
          allowInsecure: ['chromedriver_autodownload'],
        },
        logPath: './reports/logs/',
      },
    ],
  ],

  //
  // ==================
  // Framework & Reporter
  // ==================
  framework: 'mocha',

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: process.env.ALLURE_RESULTS_DIR || './reports/allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: false,
      },
    ],
  ],

  //
  // ==================
  // Mocha Options
  // ==================
  mochaOpts: {
    ui: 'bdd',
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '60000'),
    require: ['tsconfig-paths/register'],
    retries: 1,
  },

  //
  // ==================
  // Hooks
  // ==================

  /**
   * Gets executed once before all workers get launched.
   */
  onPrepare: function () {
    logger.info('====================================');
    logger.info('Starting Test Execution');
    logger.info('====================================');
  },

  /**
   * Gets executed before a worker process is spawned
   */
  onWorkerStart: function (cid: string) {
    logger.info(`Worker ${cid} started`);
  },

  /**
   * Gets executed before test execution begins
   */
  before: async function () {
    // Import Chai and setup assertions
    const chai = await import('chai');
    // Note: WebdriverIO v9 has built-in expect, but we keep Chai for compatibility
    (global as any).chaiExpect = chai.expect;
    global.assert = chai.assert;
    (global as any).should = chai.should();

    // Set implicit wait (renamed from setImplicitTimeout)
    await browser.setTimeout({ implicit: parseInt(process.env.IMPLICIT_WAIT || '5000') });

    logger.info('Test session initialized');
  },

  /**
   * Runs before a WebdriverIO command gets executed.
   */
  beforeCommand: function () {
    // logger.debug(`Executing command`);
  },

  /**
   * Hook that gets executed before the suite starts
   */
  beforeSuite: function (suite: any) {
    logger.info(`Starting suite: ${suite.title}`);
  },

  /**
   * Hook that gets executed before test execution
   */
  beforeTest: function (test: any) {
    logger.info(`Starting test: ${test.title}`);
  },

  /**
   * Hook that gets executed after a test
   */
  afterTest: async function (test: any, _context: any, { passed }: any) {
    if (!passed) {
      logger.error(`Test failed: ${test.title}`);

      // Take screenshot on failure
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const screenshotPath = `${process.env.SCREENSHOT_DIR || './reports/screenshots'}/${test.title.replace(/\s+/g, '_')}_${timestamp}.png`;

      try {
        await driver.saveScreenshot(screenshotPath);
        logger.info(`Screenshot saved: ${screenshotPath}`);

        // Attach to Allure
        AllureReporter.addAttachment(
          'Screenshot on Failure',
          await driver.takeScreenshot(),
          'image/png'
        );
      } catch (screenshotError) {
        logger.error(`Failed to capture screenshot: ${screenshotError}`);
      }
    } else {
      logger.info(`Test passed: ${test.title}`);
    }
  },

  /**
   * Hook that gets executed after the suite has ended
   */
  afterSuite: function (suite: any) {
    logger.info(`Completed suite: ${suite.title}`);
  },

  /**
   * Gets executed after all tests are done
   */
  after: function () {
    logger.info('Test session completed');
  },

  /**
   * Gets executed after all workers got shut down
   */
  onComplete: function (exitCode: number) {
    logger.info('====================================');
    logger.info('Test Run Complete');
    logger.info(`Exit Code: ${exitCode}`);
    logger.info('====================================');
  },
};
