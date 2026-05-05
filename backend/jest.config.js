/**
 * Backend Test Setup - Jest Configuration
 *
 * Unit Testing Framework for Node.js backend
 * Supports:
 * - Unit tests for services, models, utilities
 * - Integration tests with database
 * - API endpoint tests
 * - Mocking and stubbing
 *
 * Install: npm install --save-dev jest supertest
 * Run: npm test
 */

module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/config/**',
    '!src/migrations/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  testTimeout: 10000,
  verbose: true,
  bail: 1,
  maxWorkers: '50%'
};
