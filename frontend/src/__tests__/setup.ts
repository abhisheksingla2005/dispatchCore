/**
 * Vitest Setup File
 *
 * Configures test environment for React components:
 * - DOM setup
 * - Custom matchers
 * - Global test utilities
 * - API mocking
 */

import '@testing-library/jest-dom';
import { expect, afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
(global as unknown as Window).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock ResizeObserver
(global as unknown as Window).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof ResizeObserver;

// Suppress console errors in tests
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

// Custom matchers
expect.extend({
  toHaveBeenCalledWithArgs(received: { mock: { calls: unknown[][] } }, ...args: unknown[]) {
    const pass = received.mock.calls.some((call: unknown[]) =>
      args.every((arg, i) => arg === call[i])
    );
    return {
      pass,
      message: () => `Expected to have been called with ${JSON.stringify(args)}`
    };
  }
});
