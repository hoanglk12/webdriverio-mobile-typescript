import type { Options, Frameworks } from '@wdio/types';
import { config as dotenvConfig } from 'dotenv';
import AllureReporter from '@wdio/allure-reporter';
import { logger } from '../utils/logger';

dotenvConfig({ quiet: true });

export const config: WebdriverIO.Config = {
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
          // Appium writes its own log file directly (via its --log CLI flag),
          // independent of @wdio/appium-service's logPath piping below. The
          // service pipes the child process's stdout/stderr into logPath only
          // *after* its own startup-detection listener resolves and detaches -
          // an async gap (it awaits fs.mkdir first) during which a crash right
          // after "REST http interface listener started" is silently dropped,
          // leaving logPath's file empty. This flag catches that case too,
          // since Appium itself opens the file synchronously as part of --log.
          log: './reports/logs/appium-server.log',
        },
        // Default is 30s. On this machine loading both the uiautomator2 and
        // xcuitest drivers (Appium loads every installed driver at boot,
        // regardless of platform under test) can take 30-45s on cold start —
        // observed via `appium` run directly: ~14s + ~31s sequentially.
        // Bump generously so a slow/first-run boot doesn't race the default.
        appiumStartTimeout: 90000,
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
    global.chaiExpect = chai.expect;
    global.assert = chai.assert;
    global.should = chai.should();

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
  beforeSuite: function (suite: Frameworks.Suite) {
    logger.info(`Starting suite: ${suite.title}`);
  },

  /**
   * Hook that gets executed before test execution
   */
  beforeTest: function (test: Frameworks.Test) {
    logger.info(`Starting test: ${test.title}`);
  },

  /**
   * Hook that gets executed after a test
   */
  afterTest: async function (
    test: Frameworks.Test,
    _context: unknown,
    { passed }: Frameworks.TestResult
  ) {
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
  afterSuite: function (suite: Frameworks.Suite) {
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
