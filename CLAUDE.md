# webdriverio-mobile-typescript

Enterprise-style Mobile Automation Framework: WebdriverIO 9 + Appium 3 + Mocha + Chai 6 + TypeScript, driving Android (UiAutomator2) and iOS (XCUITest) apps. Page Object Model architecture, Allure reporting, Winston logging, Axios-based API testing. Currently a scaffold/template repo (placeholder org, placeholder `api.example.com`) — page objects and API tests target a demo app, not a specific shipped product yet.

## Runtime & tooling — always true here

- **ESM throughout.** `package.json` has `"type": "module"`. No CommonJS `require`/`module.exports` in source — use `import`/`export`. `__dirname`/`__filename` are not available; if a config needs a directory path, derive it from `import.meta.url`.
- **TypeScript is pinned `<6.1`** (currently `^6.0.3`) — deliberate, because `@typescript-eslint` doesn't yet support newer TS minors. Don't bump TypeScript past a typescript-eslint-supported range without checking `@typescript-eslint/eslint-plugin`'s peer range first.
- **`tsx`, not `ts-node`**, executes TS directly (`wdio run ./config/wdio.conf.ts` relies on this). Don't reintroduce `ts-node`.
- **ESLint 10 flat config** (`eslint.config.js`), not the legacy `.eslintrc`. Notable deliberate choices baked into it — don't "fix" these:
  - `no-undef: 'off'` for TS files — TypeScript's own compiler already catches real undefined-variable bugs; ESLint's scope analysis doesn't see ambient globals from WebdriverIO/Chai/ExpectWebdriverIO `.d.ts` files, so `no-undef` produces false positives there.
  - `driver`, `$`, `$$`, `browser`, `expect`, `assert`, `should` are declared as readonly globals (WebdriverIO/Chai ambient API).
  - `@typescript-eslint/no-empty-object-type` allows interfaces (`allowInterfaces: 'always'`) because `src/types/global.d.ts` intentionally declares empty interfaces as `WebdriverIO.Element`/`Browser` augmentation extension points.
  - `**/*.spec.ts` files disable `@typescript-eslint/no-unused-expressions` because Chai's BDD getter-style assertions (e.g. `expect(x).to.not.be.empty`) have no trailing call and otherwise look like no-op expressions.
- **Node engines**: `^20.19.0 || ^22.12.0 || >=24.0.0` (required by Appium 3 / ESLint 10). npm `>=10.0.0`.
- **dotenv loads with `quiet: true`** in the wdio configs — don't remove that option, it suppresses dotenv's noisy startup banner in CI logs.
- **`tsconfig.json`**: `target`/`lib` ES2022, `module: ESNext`, `moduleResolution: Bundler`, `strict: true` (but `strictPropertyInitialization: false`, deliberately — page object getters/lazy fields don't need constructor-time initialization).

## Project structure

- `src/pages/` — Page Object Model classes. `BasePage` (abstract) → `LoginPage`, `HomePage`. Every page exports a singleton instance (`export default new LoginPage()`), not the class.
- `src/types/` — ambient `.d.ts` (`global.d.ts`, `wdio.d.ts`) augmenting WebdriverIO/Chai globals; referenced via `typeRoots` in `tsconfig.json`.
- `tests/specs/<suite>/` — specs grouped by suite: `smoke`, `regression`, `api`, `verification`. Suite folder membership is what `test:smoke`/`test:regression` filter on.
- `tests/data/` — shared fixtures (`testData.ts`).
- `utils/` — `apiClient.ts` (Axios wrapper), `assertions.ts` (custom Chai-style mobile assertions), `gestureHelper.ts` (swipe/scroll/pinch/tap), `logger.ts` (Winston), `helpers.ts`.
- `config/` — `wdio.conf.ts` (base), `wdio.android.conf.ts`, `wdio.ios.conf.ts` (platform-specific capability overrides).
- `reports/` — generated output only (`allure-results`, `allure-report`, `screenshots`, `logs`). Never hand-edit.

## npm scripts

| Script | Purpose |
|---|---|
| `test` / `test:android` / `test:ios` | Run the base / Android / iOS wdio config |
| `test:smoke` / `test:regression` | Filter to one suite |
| `test:parallel` | Run all specs via glob |
| `test:verify` | `type-check` + `lint` gate (no test execution) |
| `verify` | Runs `verify-framework.ps1` (fuller environment sanity check) |
| `lint` / `lint:fix` | ESLint |
| `format` / `format:check` | Prettier |
| `type-check` | `tsc --noEmit` |
| `allure:generate` / `allure:open` / `allure:report` | Allure reporting from `reports/allure-results` |
| `appium` / `appium:doctor` | Run local Appium server / doctor diagnostics |

## Related project-level skills

See `.claude/skills/` for step-by-step procedures on: authoring a Page Object + spec (`mobile-page-object-authoring`), running the suite locally (`running-mobile-tests-appium`), writing API tests (`api-test-authoring`), debugging the GitHub Actions pipeline (`ci-release-triage`), and triaging a failing Appium run interactively via the `appium-mcp` MCP server (`appium-failure-triage`, registered in `.mcp.json`).
