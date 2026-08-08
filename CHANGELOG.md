# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-27

### Added

#### Core Framework
- WebdriverIO v8+ integration with TypeScript
- Mocha test framework configuration
- Chai assertion library with custom assertions
- Page Object Model (POM) architecture
- BasePage class with common mobile interactions

#### Testing Capabilities
- Android test configuration (UiAutomator2)
- iOS test configuration (XCUITest)
- Cross-platform support
- Parallel test execution
- Data-driven testing support
- API testing integration with Axios

#### Utilities
- Winston logger with multiple transports
- Custom assertion helpers
- Gesture helper for mobile interactions (swipe, scroll, tap, etc.)
- API client for integration testing
- Helper utilities (retry, wait, random data generation)

#### Reporting
- Allure reporting integration
- Screenshot capture on test failures
- Video recording capability
- Comprehensive test logs
- Step-by-step execution tracking

#### Code Quality
- ESLint configuration for TypeScript
- Prettier code formatting
- Husky pre-commit hooks
- TypeScript strict mode
- Type definitions for WebdriverIO

#### CI/CD
- GitHub Actions workflow
  - Automated linting and type checking
  - Android emulator testing
  - iOS simulator testing
  - Allure report generation
  - Artifact uploads
  - Slack notifications
- Docker support
- Docker Compose configuration

#### Documentation
- Comprehensive README with setup instructions
- Contributing guidelines
- Troubleshooting guide
- Code examples and best practices
- API documentation

#### Test Examples
- Login page object example
- Home page object example
- Smoke test suite
- Regression test suite
- API integration tests
- Data-driven test examples

#### Configuration
- Environment-based configuration
- Platform-specific configurations
- Test suites (smoke, regression)
- Customizable timeouts
- Parallel execution settings

### Technical Details

#### Dependencies
- @wdio/cli: ^8.27.0
- @wdio/mocha-framework: ^8.27.0
- @wdio/allure-reporter: ^8.27.0
- appium: ^2.4.1
- typescript: ^5.3.3
- chai: ^4.3.10
- winston: ^3.11.0

#### Supported Platforms
- Android: API Level 28+
- iOS: iOS 14.0+
- Node.js: 18.0.0+

#### Features by Category

**Mobile Automation**
- Element interaction (click, type, swipe)
- Gesture support (swipe, scroll, pinch, zoom)
- Keyboard handling
- Screenshot capture
- Platform-specific actions

**Test Organization**
- Page Object Model pattern
- Reusable components
- Test data management
- Fixture support

**Execution**
- Sequential execution
- Parallel execution
- Suite-based execution
- Platform-specific execution

**Reporting**
- Allure HTML reports
- Test history tracking
- Flaky test detection
- Screenshot attachments
- Step-by-step logs

### Breaking Changes
- None (initial release)

### Known Issues
- None

### Migration Guide
- Not applicable (initial release)

---

## Version History

### [Unreleased] - 2026-08-08

#### Changed
- Bumped all dependencies to latest, including majors: `appium` 2→3, `appium-uiautomator2-driver` 3→8, `appium-xcuitest-driver` 7→12, `chai` 4→6, `eslint` 8→10, `dotenv` 16→17, `webdriverio`/`@wdio/*` → 9.29–9.30.x, plus `winston`, `prettier`, `husky`, `lint-staged`, `rimraf`, `allure-commandline`.
- Migrated the whole project from CommonJS to native ESM (`"type": "module"`) — required because `chai@6` dropped CommonJS support.
- Replaced `ts-node` with `tsx` as the TypeScript execution engine, per WebdriverIO 9's current documented recommendation.
- Migrated ESLint config from `.eslintrc.js` to flat config (`eslint.config.js`) — mandatory for ESLint 9+.
- `tsconfig.json`: `module` → `ESNext`, `moduleResolution` → `Bundler`.
- `BasePage.getAttribute()` now returns `string | null` to match WebdriverIO 9.30's more accurate typing.
- Bumped Node.js requirement to `^20.19.0 || ^22.12.0 || >=24.0.0` (CI, Dockerfile, setup scripts) to satisfy `appium@3`/`eslint@10` engine ranges.

#### Fixed
- `tests/specs/verification/framework.spec.ts` used `__dirname`, which is undefined under ESM — replaced with an `import.meta.url`-derived equivalent.
- Removed a dead `tsconfig-paths/register` mocha require (no path aliases were configured, and the package wasn't even a declared dependency).

#### Known limitations
- `typescript` is intentionally pinned to `^6.0.3`, not the newest `7.0.2` (the native-compiler rewrite), because `@typescript-eslint` v8.66's peer range (`>=4.8.4 <6.1.0`) doesn't support TS7 yet.
- `appium-doctor` stays at 1.16.2 — it's an unmaintained standalone tool predating Appium 2+'s built-in doctor tooling.

---

**Note**: This is the initial release of the Mobile Automation Framework. Future versions will include enhancements based on user feedback and evolving requirements.
