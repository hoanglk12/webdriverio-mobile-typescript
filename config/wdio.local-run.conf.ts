import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { config as baseConfig } from './wdio.conf';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const androidAppPath = path.resolve(__dirname, '../apps/android/FrontRow.apk');

/**
 * Config for a manual local run against a standalone Appium server (not
 * the wdio-managed `appium` service, which has no global `appium` on PATH
 * on Windows) on a free port — the default 4723 may already be bound by
 * appium-mcp. Start the server first:
 *   npx appium --address 127.0.0.1 --port 4725 --relaxed-security
 * Then: npx wdio run ./config/wdio.local-run.conf.ts
 *
 * `appium:app` is resolved relative to this file (via import.meta.url),
 * not process.cwd() — Appium capability paths resolve against the Node
 * process's cwd by default, which silently breaks if this file's own
 * relative path assumption is used instead.
 */
export const config: WebdriverIO.Config = {
  ...baseConfig,
  hostname: '127.0.0.1',
  port: 4725,
  path: '/',
  services: [],
  specs: ['../tests/specs/smoke/navigation.spec.ts'],
  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': 'Android Emulator',
      'appium:platformVersion': '13.0',
      'appium:automationName': 'UiAutomator2',
      'appium:app': androidAppPath,
      'appium:appPackage': 'app.frontrow.qa',
      'appium:appActivity': '.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 300,
      'appium:androidInstallTimeout': 90000,
      // This Genymotion vbox86 image crashes system_server when UiAutomator2
      // tries to change the hidden API policy via `adb shell settings` at
      // session start/end. Ignoring the failure avoids that crash entirely.
      // See appium-uiautomator2-driver README.md and appium/appium#13802.
      'appium:ignoreHiddenApiPolicyError': true,
    },
  ],
};
