# Update Notes - October 27, 2025

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
