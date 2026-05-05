# Testing & CI/CD Quick Start

## 30-Second Setup

```bash
# Backend
cd backend
npm install --save-dev jest supertest
npm run test

# Frontend
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
npm run test:unit
```

---

## What Was Added

### 1. CI/CD Pipeline (GitHub Actions)

**File:** `.github/workflows/ci-cd.yml`

Automatically runs on every push and pull request:
- Lint backend & frontend
- Run tests with multiple Node versions
- MySQL test database
- Security audit
- Generate build artifacts
- Coverage reports

**View Results:** GitHub Actions tab in repository

### 2. Backend Testing (Jest)

**Files Created:**
- `backend/jest.config.js` — Jest configuration
- `backend/src/__tests__/setup.js` — Jest setup & custom matchers
- `backend/src/__tests__/unit/mailService.test.js` — Unit test example
- `backend/src/__tests__/integration/authController.test.js` — Integration test example
- `backend/src/__tests__/mocks/index.js` — Mock utilities

**Commands:**
```bash
npm run test              # All tests + coverage
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:watch       # Watch mode
npm run test:debug       # Debug mode
```

### 3. Frontend Testing (Vitest)

**Files Created:**
- `frontend/vitest.config.ts` — Vitest configuration
- `frontend/src/__tests__/setup.ts` — Vitest setup
- `frontend/src/__tests__/components/Button.test.tsx` — Component test example
- `frontend/src/__tests__/unit/useAuth.test.ts` — Hook test example

**Commands:**
```bash
npm run test:unit          # Run tests
npm run test:unit:watch    # Watch mode
npm run test:coverage      # Coverage report
npm run test:components    # Component tests only
```

### 4. Documentation

**Files Created:**
- `docs/TESTING.md` — Comprehensive testing guide (3,000+ words)
- `docs/CI_CD_GUIDE.md` — CI/CD implementation guide (3,000+ words)
- `docs/SETUP_TESTING_SCRIPTS.sh` — Script setup reference

---

## Getting Started

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install --save-dev jest supertest
```

**Frontend:**
```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Step 2: Add Test Scripts

**backend/package.json** (add to "scripts"):
```json
"test": "jest --coverage",
"test:unit": "jest src/__tests__/unit --coverage",
"test:integration": "jest src/__tests__/integration --coverage",
"test:watch": "jest --watch",
"test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
```

**frontend/package.json** (add to "scripts"):
```json
"test:unit": "vitest run",
"test:unit:watch": "vitest",
"test:components": "vitest run src/__tests__/components",
"test:coverage": "vitest run --coverage"
```

### Step 3: Verify Setup

**Backend:**
```bash
cd backend
npm run test
# Should show: Jest v29.x started with 0 tests (no tests created yet)
```

**Frontend:**
```bash
cd frontend
npm run test:unit
# Should show: Vitest v1.x started with 0 tests (no tests created yet)
```

### Step 4: Create Your First Test

**Backend Unit Test Example:**

Create `backend/src/__tests__/unit/hello.test.js`:
```javascript
describe('Hello', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
```

Run: `npm run test:unit`

**Frontend Component Test Example:**

Create `frontend/src/__tests__/components/Hello.test.tsx`:
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

const Hello = () => <div>Hello World</div>;

describe('Hello Component', () => {
  it('should render', () => {
    render(<Hello />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

Run: `npm run test:unit`

---

## Testing Patterns

### Backend: Unit Test

```javascript
// Test a pure function or service
const { sum } = require('../utils/math');

describe('Math', () => {
  it('should add numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
```

### Backend: Integration Test

```javascript
// Test API endpoints with database
const request = require('supertest');
const app = require('../../app');

describe('Orders API', () => {
  it('should create order', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ address: '123 Main St' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });
});
```

### Frontend: Component Test

```typescript
// Test React component behavior
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('should handle click', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Frontend: Hook Test

```typescript
// Test custom React hooks
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('should increment', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

---

## CI/CD Pipeline

### What It Does

```
On every push/PR:
├── Lint code (ESLint, Prettier)
├── Run tests
├── Check types (TypeScript)
├── Build project
└── Upload coverage
```

### View Results

1. Go to **Actions** tab in GitHub
2. Click latest workflow run
3. View jobs and logs

### Common Checks

| Check | Tool | Status |
|-------|------|--------|
| Lint | ESLint | Required ✅ |
| Format | Prettier | Required ✅ |
| Tests | Jest/Vitest | Required ✅ |
| Build | Vite | Required ✅ |
| Security | npm audit | Warning ⚠️ |
| Coverage | Codecov | Tracked 📊 |

---

## Testing Best Practices

### ✅ Do

- Write tests for critical paths (auth, orders, payments)
- Test user behavior, not implementation
- Use meaningful test names
- Keep tests isolated and independent
- Mock external services (APIs, databases)

### ❌ Don't

- Test every line of code
- Create interdependent tests
- Use timeouts without reason
- Mock the component being tested
- Ignore test failures

### Coverage Goals

- **Critical:** 80%+ (auth, payments, core logic)
- **Important:** 70%+ (services, utilities)
- **Nice to have:** 50%+ (UI components, extras)

**Don't chase 100% coverage—test important behavior**

---

## Debugging Tips

### Backend

**Run single test:**
```bash
npm run test -- authController.test.js
```

**Debug mode:**
```bash
npm run test:debug
# Opens chrome://inspect in Chrome DevTools
```

**View coverage:**
```bash
npm run test
open coverage/lcov-report/index.html
```

### Frontend

**Watch mode (auto-rerun):**
```bash
npm run test:unit:watch
```

**Debug in VS Code:**
```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:unit:watch"],
  "console": "integratedTerminal"
}
```

**View component render:**
```typescript
import { render, screen } from '@testing-library/react';
import { debug } from '@testing-library/react';

it('should render', () => {
  const { container } = render(<Component />);
  debug(container);  // Prints HTML to console
});
```

---

## File Structure

```
dispatchCore/
├── .github/workflows/
│   └── ci-cd.yml                    # GitHub Actions workflow
├── backend/
│   ├── jest.config.js               # Jest configuration
│   ├── package.json                 # Add test scripts
│   └── src/
│       └── __tests__/
│           ├── setup.js             # Jest setup
│           ├── unit/
│           │   └── mailService.test.js
│           ├── integration/
│           │   └── authController.test.js
│           └── mocks/
│               └── index.js
├── frontend/
│   ├── vitest.config.ts             # Vitest configuration
│   ├── package.json                 # Add test scripts
│   └── src/
│       └── __tests__/
│           ├── setup.ts             # Vitest setup
│           ├── components/
│           │   └── Button.test.tsx
│           ├── unit/
│           │   └── useAuth.test.ts
│           └── mocks/
└── docs/
    ├── TESTING.md                   # Testing guide
    ├── CI_CD_GUIDE.md               # CI/CD guide
    └── SETUP_TESTING_SCRIPTS.sh     # Setup reference
```

---

## Next Steps

1. **Install dependencies:** `npm install --save-dev ...`
2. **Add test scripts:** Update `package.json`
3. **Create your first test:** Follow patterns above
4. **Run tests:** `npm run test`
5. **Push to GitHub:** GitHub Actions will run automatically
6. **View results:** GitHub Actions tab

---

## Documentation

- **Full Testing Guide:** `docs/TESTING.md`
- **CI/CD Guide:** `docs/CI_CD_GUIDE.md`
- **Jest Docs:** https://jestjs.io/
- **Vitest Docs:** https://vitest.dev/
- **React Testing Library:** https://testing-library.com/

---

## Support

For questions or issues:
1. Check `docs/TESTING.md` Troubleshooting section
2. Check `docs/CI_CD_GUIDE.md` Troubleshooting section
3. Review example tests in `backend/src/__tests__/` and `frontend/src/__tests__/`
