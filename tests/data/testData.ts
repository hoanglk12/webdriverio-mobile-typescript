/**
 * Test data for valid user credentials
 */
export const validUsers = [
  {
    username: 'testuser1@example.com',
    password: 'Test@1234',
    displayName: 'Test User 1',
  },
  {
    username: 'testuser2@example.com',
    password: 'Test@5678',
    displayName: 'Test User 2',
  },
];

/**
 * Test data for invalid user credentials
 */
export const invalidUsers = [
  {
    username: 'invalid@example.com',
    password: 'wrongpassword',
    expectedError: 'Invalid credentials',
  },
  {
    username: '',
    password: 'Test@1234',
    expectedError: 'Username is required',
  },
  {
    username: 'testuser1@example.com',
    password: '',
    expectedError: 'Password is required',
  },
];

/**
 * Test data for products
 */
export const products = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description for Product 1',
    price: 99.99,
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description for Product 2',
    price: 149.99,
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'Description for Product 3',
    price: 199.99,
  },
];

/**
 * Test environment URLs
 */
export const environments = {
  dev: {
    apiUrl: 'https://api-dev.example.com',
    webUrl: 'https://dev.example.com',
  },
  staging: {
    apiUrl: 'https://api-staging.example.com',
    webUrl: 'https://staging.example.com',
  },
  prod: {
    apiUrl: 'https://api.example.com',
    webUrl: 'https://example.com',
  },
};

/**
 * Get environment configuration
 */
export function getEnvironment() {
  const env = process.env.NODE_ENV || 'dev';
  return environments[env as keyof typeof environments] || environments.dev;
}
