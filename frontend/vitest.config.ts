/**
 * Frontend Test Setup - Vitest Configuration
 *
 * Unit and Component Testing Framework for React
 * Supports:
 * - React component testing with React Testing Library
 * - Snapshot testing
 * - Coverage reports
 * - Mocking modules and API calls
 *
 * Install: npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
 * Run: npm run test:unit
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    singleThread: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**'
      ],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70
    },
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
