# Testing & CI/CD Guide

## Overview

This document covers testing strategies and CI/CD pipeline setup for dispatchCore. The project uses:

- **Backend**: Jest + Supertest for unit and integration testing
- **Frontend**: Vitest + React Testing Library for component testing
- **CI/CD**: GitHub Actions for automated testing and deployment

---

## Table of Contents

1. [Backend Testing](#backend-testing)
2. [Frontend Testing](#frontend-testing)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Debugging & Best Practices](#debugging--best-practices)
5. [Coverage Reports](#coverage-reports)

---

## Backend Testing

### Setup

```bash
cd backend
npm install --save-dev jest supertest
```

### Running Tests

```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage
npm run test -- --coverage

# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test -- mailService.test.js
```

### Test Structure

```
backend/
├── src/
│   ├── __tests__/
│   │   ├── setup.js                    # Jest setup & custom matchers
│   │   ├── unit/
│   │   │   ├── mailService.test.js
│   │   │   ├── utils.test.js
│   │   │   └── validators.test.js
│   │   ├── integration/
│   │   │   ├── authController.test.js
│   │   │   ├── orderController.test.js
│   │   │   └── driverController.test.js
│   │   └── mocks/
│   │       ├── index.js                # Mock utilities
│   │       ├── firebase.js
│   │       └── database.js
│   ├── services/
│   ├── controllers/
│   └── utils/
├── jest.config.js                      # Jest configuration
└── package.json
```

### Unit Testing Example

**Testing a service function:**

```javascript
// src/__tests__/unit/mailService.test.js
jest.mock('../config/mail');
const mailService = require('../services/mailService');

describe('Mail Service', () => {
  it('should send email successfully', async () => {
    const result = await mailService.sendMail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<h1>Hello</h1>'
    });

    expect(result).toBeDefined();
    expect(result.id).toMatch(/^email_/);
  });
});
```

### Integration Testing Example

**Testing API endpoints:**

```javascript
// src/__tests__/integration/authController.test.js
const request = require('supertest');
const app = require('../../app');

describe('Auth API', () => {
  it('should register user and return token', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'user@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('idToken');
  });
});
```

### Custom Matchers

Available custom matchers in Jest setup:

```javascript
// Email validation
expect('user@example.com').toBeValidEmail();

// UUID validation
expect('550e8400-e29b-41d4-a716-446655440000').toBeValidUUID();

// HTTP status
expect(response).toHaveHttpStatus(200);
```

### Mocking Utilities

**Mock Firebase:**

```javascript
const { mockFirebaseAuth } = require('../__tests__/mocks');

const firebaseAuth = mockFirebaseAuth();
firebaseAuth.createUser({ email: 'test@example.com' });
```

**Mock Database Models:**

```javascript
const { mockSequelizeModel } = require('../__tests__/mocks');

const User = mockSequelizeModel('User');
const user = await User.create({ email: 'test@example.com' });
```

**Mock Resend Email:**

```javascript
const { mockResendClient } = require('../__tests__/mocks');

const client = mockResendClient();
const result = await client.emails.send({ to: 'user@example.com' });
```

---

## Frontend Testing

### Setup

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Running Tests

```bash
# Run all tests
npm run test:unit

# Run tests in watch mode
npm run test:unit -- --watch

# Run tests with coverage
npm run test:unit -- --coverage

# Run specific test file
npm run test:unit -- Button.test.tsx

# Run component tests
npm run test:components
```

### Test Structure

```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── setup.ts                    # Vitest setup
│   │   ├── components/
│   │   │   ├── Button.test.tsx
│   │   │   ├── Card.test.tsx
│   │   │   └── Modal.test.tsx
│   │   ├── unit/
│   │   │   ├── useAuth.test.ts
│   │   │   ├── useOrders.test.ts
│   │   │   └── utils.test.ts
│   │   └── mocks/
│   │       └── api.ts
│   ├── components/
│   └── hooks/
├── vitest.config.ts                    # Vitest configuration
└── package.json
```

### Component Testing Example

**Testing a React component:**

```typescript
// src/__tests__/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../components/Button';

describe('Button Component', () => {
  it('should render and handle click', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### Hook Testing Example

**Testing a custom hook:**

```typescript
// src/__tests__/unit/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';

describe('useAuth Hook', () => {
  it('should handle login', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('user@example.com', 'pass');
    });

    expect(result.current.user).toBeDefined();
  });
});
```

### Testing Accessibility

```typescript
// Test with accessibility queries
const button = screen.getByRole('button', { name: /submit/i });
const input = screen.getByLabelText(/email/i);
const heading = screen.getByRole('heading', { level: 1 });
```

### Mocking API Calls

```typescript
// Mock fetch in test
global.fetch = vi.fn().mockResolvedValueOnce({
  json: async () => ({ success: true })
});

// Or use MSW (Mock Service Worker) for more complex scenarios
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.post('/api/orders', () => HttpResponse.json({ id: 1 }))
);
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

The pipeline runs on:
- **Triggers**: Push to `main` or `develop`, Pull Requests
- **Jobs**: Lint, Test, Build, Security Audit

### Workflow Stages

```
1. Backend Lint & Format
   └─ Run ESLint, Prettier check
   └─ Test multiple Node versions (18.x, 20.x)

2. Backend Unit & Integration Tests
   └─ Requires: Backend Lint passes
   └─ Services: MySQL test database
   └─ Upload coverage to Codecov

3. Frontend Lint & Build Check
   └─ Run ESLint, TypeScript type check
   └─ Build project to verify no errors

4. Frontend Unit & Component Tests
   └─ Requires: Frontend Lint passes
   └─ Upload coverage to Codecov

5. Security Audit
   └─ npm audit on both backend and frontend
   └─ Warns on moderate vulnerabilities

6. Build Artifacts (main branch only)
   └─ Build frontend dist folder
   └─ Upload as GitHub artifact (7 day retention)

7. Notify Status
   └─ Summary of all checks
```

### Viewing Results

1. **GitHub Dashboard**: Actions tab → Workflow runs
2. **Pull Request Checks**: Review tab → Status checks
3. **Codecov**: codecov.io (if connected)

### Local Testing Before Push

```bash
# Run full pipeline locally
npm run lint                  # Backend & Frontend lint
npm run test                  # Backend tests
npm run test:unit            # Frontend tests
npm run build                # Frontend build

# Or test specific stage
cd backend && npm run test:unit
cd frontend && npm run test:unit -- --coverage
```

---

## Debugging & Best Practices

### Debugging Tests

```bash
# Run with verbose output
npm run test -- --verbose

# Run single test
npm run test -- --testNamePattern="should send email"

# Debug in VS Code
# Add to .vscode/launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

### Best Practices

**1. Test Organization**
- One concept per test
- Clear test names describing the behavior
- Arrange → Act → Assert pattern

```javascript
describe('Feature', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = processInput(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

**2. Avoid Anti-Patterns**
- ❌ Don't test implementation details
- ❌ Don't create interdependent tests
- ❌ Don't use `act()` unnecessarily in React Testing Library
- ✅ Test user behavior and outcomes
- ✅ Keep tests isolated
- ✅ Use semantic queries (getByRole, getByLabelText)

**3. Mock Strategies**
- Mock external APIs and services
- Don't mock the component being tested
- Use realistic mock data

**4. Coverage Goals**
- Aim for 70%+ line coverage
- Focus on critical paths (auth, payments, core logic)
- Don't chase coverage numbers, test important behavior

---

## Coverage Reports

### Backend Coverage

```bash
cd backend
npm run test -- --coverage

# View HTML report
open coverage/lcov-report/index.html
```

**Coverage thresholds** (from jest.config.js):
- Lines: 70%
- Functions: 70%
- Branches: 70%
- Statements: 70%

### Frontend Coverage

```bash
cd frontend
npm run test:unit -- --coverage

# View HTML report
open coverage/index.html
```

### Codecov Integration

Coverage reports are automatically uploaded to Codecov.io on CI/CD:
- Branch coverage tracking
- Pull request comparisons
- Coverage badges in README

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Supertest](https://github.com/visionmedia/supertest)

---

## Troubleshooting

### "Cannot find module" errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run test
```

### Tests timing out

- Increase timeout in jest.config.js or vitest.config.ts
- Check for unresolved promises
- Verify mocks are set up correctly

### Coverage not generated

```bash
# Ensure coverage directory permissions
chmod -R 755 coverage/

# Reinstall dependencies
npm install --save-dev jest vitest
```

### CI/CD failing but local tests pass

- Check Node version matches workflow
- Verify environment variables in test
- Run with same configuration: `npm ci`
