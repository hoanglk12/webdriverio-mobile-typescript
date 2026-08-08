# Mobile Automation Framework

[![CI/CD](https://github.com/your-org/webdriverio-mobile-typescript/actions/workflows/mobile-tests.yml/badge.svg)](https://github.com/your-org/webdriverio-mobile-typescript/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Enterprise-grade Mobile Automation Framework** built with WebdriverIO v9, Mocha, Chai, and TypeScript (native ESM) for Android and iOS testing.

## 🚀 Features

- ✅ **WebdriverIO v9+** - Latest automation driver with full TypeScript support
- ✅ **Mocha Framework** - Flexible BDD/TDD test framework
- ✅ **Chai Assertions** - Fluent assertion library with custom mobile assertions
- ✅ **TypeScript** - Type safety and enhanced IDE support
- ✅ **Page Object Model** - Maintainable and scalable test architecture
- ✅ **Allure Reports** - Beautiful and comprehensive test reports
- ✅ **Parallel Execution** - Run tests in parallel for faster feedback
- ✅ **Cross-Platform** - Support for both Android and iOS
- ✅ **CI/CD Ready** - GitHub Actions workflows included
- ✅ **Docker Support** - Containerized test execution
- ✅ **API Testing** - Integrated API testing capabilities
- ✅ **Screenshot & Video** - Automatic capture on failures
- ✅ **ESLint & Prettier** - Code quality and formatting
- ✅ **Husky Hooks** - Pre-commit validation

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Reports](#reports)
- [CI/CD Integration](#cicd-integration)
- [Docker](#docker)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Contributing](#contributing)

## 🔧 Prerequisites

### Required Software

- **Node.js** `^20.19.0 || ^22.12.0 || >=24.0.0` (required by appium@3 / eslint@10)
- **npm** >= 10.0.0
- **Java JDK** >= 11 (for Appium)
- **Appium** >= 3.0.0

### For Android Testing

- **Android Studio** or **Android SDK**
- **Android Emulator** or **Real Device**
- Environment variables:
  - `ANDROID_HOME` - Path to Android SDK
  - Add `platform-tools` and `emulator` to PATH

### For iOS Testing (macOS only)

- **Xcode** >= 14.0
- **Xcode Command Line Tools**
- **iOS Simulator** or **Real Device**
- **carthage** (optional, for WebDriverAgent)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/webdriverio-mobile-typescript.git
cd webdriverio-mobile-typescript
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Appium

```bash
# Install Appium globally
npm install -g appium

# Install drivers
appium driver install uiautomator2  # For Android
appium driver install xcuitest      # For iOS

# Verify installation
appium driver list
```

### 4. Verify Setup

```bash
# Check Appium Doctor for Android
npx appium-doctor --android

# Check Appium Doctor for iOS (macOS only)
npx appium-doctor --ios
```

### 5. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# Update app paths, device names, etc.
```

## 📁 Project Structure

```
webdriverio-mobile-typescript/
├── .github/
│   └── workflows/
│       └── mobile-tests.yml      # GitHub Actions workflow
├── config/
│   ├── wdio.conf.ts              # Base WebdriverIO configuration
│   ├── wdio.android.conf.ts      # Android-specific configuration
│   └── wdio.ios.conf.ts          # iOS-specific configuration
├── src/
│   ├── pages/
│   │   ├── BasePage.ts           # Base page with common methods
│   │   ├── LoginPage.ts          # Login page object
│   │   └── HomePage.ts           # Home page object
│   └── types/
│       └── global.d.ts           # TypeScript type definitions
├── tests/
│   ├── specs/
│   │   ├── smoke/                # Smoke test suite
│   │   │   └── login.spec.ts
│   │   ├── regression/           # Regression test suite
│   │   │   └── home.spec.ts
│   │   └── api/                  # API test suite
│   │       └── api.spec.ts
│   └── data/
│       └── testData.ts           # Test data and fixtures
├── utils/
│   ├── logger.ts                 # Winston logger configuration
│   ├── helpers.ts                # Utility helper functions
│   ├── assertions.ts             # Custom assertion methods
│   ├── apiClient.ts              # API testing client
│   └── gestureHelper.ts          # Mobile gesture utilities
├── reports/                      # Test reports (auto-generated)
│   ├── allure-results/
│   ├── allure-report/
│   ├── screenshots/
│   └── logs/
├── apps/                         # Mobile app binaries
│   ├── android/
│   └── ios/
├── eslint.config.js              # ESLint configuration (flat config)
├── .prettierrc                   # Prettier configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Node.js dependencies
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose setup
└── README.md                     # This file
```

## ⚙️ Configuration

### Environment Variables

Edit `.env` file with your configuration:

```env
# Appium Server
APPIUM_HOST=localhost
APPIUM_PORT=4723

# Android Configuration
ANDROID_APP_PATH=./apps/android/app-debug.apk
ANDROID_DEVICE_NAME=emulator-5554
ANDROID_PLATFORM_VERSION=13.0

# iOS Configuration
IOS_APP_PATH=./apps/ios/app.app
IOS_DEVICE_NAME=iPhone 14 Pro
IOS_PLATFORM_VERSION=16.0

# Test Configuration
DEFAULT_TIMEOUT=30000
LOG_LEVEL=info
MAX_INSTANCES=2
```

### WebdriverIO Configuration

The framework uses three configuration files:

1. **wdio.conf.ts** - Base configuration with common settings
2. **wdio.android.conf.ts** - Android-specific capabilities
3. **wdio.ios.conf.ts** - iOS-specific capabilities

## 🎯 Running Tests

### Start Appium Server

```bash
# Option 1: Start Appium manually
appium

# Option 2: Let WebdriverIO start Appium automatically
# (configured in wdio.conf.ts services)
```

### Run All Tests

```bash
npm test
```

### Run Platform-Specific Tests

```bash
# Android tests
npm run test:android

# iOS tests
npm run test:ios
```

### Run Specific Test Suites

```bash
# Smoke tests
npm run test:smoke

# Regression tests
npm run test:regression
```

### Run Tests in Parallel

```bash
npm run test:parallel
```

### Run Specific Test File

```bash
npx wdio run ./config/wdio.conf.ts --spec ./tests/specs/smoke/login.spec.ts
```

## 📝 Writing Tests

### Page Object Example

```typescript
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private get usernameInput() {
    return $('~username-input');
  }

  private get passwordInput() {
    return $('~password-input');
  }

  private get loginButton() {
    return $('~login-button');
  }

  async login(username: string, password: string): Promise<void> {
    await this.setValue(this.usernameInput, username);
    await this.setValue(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}

export default new LoginPage();
```

### Test Spec Example

```typescript
import { describe, it } from 'mocha';
import { expect } from 'chai';
import LoginPage from '../../src/pages/LoginPage';
import { validUsers } from '../data/testData';

describe('Login Feature', () => {
  it('should login successfully', async () => {
    const user = validUsers[0];
    
    await LoginPage.waitForLoginPage();
    await LoginPage.login(user.username, user.password);
    
    // Assertions
    const isHomeDisplayed = await HomePage.isHomePageDisplayed();
    expect(isHomeDisplayed).to.be.true;
  });
});
```

### Using Custom Assertions

```typescript
import { Assertions } from '../../utils/assertions';

// Assert element is displayed
await Assertions.assertDisplayed(element, 'Custom error message');

// Assert text equals
await Assertions.assertTextEquals(element, 'Expected Text');

// Assert text contains
await Assertions.assertTextContains(element, 'Partial Text');
```

### Using Gesture Helper

```typescript
import { GestureHelper } from '../../utils/gestureHelper';

// Swipe vertically
await GestureHelper.swipeVertical(80, 20);

// Swipe horizontally
await GestureHelper.swipeHorizontal(80, 20);

// Scroll to element
await GestureHelper.scrollToElement(element);

// Long press
await GestureHelper.longPress(element, 2000);
```

## 📊 Reports

### Allure Reports

Generate and view Allure reports:

```bash
# Generate report
npm run allure:generate

# Open report in browser
npm run allure:open

# Generate and open in one command
npm run allure:report
```

### Report Features

- ✅ Test execution history
- ✅ Test case categorization
- ✅ Screenshots on failures
- ✅ Step-by-step execution logs
- ✅ Trends and statistics
- ✅ Environment information
- ✅ Flaky test detection

## 🔄 CI/CD Integration

### GitHub Actions

The framework includes a comprehensive GitHub Actions workflow:

- **Lint and Type Check** - Code quality validation
- **Android Tests** - Automated Android emulator tests
- **iOS Tests** - Automated iOS simulator tests
- **Allure Reports** - Published to GitHub Pages
- **Notifications** - Slack integration

### Trigger Tests

```bash
# Push to main/develop branch
git push origin main

# Manual trigger via GitHub UI
# Actions → Mobile Automation Tests → Run workflow
```

### View Results

- **GitHub Actions**: Check workflow runs
- **Allure Report**: https://your-org.github.io/webdriverio-mobile-typescript/

## 🐳 Docker

### Build Docker Image

```bash
docker build -t mobile-automation .
```

### Run Tests in Docker

```bash
# Using Docker Compose
docker-compose up

# Using Docker directly
docker run --rm mobile-automation npm run test:android
```

### Docker Compose Features

- Android emulator service
- Test runner service
- VNC access to emulator (port 6080)
- Volume mounting for reports

## 🔍 Troubleshooting

### Common Issues

#### 1. Appium Server Not Starting

```bash
# Check if port 4723 is in use
lsof -i :4723

# Kill process using the port
kill -9 <PID>

# Restart Appium
appium
```

#### 2. Android Emulator Not Found

```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd <AVD_NAME>

# Check ADB devices
adb devices
```

#### 3. iOS Simulator Issues

```bash
# List available simulators
xcrun simctl list devices

# Boot simulator
xcrun simctl boot <DEVICE_UUID>

# Reset simulator
xcrun simctl erase <DEVICE_UUID>
```

#### 4. TypeScript Compilation Errors

```bash
# Clean and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install

# Type check
npm run type-check
```

#### 5. Test Timeout Issues

- Increase timeout in `wdio.conf.ts`:
  ```typescript
  mochaOpts: {
    timeout: 120000  // 2 minutes
  }
  ```

### Debug Mode

Enable debug logging:

```bash
# Set log level to debug
export LOG_LEVEL=debug

# Run tests with verbose output
npm test -- --logLevel=debug
```

## 💡 Best Practices

### 1. Page Objects

- Keep page objects focused on a single page/screen
- Use private getters for selectors
- Public methods for user actions
- Return relevant data when needed

### 2. Test Organization

- Group related tests using `describe` blocks
- Use meaningful test descriptions
- Keep tests independent and isolated
- Clean up test data after each test

### 3. Waits and Synchronization

- Always use explicit waits, not hard-coded sleeps
- Wait for elements before interaction
- Use custom wait conditions when needed

### 4. Assertions

- Use descriptive assertion messages
- Assert one thing per test when possible
- Use custom assertions for clarity

### 5. Data Management

- Externalize test data
- Use data-driven testing for multiple scenarios
- Keep sensitive data in environment variables

## 🤝 Contributing

### Setup Development Environment

```bash
# Install dependencies
npm install

# Install Husky hooks
npm run prepare
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Commit Guidelines

- Use conventional commits format
- Pre-commit hooks run automatically
- All checks must pass before commit

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Add/update tests
4. Ensure all tests pass
5. Update documentation
6. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Team** - Initial work

## 🙏 Acknowledgments

- [WebdriverIO](https://webdriver.io/)
- [Appium](https://appium.io/)
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)
- [Allure Report](https://docs.qameta.io/allure/)

## 📞 Support

For issues, questions, or contributions:

- **GitHub Issues**: https://github.com/your-org/webdriverio-mobile-typescript/issues
- **Documentation**: https://github.com/your-org/webdriverio-mobile-typescript/wiki
- **Email**: automation-team@example.com

---

**Built with ❤️ by the Automation Team**
