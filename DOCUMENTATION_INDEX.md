# 📚 Documentation Index

Welcome to the Mobile Automation Framework documentation! This index will help you find what you need quickly.

## 🚀 Getting Started

### New to the Framework?
1. **[Quick Start Guide](QUICKSTART.md)** - Get running in 5 minutes
2. **[README](README.md)** - Complete framework documentation
3. **[Framework Summary](FRAMEWORK_SUMMARY.md)** - Overview of what's included

### Installation & Setup
- [Prerequisites](README.md#prerequisites)
- [Installation Steps](README.md#installation)
- [Environment Configuration](README.md#configuration)
- Setup Scripts:
  - [setup.sh](setup.sh) - For Mac/Linux
  - [setup.ps1](setup.ps1) - For Windows

## 📖 Core Documentation

### Framework Architecture
- [Project Structure](README.md#project-structure)
- [Configuration](README.md#configuration)
- [Page Object Model](README.md#writing-tests)

### Running Tests
- [Basic Test Execution](README.md#running-tests)
- [Platform-Specific Tests](README.md#run-platform-specific-tests)
- [Test Suites](README.md#run-specific-test-suites)
- [Parallel Execution](README.md#run-tests-in-parallel)

### Writing Tests
- [Page Object Example](README.md#page-object-example)
- [Test Spec Example](README.md#test-spec-example)
- [Using Custom Assertions](README.md#using-custom-assertions)
- [Using Gesture Helper](README.md#using-gesture-helper)

## 🔧 Technical Reference

### Code Organization
```
Framework Structure:
├── config/          - WebdriverIO configurations
├── src/
│   ├── pages/      - Page Object Models
│   └── types/      - TypeScript definitions
├── tests/
│   ├── specs/      - Test specifications
│   └── data/       - Test data and fixtures
└── utils/          - Helper utilities
```

### Key Files
- **Base Page**: [src/pages/BasePage.ts](src/pages/BasePage.ts)
- **Login Page**: [src/pages/LoginPage.ts](src/pages/LoginPage.ts)
- **Home Page**: [src/pages/HomePage.ts](src/pages/HomePage.ts)
- **Logger**: [utils/logger.ts](utils/logger.ts)
- **Assertions**: [utils/assertions.ts](utils/assertions.ts)
- **API Client**: [utils/apiClient.ts](utils/apiClient.ts)
- **Gesture Helper**: [utils/gestureHelper.ts](utils/gestureHelper.ts)
- **Helpers**: [utils/helpers.ts](utils/helpers.ts)

### Configuration Files
- **Base Config**: [config/wdio.conf.ts](config/wdio.conf.ts)
- **Android Config**: [config/wdio.android.conf.ts](config/wdio.android.conf.ts)
- **iOS Config**: [config/wdio.ios.conf.ts](config/wdio.ios.conf.ts)
- **TypeScript**: [tsconfig.json](tsconfig.json)
- **ESLint**: [eslint.config.js](eslint.config.js)
- **Prettier**: [.prettierrc](.prettierrc)

## 🧪 Test Examples

### Test Suites
- **Smoke Tests**: [tests/specs/smoke/login.spec.ts](tests/specs/smoke/login.spec.ts)
- **Regression Tests**: [tests/specs/regression/home.spec.ts](tests/specs/regression/home.spec.ts)
- **API Tests**: [tests/specs/api/api.spec.ts](tests/specs/api/api.spec.ts)

### Test Data
- **Test Fixtures**: [tests/data/testData.ts](tests/data/testData.ts)

## 📊 Reports & Logs

### Reporting
- [Allure Reports](README.md#allure-reports)
- [Report Features](README.md#report-features)

### Logging
- Log Location: `reports/logs/`
- Screenshot Location: `reports/screenshots/`
- Allure Results: `reports/allure-results/`

## 🔄 CI/CD

### GitHub Actions
- **Workflow File**: [.github/workflows/mobile-tests.yml](.github/workflows/mobile-tests.yml)
- [CI/CD Integration Guide](README.md#cicd-integration)
- [Trigger Tests](README.md#trigger-tests)

### Docker
- **Dockerfile**: [Dockerfile](Dockerfile)
- **Docker Compose**: [docker-compose.yml](docker-compose.yml)
- [Docker Usage Guide](README.md#docker)

## 🛠️ Troubleshooting

### Common Issues
- [Troubleshooting Guide](TROUBLESHOOTING.md)
  - [Installation Issues](TROUBLESHOOTING.md#installation-issues)
  - [Appium Issues](TROUBLESHOOTING.md#appium-issues)
  - [Android Issues](TROUBLESHOOTING.md#android-issues)
  - [iOS Issues](TROUBLESHOOTING.md#ios-issues)
  - [Test Execution Issues](TROUBLESHOOTING.md#test-execution-issues)
  - [CI/CD Issues](TROUBLESHOOTING.md#cicd-issues)
  - [Performance Issues](TROUBLESHOOTING.md#performance-issues)

### Debug Tips
- [Enable Debug Mode](TROUBLESHOOTING.md#getting-help)
- [View Logs](TROUBLESHOOTING.md#getting-help)

## 🤝 Contributing

### Development
- [Contributing Guide](CONTRIBUTING.md)
- [Development Workflow](CONTRIBUTING.md#development-workflow)
- [Coding Standards](CONTRIBUTING.md#coding-standards)
- [Testing Guidelines](CONTRIBUTING.md#testing-guidelines)
- [Commit Guidelines](CONTRIBUTING.md#commit-guidelines)

### GitHub
- [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md)
- [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)
- [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)

## 📋 Best Practices

### Coding Best Practices
- [Best Practices Guide](README.md#best-practices)
  - [Page Objects](README.md#1-page-objects)
  - [Test Organization](README.md#2-test-organization)
  - [Waits and Synchronization](README.md#3-waits-and-synchronization)
  - [Assertions](README.md#4-assertions)
  - [Data Management](README.md#5-data-management)

## 📦 Package Management

### Dependencies
- [package.json](package.json)
- [Installing Dependencies](README.md#installation)
- [Updating Dependencies](CONTRIBUTING.md#keep-your-fork-updated)

### Scripts
```bash
npm test              # Run all tests
npm run test:android  # Run Android tests
npm run test:ios      # Run iOS tests
npm run test:smoke    # Run smoke tests
npm run lint          # Run linting
npm run format        # Format code
npm run allure:report # Generate and open report
```

## 📄 Additional Resources

### Licenses & Legal
- [MIT License](LICENSE)
- [Changelog](CHANGELOG.md)

### External Documentation
- [WebdriverIO Docs](https://webdriver.io/)
- [Appium Docs](https://appium.io/)
- [Mocha Docs](https://mochajs.org/)
- [Chai Docs](https://www.chaijs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🔍 Quick Reference

### Environment Variables
```env
APPIUM_HOST=localhost
APPIUM_PORT=4723
ANDROID_APP_PATH=./apps/android/app-debug.apk
ANDROID_DEVICE_NAME=emulator-5554
LOG_LEVEL=info
```

### Common Commands
```bash
# Setup
npm install
npm run prepare

# Testing
npm test
npm run test:android
npm run test:smoke

# Reports
npm run allure:report

# Code Quality
npm run lint
npm run format

# Docker
docker-compose up
```

## 📞 Getting Help

### Support Channels
- **GitHub Issues**: [Create an Issue](https://github.com/your-org/webdriverio-mobile-typescript/issues)
- **Documentation**: This index and linked documents
- **Email**: automation-team@example.com
- **Slack**: #automation-team

### Before Asking for Help
1. Check [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Search [Existing Issues](https://github.com/your-org/webdriverio-mobile-typescript/issues)
3. Review [Documentation](README.md)
4. Enable [Debug Logging](TROUBLESHOOTING.md#getting-help)

## 🎓 Learning Path

### For Beginners
1. Read [Quick Start Guide](QUICKSTART.md)
2. Follow [Installation Steps](README.md#installation)
3. Run [Example Tests](tests/specs/)
4. Review [Page Object Examples](src/pages/)

### For Intermediate Users
1. Study [Framework Architecture](FRAMEWORK_SUMMARY.md)
2. Understand [Utilities](utils/)
3. Learn [Custom Assertions](utils/assertions.ts)
4. Explore [Gesture Helpers](utils/gestureHelper.ts)

### For Advanced Users
1. Review [CI/CD Setup](.github/workflows/mobile-tests.yml)
2. Customize [Configurations](config/)
3. Extend [Base Page](src/pages/BasePage.ts)
4. Contribute [New Features](CONTRIBUTING.md)

## 📊 Framework Statistics

- **Total Files**: 35+
- **Documentation Files**: 10+
- **Test Specs**: 3 suites
- **Page Objects**: 3
- **Utilities**: 5 modules
- **Configurations**: 3 files
- **Lines of Code**: 3,000+

---

## 🎯 Quick Navigation

| I want to... | Go to... |
|-------------|----------|
| Get started quickly | [Quick Start Guide](QUICKSTART.md) |
| Understand the framework | [README](README.md) |
| Fix an issue | [Troubleshooting](TROUBLESHOOTING.md) |
| Contribute code | [Contributing Guide](CONTRIBUTING.md) |
| Write tests | [Test Examples](tests/specs/) |
| Configure settings | [Configuration](config/) |
| View reports | `npm run allure:report` |
| Get help | [Support](#getting-help) |

---

**Last Updated**: October 2025  
**Framework Version**: 1.0.0  
**Status**: Production Ready ✅

Happy Testing! 🚀
