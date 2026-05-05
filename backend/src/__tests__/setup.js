/**
 * Jest Setup File
 *
 * Configures test environment before running tests:
 * - Database connections
 * - Mock setup
 * - Environment variables
 * - Custom matchers
 */

const path = require('path');

// Load test environment variables
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'dispatchcore_test';

// Suppress console output in tests unless explicitly needed
global.console = {
  ...console,
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Global test timeout
jest.setTimeout(10000);

// Custom matchers
expect.extend({
  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    return {
      pass,
      message: () => `Expected "${received}" to be a valid email address`
    };
  },
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    return {
      pass,
      message: () => `Expected "${received}" to be a valid UUID`
    };
  },
  toHaveHttpStatus(received, expectedStatus) {
    const pass = received.status === expectedStatus;
    return {
      pass,
      message: () => `Expected HTTP status ${expectedStatus} but got ${received.status}`
    };
  }
});
