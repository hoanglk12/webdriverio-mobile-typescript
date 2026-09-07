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

| Goal                                           | Script                                                                           |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| Run against whichever config is default        | `npm test` (`config/wdio.conf.ts`)                                               |
| Run Android specifically                       | `npm run test:android` (`config/wdio.android.conf.ts`)                           |
| Run iOS specifically                           | `npm run test:ios` (`config/wdio.ios.conf.ts`, macOS only)                       |
| Only smoke-tagged suite                        | `npm run test:smoke`                                                             |
| Only regression suite                          | `npm run test:regression`                                                        |
| Every spec regardless of suite                 | `npm run test:parallel`                                                          |
| Just verify code quality, no device run        | `npm run test:verify` (type-check + lint)                                        |
| Fuller environment sanity check                | `npm run verify` (runs `verify-framework.ps1`)                                   |
| Run Android on BrowserStack instead of locally | `npm run test:browserstack:android` (`config/wdio.browserstack.android.conf.ts`) |
| Run iOS on BrowserStack instead of locally     | `npm run test:browserstack:ios` (`config/wdio.browserstack.ios.conf.ts`)         |

Platform and suite choice matter — `test:android`/`test:ios` pick the capabilities config, `test:smoke`/`test:regression` pick which spec folder(s) under `tests/specs/` run. They compose: e.g. run Android smoke tests by using `wdio run ./config/wdio.android.conf.ts --suite smoke` directly if there's no combined npm script for the exact pairing you need.

## Cloud device farm (BrowserStack)

For running against a real device without a local emulator/simulator (this repo's Genymotion setup, or a Mac for iOS):

1. Sign up at BrowserStack and grab a username/access key from Account Settings. A private repo only gets a one-time 100-minute trial; applying at browserstack.com/open-source once the repo is public gets unlimited Live/Automate/Percy instead (5 users, 5 parallel sessions) — either way the steps below are identical, only the credentials' source changes.
2. Set `BROWSERSTACK_USERNAME`/`BROWSERSTACK_ACCESS_KEY` in `.env`.
3. Upload the app to get a `bs://` app ID: `npm run browserstack:upload:android` (or `:ios`), then paste the printed ID into `BROWSERSTACK_ANDROID_APP_ID`/`BROWSERSTACK_IOS_APP_ID` in `.env`. Re-run this whenever the APK/IPA changes — the app ID is tied to that specific upload, not the file path.
4. Run `npm run test:browserstack:android` (or `:ios`, `--suite smoke`/`--suite regression` compose the same way as the local scripts). No local Appium server or emulator/simulator is needed — BrowserStack is both.
5. iOS specifically needs a signed `.ipa` uploaded, not a Simulator-only `.app`/`.app.zip` build — BrowserStack's real devices can't run a Simulator binary. Check what's actually available under `apps/ios/` before assuming this path is ready to go.

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

## Genymotion VM instability on Windows — check host RAM first

If the Genymotion Android VM shows any of: SystemUI ANRs, `system_server` crashes (`dumpsys window`/`dumpsys activity` returning `Can't find service: ...` or `DEAD_OBJECT`/`Broken pipe`), or the Genymotion GUI errors with "the virtual device did not get any IP address" — **check host free RAM before touching Appium config, driver versions, or capabilities**:

```powershell
Get-CimInstance Win32_OperatingSystem | Select-Object @{N='FreeGB';E={[math]::Round($_.FreePhysicalMemory/1MB,1)}}
```

Under ~3-4GB free (common with Chrome/Claude Code/WSL running alongside an 8GB-allocated VM), the guest crashes reliably the instant UiAutomator2 session-init touches any package-manager/settings-service call. This has been mistaken for a driver bug before — it wasn't. Close other apps/tabs to free RAM rather than chasing driver versions or `appium:ignoreHiddenApiPolicyError`-style capability tweaks first.

**Rebooting the guest (`adb reboot`, or `VBoxManage poweroff`+`startvm`) does not fix this** — it reproduces identically because host memory pressure is untouched by rebooting the guest. If instability recurs identically across 2+ clean reboots, stop rebooting; either free host RAM or recreate the VM from a clean snapshot (`VBoxManage snapshot "<device>" restore <snapshot-name>`, or via Genymotion Manager) — repeated hard `poweroff`s can also degrade guest disk state over a troubleshooting session, so a snapshot restore fixes both causes at once.

Two related gotchas when recreating/rebooting the VM:

- **`adb shell getprop sys.boot_completed` is unreliable (often always empty)** on Genymotion's vbox86 images — don't gate any wait on it. Poll `adb shell service list | grep -E "activity:|package:|window:"` instead; full boot means all three are registered.
- **A recreated/restarted VM can get a different DHCP-assigned IP** than before (e.g. `.101` → `.102`). Always confirm the live IP via `adb devices -l` (after `adb connect <ip>:5555`) rather than assuming a previously-known IP still applies.
