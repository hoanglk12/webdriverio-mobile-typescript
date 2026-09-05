---
name: mobile-page-object-authoring
description: Use when adding a new Page Object class or a new UI test spec (smoke/regression) to this WebdriverIO+Appium mobile framework — e.g. "add a page object for the Settings screen", "write a test for the search flow", "add a method to LoginPage", "how do I select an element for Android vs iOS here". Encodes this repo's actual POM conventions (BasePage wrapper methods, accessibility-id-first selectors, platform-specific fallback, GestureHelper, Assertions, Allure tagging) so new pages/specs match the existing ones instead of reinventing the pattern.
---

# Authoring a Page Object + spec in this framework

This repo follows a specific, already-established Page Object Model shape (see `src/pages/LoginPage.ts` and `src/pages/HomePage.ts` as worked examples). Match it exactly — don't call WebdriverIO element methods directly, don't hand-roll gesture code, don't invent a new selector strategy.

## 1. Page Object class

- Extend `BasePage` (`src/pages/BasePage.ts`), one file per screen in `src/pages/`.
- Selectors are `private get` accessors returning `$('~name')` (accessibility ID) or `$$('~name')` for collections. Accessibility ID is the **default and preferred** strategy — it works identically on Android and iOS.
- Only add platform-specific selector getters (`androidX` / `iosX` naming, see `LoginPage.androidUsernameInput` / `iosUsernameInput`) when there's a real divergence the accessibility ID can't cover. Route the platform-specific code path through `this.executePlatformSpecific(androidAction, iosAction)` (defined on `BasePage`) — never branch on `driver.capabilities.platformName` manually in a page object.
- Use `productByName(name: string)` style parameterized getters (see `HomePage`) for dynamic/list elements rather than indexing into a collection.
- Public methods are the screen's behavior surface (`login()`, `searchProduct()`, `getProductCount()`), implemented in terms of `BasePage`'s protected wrapper methods:
  - `this.click(el)`, `this.setValue(el, value)`, `this.addValue(el, value)`, `this.getText(el)`, `this.getAttribute(el, attr)`
  - `this.isDisplayed(el)`, `this.isExisting(el)`
  - `this.waitForElementDisplayed(el, timeout?)`, `this.waitForElementClickable(el, timeout?)`, `this.waitForElementExist(el, timeout?)`
  - `this.scrollToElement(el)`, `this.swipe(direction, percentage?)`, `this.hideKeyboard()`, `this.takeScreenshot(fileName)`, `this.pause(ms)`, `this.getPlatform()`
  - These already wrap try/catch + Winston logging (`utils/logger.ts`) — don't add your own logging around them.
- Export a **singleton instance**, not the class: `export default new LoginPage();` (matches every existing page object).
- Every screen should have `is<Screen>PageDisplayed(): Promise<boolean>` and `waitFor<Screen>Page(): Promise<void>` methods, keyed off the screen's most reliable "loaded" indicator element (e.g. `welcomeMessage` for Home, `loginButton` for Login).

## 2. Gestures beyond simple tap/type

Use `GestureHelper` (`utils/gestureHelper.ts`) — don't call `driver.performActions` directly in a page object:
- `GestureHelper.swipeVertical/swipeHorizontal(startPct, endPct, duration)`
- `GestureHelper.scrollToElement(element, maxScrolls, direction)`
- `GestureHelper.longPress(element, duration)`, `GestureHelper.doubleTap(element)`
- `GestureHelper.tapAtCoordinates(x, y)`, `GestureHelper.pinchIn()/pinchOut()`
- For a plain directional swipe on the current screen, prefer `BasePage.swipe()` (already available via `this.swipe(...)` inside a page object) over calling `GestureHelper` directly — `GestureHelper` is for the less common gestures `BasePage` doesn't already wrap.

## 3. Assertions

Use `Assertions` (`utils/assertions.ts`) for mobile-specific checks in specs — `Assertions.assertDisplayed(el)`, `assertTextEquals(el, expected)`, `assertTextContains`, `assertAttributeEquals`, `assertClickable`, `assertEnabled/Disabled`, `assertElementsCount`, `assertUrlContains`, and `Assertions.softAssert(condition, message)` for non-fatal checks. Use plain Chai `expect(...)` for everything else (non-element values, API responses, plain booleans).

**Never call `element.isClickable()` or `element.waitForClickable()` directly** — WebdriverIO throws for both in native mobile app context ("Method not supported in mobile native environment" / "only available for desktop and mobile browsers"). `BasePage.isClickable()`/`click()`/`waitForElementClickable()` and `Assertions.assertClickable()` already check the platform-native `clickable` attribute (Android) / `isEnabled()` (iOS) instead — always go through those rather than the raw WebdriverIO methods. If you add a *new* clickability-adjacent helper, verify it against a live device before trusting it (this bug stayed hidden until a real `.click()`/`assertClickable()` call was exercised — see `running-mobile-tests-appium`'s Genymotion section for why environment failures can mask whether a code path even ran).

## 4. Test data

Pull fixtures from `tests/data/testData.ts` instead of inlining literals like `'testuser@example.com'` directly in a spec — add new fixtures there if the scenario needs new data.

## 5. Spec file conventions

- Location: `tests/specs/smoke/` for critical-path checks, `tests/specs/regression/` for broader coverage, `tests/specs/api/` for API-only tests, `tests/specs/verification/` for framework self-checks. Suite folder membership is what `npm run test:smoke` / `test:regression` filter on — putting a spec in the wrong folder silently excludes it from that suite run.
- Import the page singleton, not the class: `import loginPage from '../../../src/pages/LoginPage';`.
- Tag with Allure (`import AllureReporter from '@wdio/allure-reporter';`): `AllureReporter.addFeature('...')` once per describe block, `addStory('...')` per scenario, `addStep('...')` at key checkpoints — mirrors the pattern in `tests/specs/smoke/login.spec.ts` and `tests/specs/api/api.spec.ts`.
- Structure: `describe` per screen/feature, nested `describe` per sub-flow, `it` per scenario — Mocha + Chai (`import { describe, it } from 'mocha'; import { expect } from 'chai';`).

## After writing

Run `npm run type-check && npm run lint` before considering the page object/spec done — the ESLint config here has repo-specific rules (see root `CLAUDE.md`) that a naive TS file can trip (e.g. `no-unused-vars` with the `_` ignore pattern, `no-explicit-any` as a warning).
