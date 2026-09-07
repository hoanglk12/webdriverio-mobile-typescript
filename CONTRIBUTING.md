# Contributing to Mobile Automation Framework

Thank you for your interest in contributing to our mobile automation framework! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Put the project's success first

## Getting Started

### 1. Fork the Repository

```bash
# Fork via GitHub UI, then clone your fork
git clone https://github.com/YOUR_USERNAME/webdriverio-mobile-typescript.git
cd webdriverio-mobile-typescript
```

### 2. Add Upstream Remote

```bash
git remote add upstream https://github.com/your-org/webdriverio-mobile-typescript.git
```

### 3. Install Dependencies

```bash
npm install
npm run prepare  # Install Husky hooks
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### 1. Keep Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing patterns
- Add tests for new features
- Update documentation

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Fix lint issues
npm run lint:fix

# Type check
npm run type-check

# Format code
npm run format

# Run tests
npm test
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to GitHub and create a PR
- Fill in the PR template
- Link related issues
- Wait for review

## Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Strong typing
async function login(username: string, password: string): Promise<void> {
  await this.setValue(this.usernameInput, username);
}

// ❌ Bad: Using any
async function login(username: any, password: any): Promise<any> {
  // ...
}
```

### Naming Conventions

```typescript
// Classes: PascalCase
class LoginPage extends BasePage {}

// Methods: camelCase
async clickLoginButton(): Promise<void> {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// Private members: prefix with underscore (optional)
private _internalState: string;
```

### File Organization

```typescript
// 1. Imports
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

// 2. Type definitions
interface LoginCredentials {
  username: string;
  password: string;
}

// 3. Class/exports
export class LoginPage extends BasePage {
  // Properties
  private credentials: LoginCredentials;

  // Constructor
  constructor() {
    super();
  }

  // Getters
  private get usernameInput() {
    return $('~username');
  }

  // Methods
  async login(username: string, password: string): Promise<void> {
    // Implementation
  }
}

// 4. Export
export default new LoginPage();
```

### Code Comments

```typescript
/**
 * Login to the application
 * @param username - User's email or username
 * @param password - User's password
 * @throws {Error} If login fails
 */
async login(username: string, password: string): Promise<void> {
  // Enter credentials
  await this.setValue(this.usernameInput, username);
  await this.setValue(this.passwordInput, password);

  // Submit form
  await this.click(this.loginButton);
}
```

### Error Handling

```typescript
// ✅ Good: Proper error handling
async clickElement(element: WebdriverIO.Element): Promise<void> {
  try {
    await element.waitForClickable({ timeout: 10000 });
    await element.click();
    logger.info('Element clicked successfully');
  } catch (error) {
    logger.error(`Failed to click element: ${error}`);
    throw new Error(`Element click failed: ${error.message}`);
  }
}

// ❌ Bad: Silent failure
async clickElement(element: WebdriverIO.Element): Promise<void> {
  try {
    await element.click();
  } catch (error) {
    // Swallowing error
  }
}
```

## Testing Guidelines

### Test Structure

```typescript
describe('Feature Name', () => {
  // Setup
  before(async () => {
    // Run once before all tests
  });

  beforeEach(async () => {
    // Run before each test
  });

  describe('Scenario Group', () => {
    it('should do something specific', async () => {
      // Arrange
      const testData = getTestData();

      // Act
      await performAction(testData);

      // Assert
      expect(result).to.equal(expectedValue);
    });
  });

  // Cleanup
  afterEach(async () => {
    // Run after each test
  });

  after(async () => {
    // Run once after all tests
  });
});
```

### Test Best Practices

1. **One Assertion Per Test** (when possible)
2. **Independent Tests** - No dependencies between tests
3. **Clear Test Names** - Describe what is being tested
4. **Use Test Data** - Externalize test data
5. **Clean Up** - Reset state after tests

### Page Object Best Practices

```typescript
// ✅ Good: Encapsulated selectors and actions
export class LoginPage extends BasePage {
  private get usernameInput() {
    return $('~username');
  }

  async enterUsername(username: string): Promise<void> {
    await this.setValue(this.usernameInput, username);
  }
}

// ❌ Bad: Exposing selectors
export class LoginPage {
  public usernameInput = $('~username');
}
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(login): add biometric authentication"

# Bug fix
git commit -m "fix(home): resolve product list loading issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(base-page): optimize wait methods"
```

## Pull Request Process

### 1. PR Title

Use the same format as commit messages:

```
feat(login): add remember me functionality
```

### 2. PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Related Issues

Closes #123
```

### 3. Review Process

1. **Automated Checks**: Must pass all CI/CD checks
2. **Code Review**: At least one approval required
3. **Testing**: Reviewer should test changes
4. **Merge**: Squash and merge (default)

### 4. After Merge

1. Delete your branch
2. Update your local main branch
3. Close related issues

## Additional Resources

- [WebdriverIO Documentation](https://webdriver.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)

## Questions?

- Open an issue for questions
- Join our Slack channel: #automation-team
- Email: automation-team@example.com

---

Thank you for contributing! 🎉
