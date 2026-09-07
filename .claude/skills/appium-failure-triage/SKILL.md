---
name: appium-failure-triage
description: Use when an Appium/WebdriverIO test in this framework fails mid-run (local or on BrowserStack) and you need to see what was actually on-device at the point of failure — e.g. "this test failed with element not found, what was on screen", "the login test timed out, check the device", "is the app even showing the right screen right now", "check what happened on the BrowserStack run". Uses the appium-mcp MCP server to inspect the live element tree, take a screenshot, and check session/app state, then cross-references the framework's own Page Objects and logs. Not for CI infrastructure failures (see ci-release-triage) or for setting up/running the suite in the first place (see running-mobile-tests-appium).
---

# Triaging a failing Appium test with `appium-mcp`

This is for a test that _ran_ (a session started) but failed on an assertion, a "element not found" / timeout, or unexpected app behavior — situations where reading the stack trace alone leaves the real cause (stale selector vs. timing vs. wrong screen vs. permission dialog) ambiguous.

Requires the `appium-mcp` MCP server (registered project-scoped in `.mcp.json`, package `appium-mcp`, official `appium/appium-mcp`). If its tools (`mcp__appium-mcp__*`) aren't loaded yet, `ToolSearch` for them first.

## Procedure

1. **Attach to (or start) a matching session.** Match the failing spec's platform/capabilities — pull the actual capabilities from `config/wdio.android.conf.ts` or `config/wdio.ios.conf.ts` (device name, platform version, app path) so the MCP session mirrors what the failing wdio run used, not an arbitrary default device.
2. **Pull the live element tree / page source** at (or as close as possible to) the point of failure. Compare it against the failing Page Object's selectors in `src/pages/*.ts`:
   - Is the accessibility ID (`~name`) actually present in the current tree? A rename in the app under test is a common silent break.
   - If the page object has Android/iOS-specific fallback selectors (`executePlatformSpecific`), check whether the divergence is still accurate — app UI changes can invalidate one platform's selector while the other still works, making the failure look platform-specific when the fix is just updating one getter.
   - Is the element present but not yet displayed/clickable? That's a timing gap `waitForElementDisplayed`/`waitForElementClickable` (in `BasePage`) should be covering — check the timeout value used, not just whether the wait call exists.
3. **Take a screenshot via the MCP tool** at the failure point. Compare it against the framework's own on-failure capture in `reports/screenshots/` from the same run — two vantage points on the same moment often disambiguate "wrong screen entirely" from "right screen, wrong selector."
4. **Check session/app state**: current context (native vs. webview — a webview element won't resolve via a native accessibility-ID selector), foreground app (did an OS permission dialog or a crash overlay steal focus?), app permission state (a first-run permission prompt can block every subsequent selector if a page object doesn't handle it).
5. **Cross-reference `reports/logs/`** (Winston output — every `BasePage` action call logs before/after) for the last successfully logged action before the failure, to narrow down exactly which step in a multi-step page object method (e.g. `login()` = enterUsername → enterPassword → hideKeyboard → click) is where things actually diverged.
6. **Only reach for AI-vision element finding** (if the `appium-mcp` server has vision configured) once traditional locators are confirmed genuinely absent or renamed with no accessibility-ID convention available. This repo's convention is accessibility-id-first (`mobile-page-object-authoring`) — vision-based finding is a diagnostic aid to confirm _what's on screen_, not a replacement for fixing the actual selector in the page object.

## Output

State plainly which of these it was: stale/renamed selector, timing gap, wrong screen/context, or a permission/dialog blocker — and point at the specific page object getter or wait call to fix. Don't leave the root cause as "the test failed" after using these tools.

## Triaging a BrowserStack cloud session instead of a local one

`appium-mcp` isn't limited to embedded local sessions — it also supports attaching to any existing Appium-compatible endpoint via a `remoteServerUrl` argument on session creation, which covers a `test:browserstack:*` failure with no local emulator involved:

1. Build the remote URL from `.env`'s `BROWSERSTACK_USERNAME`/`BROWSERSTACK_ACCESS_KEY`: `https://<user>:<key>@hub-cloud.browserstack.com/wd/hub`. `appium-mcp` parses `user`/`key` straight out of the URL's userinfo, so there's no separate auth step.
2. Pass the matching `bstack:options` capabilities from `config/wdio.browserstack.android.conf.ts` or `config/wdio.browserstack.ios.conf.ts` (`deviceName`, `platformVersion`) rather than the local `wdio.android.conf.ts`/`wdio.ios.conf.ts` values — a mismatched device/OS pair against BrowserStack's real catalog fails session creation outright rather than falling back to something close.
3. Steps 2 through 6 of the local procedure above are unchanged — element tree, screenshot, session/app state, and log cross-reference all operate on whatever session is attached, local or remote.

Useful on a machine with no local Android/iOS device set up at all: attaching remotely to BrowserStack doesn't need `ANDROID_HOME`, an emulator, or a simulator.
