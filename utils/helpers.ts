/**
 * Wait for a condition to be true
 * @param condition - Function that returns a boolean or promise of boolean
 * @param timeout - Timeout in milliseconds
 * @param interval - Interval to check condition in milliseconds
 * @returns True if condition met
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 10000,
  interval: number = 500
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      if (await condition()) {
        return true;
      }
    } catch (error) {
      // Continue waiting if condition throws error
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Retry an action multiple times
 * @param action - Action to retry
 * @param retries - Number of retries
 * @param delay - Delay between retries in milliseconds
 */
export async function retry<T>(
  action: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i <= retries; i++) {
    try {
      return await action();
    } catch (err) {
      lastError = err as Error;
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Generate random string
 * @param length - Length of string
 * @returns Random string
 */
export function randomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate random email
 * @param domain - Email domain
 * @returns Random email
 */
export function randomEmail(domain: string = 'test.com'): string {
  return `test_${randomString(8)}@${domain}`;
}

/**
 * Generate random number between min and max
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 */
export function randomNumber(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Format date to string
 * @param date - Date object
 * @param format - Format string (YYYY-MM-DD, DD/MM/YYYY, etc.)
 * @returns Formatted date string
 */
export function formatDate(date: Date = new Date(), format: string = 'YYYY-MM-DD'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * Deep clone an object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Sleep for specified milliseconds
 * @param ms - Milliseconds to sleep
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get timestamp string
 * @returns Timestamp string
 */
export function getTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Sanitize string for file name
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeFileName(str: string): string {
  return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}
