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
 * FrontRow app fixtures (Events / home screen).
 *
 * Filter chips are identified by their testID slug (Android `resource-id`,
 * e.g. `events.filterChip.indie-rock`). Verified live against the QA build
 * app.frontrow.qa.
 *
 * On a fresh, SIGNED-OUT launch (SMK-01's precondition) the row renders
 * exactly these five chips, all on-screen — matching the test-case doc.
 * The `favorites` chip is auth-gated: it appears only when signed in, and
 * signing in also brings additional `j-pop` / `punk` chips into the
 * horizontally scrollable row. None of those are present signed out.
 */
export const frontRow = {
  /** Filter chips on a fresh signed-out launch, in display order (testID slugs). */
  filterChipSlugs: ['all', 'indie-rock', 'classical', 'electronic', 'folk'],

  /** Bottom tab bar entries, in display order (testID slugs, `tab.<slug>`). */
  bottomNavTabSlugs: ['events', 'myTickets', 'profile', 'debug'],

  /**
   * SMK-03 search fixture: a query that matches exactly one seeded event
   * (`events.item.evt_005`, title "Zenith Tour — Tokyo Night One"), plus a
   * nonsense term (shared with SMK-04) used as a negative control to prove
   * the search is actually filtering rather than leaving the list untouched.
   */
  search: {
    term: 'Tokyo',
    expectedEventTitle: 'Zenith Tour — Tokyo Night One',
    nonMatchingTerm: 'zzzznoresults',
  },
};

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
