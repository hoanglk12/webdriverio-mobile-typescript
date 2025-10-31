# Quick Start Guide

Get up and running with the Mobile Automation Framework in minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Java JDK 11+ installed
- [ ] Android SDK installed (for Android testing)
- [ ] Xcode installed (for iOS testing, macOS only)

## 5-Minute Setup

### 1. Install Dependencies (2 minutes)

```bash
# Clone repository
git clone https://github.com/your-org/webdriverio-mobile-typescript.git
cd webdriverio-mobile-typescript

# Install npm packages
npm install

# Install Appium and drivers
npm install -g appium@next
appium driver install uiautomator2
```

### 2. Configure Environment (1 minute)

```bash
# Copy environment file
cp .env.example .env

# Edit .env and set your app path
# For Android: ANDROID_APP_PATH=./apps/android/your-app.apk
# For iOS: IOS_APP_PATH=./apps/ios/your-app.app
```

### 3. Start Android Emulator (1 minute)

```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd <YOUR_AVD_NAME> &

# Verify device is connected
adb devices
```

### 4. Run Your First Test (1 minute)

```bash
# Run smoke tests
npm run test:smoke

# Or run all tests
npm test
```

## What's Next?

### View Test Reports

```bash
# Generate and open Allure report
npm run allure:report
```

### Run Platform-Specific Tests

```bash
# Android only
npm run test:android

# iOS only (macOS required)
npm run test:ios
```

### Run Specific Test Suites

```bash
# Smoke tests
npm run test:smoke

# Regression tests
npm run test:regression
```

## Common First-Time Issues

### Issue: Appium server not starting

```bash
# Kill existing Appium process
# Windows: taskkill /F /IM appium.exe
# Mac/Linux: killall node

# Restart Appium
appium
```

### Issue: App not found

```bash
# Verify app path in .env
cat .env | grep APP_PATH

# Check if file exists
ls -la ./apps/android/  # or ./apps/ios/
```

### Issue: Emulator not connecting

```bash
# Restart ADB
adb kill-server
adb start-server
adb devices
```

## Writing Your First Test

Create `tests/specs/my-first.spec.ts`:

```typescript
import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('My First Test', () => {
  it('should launch the app', async () => {
    // Get app package name (Android) or bundle ID (iOS)
    const appId = await driver.getCurrentPackage();
    
    // Verify app is running
    expect(appId).to.not.be.empty;
  });
});
```

Run it:

```bash
npx wdio run ./config/wdio.conf.ts --spec ./tests/specs/my-first.spec.ts
```

## Next Steps

1. **Read the full [README](README.md)** for detailed documentation
2. **Check out [example tests](tests/specs/)** for patterns
3. **Review [troubleshooting guide](TROUBLESHOOTING.md)** for common issues
4. **Join our community** on Slack: #automation-team

## Need Help?

- **Documentation**: Full README.md
- **Issues**: GitHub Issues
- **Slack**: #automation-team
- **Email**: automation-team@example.com

Happy Testing! 🚀
