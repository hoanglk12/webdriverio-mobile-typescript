# Troubleshooting Guide

Common issues and solutions for the Mobile Automation Framework.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Appium Issues](#appium-issues)
- [Android Issues](#android-issues)
- [iOS Issues](#ios-issues)
- [Test Execution Issues](#test-execution-issues)
- [CI/CD Issues](#cicd-issues)
- [Performance Issues](#performance-issues)

## Installation Issues

### Node.js Version Mismatch

**Problem**: Tests fail with Node.js compatibility errors

**Solution**:

```bash
# Check Node version
node --version

# Should satisfy: ^20.19.0 || ^22.12.0 || >=24.0.0 (required by appium@3 / eslint@10)
# Install correct version using nvm
nvm install 22
nvm use 22
```

### npm Install Fails

**Problem**: Dependencies fail to install

**Solution**:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Husky Hooks Not Working

**Problem**: Pre-commit hooks don't run

**Solution**:

```bash
# Reinstall Husky
npm run prepare

# Check git hooks
ls -la .git/hooks/

# Manual hook setup if needed
npx husky install
```

## Appium Issues

### Appium Server Won't Start

**Problem**: Appium server fails to start on port 4723

**Solution**:

```bash
# Check if port is in use
# Windows
netstat -ano | findstr :4723

# macOS/Linux
lsof -i :4723

# Kill process using the port
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>

# Restart Appium
appium
```

### Driver Not Installed

**Problem**: `Error: No driver found for automationName 'UiAutomator2'`

**Solution**:

```bash
# List installed drivers
appium driver list

# Install missing driver
appium driver install uiautomator2  # Android
appium driver install xcuitest      # iOS

# Update driver
appium driver update uiautomator2
```

### Appium Doctor Errors

**Problem**: `appium-doctor` shows missing dependencies

**Solution**:

```bash
# Run doctor for Android
npx appium-doctor --android

# Run doctor for iOS
npx appium-doctor --ios

# Common fixes:

# 1. ANDROID_HOME not set
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator

# 2. Java not found
# Install JDK 11 or higher
# Add JAVA_HOME to environment

# 3. Xcode not configured (iOS)
sudo xcode-select --switch /Applications/Xcode.app
```

## Android Issues

### Emulator Not Found

**Problem**: `Error: Could not find a connected Android device`

**Solution**:

```bash
# List available AVDs
emulator -list-avds

# Start emulator
emulator -avd <AVD_NAME>

# Check connected devices
adb devices

# If device offline, restart ADB
adb kill-server
adb start-server
```

### App Installation Fails

**Problem**: App fails to install on Android device/emulator

**Solution**:

```bash
# Verify APK exists
ls -la ./apps/android/app-debug.apk

# Manual install test
adb install ./apps/android/app-debug.apk

# Check device storage
adb shell df

# Uninstall existing app
adb uninstall com.example.app

# Clear app data
adb shell pm clear com.example.app
```

### UiAutomator2 Server Issues

**Problem**: `Error: UiAutomator2 server not responding`

**Solution**:

```bash
# Clear UiAutomator2 server
adb shell pm clear io.appium.uiautomator2.server
adb shell pm clear io.appium.uiautomator2.server.test

# Reinstall UiAutomator2
appium driver uninstall uiautomator2
appium driver install uiautomator2

# Restart device
adb reboot
```

### Slow Emulator

**Problem**: Android emulator runs very slowly

**Solution**:

```bash
# Enable hardware acceleration
# Add to AVD config:
# - Graphics: Hardware - GLES 2.0
# - Boot option: Cold boot

# Start with more RAM
emulator -avd <AVD_NAME> -memory 2048

# Use x86_64 image instead of ARM
# Create new AVD with x86_64 system image
```

## iOS Issues

### Simulator Not Booting

**Problem**: iOS simulator fails to boot

**Solution**:

```bash
# List available simulators
xcrun simctl list devices

# Delete and recreate simulator
xcrun simctl delete <DEVICE_UUID>
xcrun simctl create "iPhone 14 Pro" com.apple.CoreSimulator.SimDeviceType.iPhone-14-Pro com.apple.CoreSimulator.SimRuntime.iOS-16-0

# Reset simulator
xcrun simctl erase all

# Shutdown all simulators
xcrun simctl shutdown all
```

### WebDriverAgent Build Fails

**Problem**: XCUITest fails with WebDriverAgent errors

**Solution**:

```bash
# Rebuild WebDriverAgent
cd ~/.appium/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent
xcodebuild clean build -project WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner -destination 'platform=iOS Simulator,name=iPhone 14 Pro'

# Update signing settings in Xcode
open WebDriverAgent.xcodeproj

# Select a development team
# Build again
```

### App Not Found

**Problem**: `Error: App '/path/to/app.app' doesn't exist`

**Solution**:

```bash
# For .app bundles
# Verify path is correct
ls -la ./apps/ios/

# Build app for simulator
xcodebuild -project YourApp.xcodeproj -scheme YourApp -sdk iphonesimulator -configuration Debug

# App should be in:
# ./build/Debug-iphonesimulator/YourApp.app
```

### Xcode Version Issues

**Problem**: Tests fail with Xcode compatibility errors

**Solution**:

```bash
# Check Xcode version
xcodebuild -version

# List installed Xcode versions
ls /Applications | grep Xcode

# Switch Xcode version
sudo xcode-select --switch /Applications/Xcode.app

# Install command line tools
xcode-select --install
```

## Test Execution Issues

### Element Not Found

**Problem**: `Error: Element could not be located`

**Solutions**:

1. **Increase wait timeout**:

```typescript
await element.waitForDisplayed({ timeout: 30000 });
```

2. **Verify selector**:

```typescript
// Try different selector strategies
$('~accessibility-id');
$('id=resource-id');
$('android=new UiSelector().text("Login")');
$('-ios class chain:**/XCUIElementTypeButton[`label == "Login"`]');
```

3. **Check element hierarchy**:

```bash
# Get page source
await driver.getPageSource()
```

### Timeout Errors

**Problem**: Tests timeout frequently

**Solution**:

```typescript
// Increase default timeout in wdio.conf.ts
mochaOpts: {
  timeout: 120000; // 2 minutes
}

// Or per-test basis
it('long running test', async function () {
  this.timeout(180000); // 3 minutes
  // test code
});
```

### Flaky Tests

**Problem**: Tests pass/fail intermittently

**Solutions**:

1. **Add explicit waits**:

```typescript
// ❌ Bad
await element.click();

// ✅ Good
await element.waitForClickable({ timeout: 10000 });
await element.click();
```

2. **Wait for animations**:

```typescript
await driver.pause(500); // Wait for animations
```

3. **Retry failed tests**:

```typescript
// In wdio.conf.ts
mochaOpts: {
  retries: 2; // Retry failed tests twice
}
```

### Screenshot Not Captured

**Problem**: Screenshots not saved on failure

**Solution**:

```bash
# Create screenshots directory
mkdir -p reports/screenshots

# Check permissions
chmod 755 reports/screenshots

# Verify path in .env
SCREENSHOT_DIR=./reports/screenshots
```

## CI/CD Issues

### GitHub Actions Failing

**Problem**: Tests pass locally but fail in CI

**Solutions**:

1. **Check environment variables**:

```yaml
# Add to workflow
env:
  ANDROID_APP_PATH: ./apps/android/app-debug.apk
  LOG_LEVEL: debug
```

2. **Enable debug logging**:

```yaml
- name: Run tests
  run: npm test -- --logLevel=debug
```

3. **Upload artifacts**:

```yaml
- name: Upload logs
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: test-logs
    path: reports/logs
```

### Docker Issues

**Problem**: Tests fail in Docker container

**Solution**:

```bash
# Check container logs
docker-compose logs -f test-runner

# Access container shell
docker-compose exec test-runner sh

# Rebuild image
docker-compose build --no-cache

# Clean up
docker-compose down -v
docker system prune -a
```

## Performance Issues

### Slow Test Execution

**Solutions**:

1. **Enable parallel execution**:

```typescript
// wdio.conf.ts
maxInstances: 4;
```

2. **Reduce logging**:

```typescript
logLevel: 'error'; // Instead of 'debug'
```

3. **Optimize waits**:

```typescript
// Use shorter implicit wait
await driver.setImplicitTimeout(3000);
```

### Memory Issues

**Problem**: Out of memory errors

**Solution**:

```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Or in package.json script
"test": "NODE_OPTIONS=--max-old-space-size=4096 wdio run ./config/wdio.conf.ts"
```

## Getting Help

If you can't resolve your issue:

1. **Check logs**:

```bash
tail -f reports/logs/test-execution.log
```

2. **Enable debug mode**:

```bash
export LOG_LEVEL=debug
npm test
```

3. **Search existing issues**:
   https://github.com/your-org/webdriverio-mobile-typescript/issues

4. **Create new issue** with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Logs

5. **Contact team**:
   - Slack: #automation-team
   - Email: automation-team@example.com

---

**Last Updated**: October 2025
