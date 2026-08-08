---
name: running-mobile-tests-appium
description: Use when the user wants to run this framework's mobile test suite locally, set up Appium/drivers for the first time, pick the right npm script for a platform/suite, or figure out why a local run failed (emulator/simulator not booted, missing env, driver mismatch) — e.g. "run the smoke tests on Android", "how do I run this project", "set up Appium for iOS", "why did my local test run fail to start a session". Not for CI failures (see ci-release-triage) or for diagnosing what happened on-device mid-test (see appium-failure-triage).
---

# Running this framework's mobile tests locally

## One-time environment setup

1. `npm install` (repo deps).
2. Install Appium + drivers globally: `npm install -g appium`, then `appium driver install uiautomator2` (Android) and/or `appium driver install xcuitest` (iOS, macOS only). Verify with `appium driver list`.
3. Verify the environment: `npx appium-doctor --android` and/or `npx appium-doctor --ios`. This checks `ANDROID_HOME`, Java JDK, Xcode command line tools, etc. — fix everything it flags before running tests.
4. `cp .env.example .env` and fill in real values — at minimum `ANDROID_APP_PATH`/`ANDROID_DEVICE_NAME` or `IOS_APP_PATH`/`IOS_DEVICE_NAME`, depending on platform. The framework will not find a device/app without this.
5. Android: have an emulator running (Android Studio AVD Manager, or `emulator -avd <name>`) or a real device connected (`adb devices` should list it). iOS: have a simulator booted (`xcrun simctl list devices`) or a real device connected, on macOS only.

## Picking the right script

| Goal | Script |
|---|---|
| Run against whichever config is default | `npm test` (`config/wdio.conf.ts`) |
| Run Android specifically | `npm run test:android` (`config/wdio.android.conf.ts`) |
| Run iOS specifically | `npm run test:ios` (`config/wdio.ios.conf.ts`, macOS only) |
| Only smoke-tagged suite | `npm run test:smoke` |
| Only regression suite | `npm run test:regression` |
| Every spec regardless of suite | `npm run test:parallel` |
| Just verify code quality, no device run | `npm run test:verify` (type-check + lint) |
| Fuller environment sanity check | `npm run verify` (runs `verify-framework.ps1`) |

Platform and suite choice matter — `test:android`/`test:ios` pick the capabilities config, `test:smoke`/`test:regression` pick which spec folder(s) under `tests/specs/` run. They compose: e.g. run Android smoke tests by using `wdio run ./config/wdio.android.conf.ts --suite smoke` directly if there's no combined npm script for the exact pairing you need.

## After a run

- Raw Allure results: `reports/allure-results/`. Turn into a viewable report: `npm run allure:generate` then `npm run allure:open` (or `npm run allure:report` for both).
- Failure screenshots: `reports/screenshots/` (captured automatically on test failure).
- Full logs: `reports/logs/` (Winston output from `utils/logger.ts`, including everything `BasePage` methods log).

## Common local failure causes, roughly in order of likelihood

1. No emulator/simulator booted, or `adb devices`/`xcrun simctl list` doesn't show it — start it before running tests, not after.
2. `ANDROID_HOME` not set / not on PATH, or Java JDK missing — `appium-doctor` catches this.
3. `.env` never created from `.env.example`, so `ANDROID_APP_PATH`/`IOS_APP_PATH` etc. are undefined — the session fails to start with a capabilities error.
4. Installed Appium driver version doesn't match what the framework expects — check `appium-uiautomator2-driver`/`appium-xcuitest-driver` versions in `package.json` against `appium driver list --installed`.
5. Appium server port conflict (`APPIUM_HOST`/`APPIUM_PORT` in `.env`) — another Appium instance already bound to 4723.

If the session starts fine but a specific assertion/element fails mid-test, that's a different problem — use `appium-failure-triage` instead of re-running blindly.
