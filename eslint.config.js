// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'reports/**', '.husky/**', '.remember/**', '**/*.js'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.mocha,
        driver: 'readonly',
        $: 'readonly',
        $$: 'readonly',
        browser: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        should: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // src/types/global.d.ts intentionally declares empty interfaces as
      // WebdriverIO.Element/Browser augmentation extension points.
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
      '@typescript-eslint/no-require-imports': 'off',
      // TypeScript itself (tsc --noEmit) already catches genuine undefined-variable
      // bugs. ESLint's own scope analysis doesn't see ambient global namespaces
      // declared by third-party .d.ts files (WebdriverIO, Chai, ExpectWebdriverIO),
      // so no-undef produces false positives on those - the documented fix.
      'no-undef': 'off',
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    // Chai's BDD-style getter assertions (e.g. `expect(x).to.not.be.empty`) have no
    // call at the end, which looks like a no-op expression to ESLint.
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];
