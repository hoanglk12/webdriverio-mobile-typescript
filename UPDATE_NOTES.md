# Update Notes

## 2026-08-08 - Major Dependency Update + ESM Migration

All dependencies were updated to their latest stable versions, including several majors. Because `chai@6` dropped CommonJS support, this required migrating the whole project to native ESM.

### Key Updates

#### Appium
- Updated from v2.13.1 to **v3.6.0**
- UiAutomator2 driver: v3.8.5 → **v8.2.2**
- XCUITest driver: v7.32.1 → **v12.3.0**
- Requires Node.js `^20.19.0 || ^22.12.0 || >=24.0.0` (bumped in CI/Dockerfile/setup scripts, previously Node 18)

#### WebdriverIO
- All `@wdio/*` packages and `webdriverio` itself updated to **v9.29-9.30.x**

#### TypeScript & Linting
- ESLint: v8.57.1 → **v10.8.1**, migrated `.eslintrc.js` → flat config (`eslint.config.js`) - mandatory for ESLint 9+
- @typescript-eslint packages: v8.11.0 → **v8.66.0**
- TypeScript: v5.6.3 → **v6.0.3** (intentionally *not* the newest v7.0.2 - see Known Limitations below)
- `ts-node` replaced with **`tsx`**, WebdriverIO 9's current documented TypeScript runner

#### Other Updates
- chai: v4.5.0 → **v6.2.2**
- dotenv: v16.4.5 → **v17.4.2** (now defaults to logging on every load; silenced with `{ quiet: true }`)
- winston: v3.17.0 → **v3.19.0**
- axios: v1.7.7 → **v1.19.0**
- rimraf: v6.0.1 → **v6.1.3**
- husky: v9.1.6 → **v9.1.7**
- lint-staged: v15.2.10 → **v17.3.0**
- prettier: v3.3.3 → **v3.9.6**
- allure-commandline: v2.32.0 → **v2.43.0**

### Breaking Changes

#### ESM Migration
`package.json` now sets `"type": "module"`. This was required because `chai@6` is ESM-only. Along with it:
- `tsconfig.json`: `module` → `ESNext`, `moduleResolution` → `Bundler`
- `ts-node` config block removed from `tsconfig.json` (no longer used)
- `tests/specs/verification/framework.spec.ts` no longer uses `__dirname` (undefined under ESM) - replaced with an `import.meta.url`-derived equivalent
- A dead `tsconfig-paths/register` mocha require was removed (no path aliases were ever configured, and the package wasn't a declared dependency to begin with)

#### ESLint Flat Config
`.eslintrc.js` is gone. All rules now live in `eslint.config.js`. Notably, `no-undef` is explicitly turned off for `.ts` files - `tsc --noEmit` already catches genuine undefined-variable bugs, and ESLint's own scope analysis doesn't resolve ambient global namespaces declared by third-party `.d.ts` files (`WebdriverIO`, `Chai`, `ExpectWebdriverIO`), which otherwise produces false positives.

#### Type Fallout
- `BasePage.getAttribute()` now returns `Promise<string | null>` (was `Promise<string>`) to match WebdriverIO 9.30's more accurate typing of `element.getAttribute()`.

### Known Limitations
- **TypeScript is pinned to `^6.0.3`, not `7.0.2`.** TypeScript 7 is the new native-compiler rewrite; `@typescript-eslint` v8.66's peer range (`>=4.8.4 <6.1.0`) doesn't support it yet. Re-check this pin once typescript-eslint adds TS7 support.
- `appium-uiautomator2-driver`/`appium-xcuitest-driver` versions in `package.json` are largely cosmetic - actual driver installation/versioning happens via `appium driver install` (~/.appium), not npm resolution.
- `appium-doctor` stays at v1.16.2 - it's an unmaintained standalone tool predating Appium 2+'s built-in doctor tooling.
- `npm audit` reports 16 vulnerabilities, all inside Appium's own dev-only transitive dependency tree (`uuid`, `mocha`); production dependencies have 0. No non-breaking fix is currently available upstream.

### Verification Performed
- `npm run type-check` - clean
- `npm run lint` - 0 errors (pre-existing `no-explicit-any` warnings unchanged)
- Runtime ESM smoke test (`tsx` script exercising `type:module` + chai 6 + winston + dynamic page-object imports) - passed
- All three `wdio.*.conf.ts` files load correctly under the new toolchain

Actual device/emulator test runs were **not** performed as part of this update - verify with `npm test` against a connected emulator/simulator before relying on this in CI.

---

## 2025-10-27 - Dependency Refresh

## Dependency Updates Applied

The framework has been updated to use the latest stable versions of all dependencies to resolve deprecation warnings.

### Key Updates

#### WebdriverIO
- Updated from v8.27.0 to **v9.2.3**
- All WDIO packages updated to latest stable version

#### Appium
- Updated from v2.4.1 to **v2.13.1**
- UiAutomator2 driver: v2.41.1 → **v3.8.5**
- XCUITest driver: v5.12.2 → **v7.32.1**

#### TypeScript & Linting
- TypeScript: v5.3.3 → **v5.6.3**
- ESLint: v8.56.0 → **v9.14.0** (with compatibility config)
- @typescript-eslint packages: v6.x → **v8.11.0**

#### Other Updates
- Node types: v20.x → **v22.x**
- Winston: v3.11.0 → **v3.17.0**
- Axios: v1.6.5 → **v1.7.7**
- Rimraf: v5.0.5 → **v6.0.1**
- Husky: v8.0.3 → **v9.1.6**

## Installation

To apply these updates, run:

```powershell
# Clean install
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

## Breaking Changes

### ESLint Configuration
ESLint 9.x uses a new flat config format, but we've maintained backward compatibility using the traditional .eslintrc.js format. The configuration has been adjusted to work with both versions.

### Global Types
The framework now explicitly declares WebdriverIO globals (`driver`, `$`, `$$`, etc.) in the ESLint configuration, reducing type errors during development.

## Deprecation Warnings Resolved

The following deprecation warnings have been resolved:
- ✅ `@humanwhocodes/config-array` → Using ESLint built-in configs
- ✅ `glob` v7/v8 → Updated to packages using glob v9+
- ✅ `rimraf` v3/v5 → Updated to v6
- ✅ `eslint` v8 → Updated to v9
- ✅ Various deprecated utility packages

## Remaining Expected Warnings

Some warnings may still appear but are safe to ignore:
- Package deprecation notices from transitive dependencies (not directly used)
- Peer dependency warnings (versions are compatible)

## Testing the Updates

After updating, verify everything works:

```powershell
# Type check
npm run type-check

# Lint code
npm run lint

# Run tests (with emulator/simulator running)
npm test
```

## Rollback Instructions

If you encounter issues, you can rollback by checking out the previous package.json:

```powershell
git checkout HEAD~1 package.json .eslintrc.js
npm install
```

## Notes

- All updates maintain backward compatibility
- No changes required to test code
- Configuration files updated to support new versions
- Framework functionality remains unchanged

---

**Updated**: October 27, 2025  
**Status**: ✅ Ready to use
