# CI/CD Pipeline Implementation Guide

## Overview

This guide explains the GitHub Actions CI/CD pipeline for dispatchCore and how to:
- Understand the workflow
- Debug failing builds
- Optimize pipeline performance
- Deploy to production

---

## Table of Contents

1. [Pipeline Architecture](#pipeline-architecture)
2. [Workflow Stages](#workflow-stages)
3. [Configuration](#configuration)
4. [Debugging Failed Builds](#debugging-failed-builds)
5. [Performance Optimization](#performance-optimization)
6. [Deployment](#deployment)
7. [Monitoring](#monitoring)

---

## Pipeline Architecture

### Workflow File

**Location**: `.github/workflows/ci-cd.yml`

**Trigger Events:**
- `push` to `main` or `develop` branches
- `pull_request` to `main` or `develop` branches

### Job Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                    Code Push / PR Created                   │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌──────────────────────┐        ┌──────────────────────┐
│  Backend Lint        │        │  Frontend Lint       │
│  - ESLint            │        │  - ESLint            │
│  - Prettier          │        │  - TypeScript        │
│  - Node 18.x, 20.x   │        │  - Build check       │
└──────┬───────────────┘        └──────┬───────────────┘
       │                               │
       ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│  Backend Tests       │        │  Frontend Tests      │
│  - Unit Tests        │        │  - Unit Tests        │
│  - Integration Tests │        │  - Component Tests   │
│  - MySQL Service     │        │  - Coverage Upload   │
│  - Coverage Upload   │        └──────┬───────────────┘
└──────┬───────────────┘               │
       │                               │
       └────────────────┬──────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│  Security Audit      │        │  Build Artifacts     │
│  - npm audit         │        │  (main only)         │
│  - Continue on error │        │  - Create dist       │
└──────────────────────┘        │  - Upload artifact   │
                                └──────┬───────────────┘
                                       │
                                       ▼
                                ┌──────────────────────┐
                                │  Notify Status       │
                                │  - Summary check     │
                                │  - Pass/Fail result  │
                                └──────────────────────┘
```

---

## Workflow Stages

### Stage 1: Backend Lint (Multi-Version)

**Purpose**: Check code quality with multiple Node versions

```yaml
runs-on: ubuntu-latest
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

**Steps:**
1. Checkout code
2. Setup Node.js with caching
3. Install dependencies (`npm ci`)
4. Run ESLint
5. Check Prettier formatting

**Success Criteria:**
- No linting errors on all Node versions
- Code formatted correctly
- All dependencies resolve

**Typical Duration:** 30-45 seconds

### Stage 2: Backend Tests (with MySQL)

**Purpose**: Test backend logic with real database

```yaml
services:
  mysql:
    image: mysql:8.0
    env:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: dispatchcore_test
```

**Steps:**
1. Wait for MySQL to be healthy
2. Install dependencies
3. Run unit tests
4. Run integration tests
5. Upload coverage to Codecov

**Database Connection:**
```javascript
// Environment variables in workflow
DB_HOST: localhost
DB_PORT: 3306
DB_USER: root
DB_PASSWORD: root_password
DB_NAME: dispatchcore_test
```

**Success Criteria:**
- All unit tests pass
- All integration tests pass
- Coverage meets thresholds (70%)

**Typical Duration:** 1-2 minutes

### Stage 3: Frontend Lint & Build

**Purpose**: Ensure TypeScript and build integrity

```yaml
steps:
  - npm run lint
  - npx tsc --noEmit
  - npm run build
```

**Success Criteria:**
- No ESLint errors
- TypeScript compiles without errors
- Production build succeeds

**Typical Duration:** 45-60 seconds

### Stage 4: Frontend Tests

**Purpose**: Test React components and hooks

**Steps:**
1. Install dependencies
2. Run unit tests with Vitest
3. Run component tests
4. Upload coverage

**Success Criteria:**
- All component tests pass
- All hook tests pass
- Coverage meets thresholds (70%)

**Typical Duration:** 30-45 seconds

### Stage 5: Security Audit

**Purpose**: Check for known vulnerabilities (non-blocking)

```bash
npm audit --audit-level=moderate
continue-on-error: true
```

**Reports:**
- Moderate and high severity vulnerabilities
- Doesn't block merge (non-critical)

**Action Items:**
- Review GitHub Dependabot alerts
- Update packages as needed

**Typical Duration:** 20-30 seconds

### Stage 6: Build Artifacts (main only)

**Condition:** `if: github.ref == 'refs/heads/main' && github.event_name == 'push'`

**Purpose**: Generate deployment artifacts

**Steps:**
1. Build backend (lint check)
2. Build frontend (dist folder)
3. Upload dist as artifact (7-day retention)
4. Generate release notes

**Artifacts Available:**
- GitHub Actions → Artifacts tab
- Download `frontend-build.zip`

**Typical Duration:** 1-2 minutes

### Stage 7: Notify Status

**Purpose**: Final status summary

**Logic:**
```bash
if any job failed:
  exit 1  # Mark PR as failed
else:
  success message  # All checks passed
```

---

## Configuration

### Environment Variables

**Available in all jobs:**
```yaml
env:
  NODE_VERSION: '18'
```

**Test-specific:**
```yaml
env:
  DB_HOST: localhost
  DB_PORT: 3306
  NODE_ENV: test
```

### Caching Strategy

**NPM Dependencies Cache:**
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
    cache-dependency-path: backend/package-lock.json
```

**Benefits:**
- 50-70% faster install time
- Cached on per-branch basis
- Automatically invalidated on package-lock.json change

### Matrix Builds

**Backend tests multiple Node versions:**
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

**Why?**
- Ensures compatibility across versions
- Catches version-specific bugs early
- Production might run different versions

---

## Debugging Failed Builds

### Common Issues & Solutions

#### 1. "Cannot find module" on CI but works locally

**Cause:** Package cache mismatch

```bash
# Local fix
rm package-lock.json
npm install
git commit package-lock.json

# Re-run workflow
```

#### 2. Timeout in tests (>10s)

**Issue:** Long-running operations

```javascript
// jest.config.js
testTimeout: 10000  // 10 seconds

// Or per test:
it('slow test', async () => {
  // ...
}, 20000);  // 20 seconds
```

#### 3. Database connection fails

**Debug:**
```yaml
- name: Check MySQL
  run: |
    mysql -h localhost -u root -proot_password -e "SELECT 1"
```

#### 4. Node version mismatch

**Check:** `.nvmrc` or `package.json` engines field

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### View Logs

1. **GitHub UI**: Actions → Workflow run → Job details
2. **Download logs**: Click "Download logs" (zip file)
3. **Search logs**: Use CTRL+F to find errors

### Re-run Failed Jobs

```
GitHub UI → Re-run jobs → Select failed jobs
```

Or re-run entire workflow:
```
GitHub UI → Re-run all jobs
```

---

## Performance Optimization

### Current Performance

| Stage | Duration | Status |
|-------|----------|--------|
| Backend Lint | 30-45s | ✅ Cached |
| Backend Tests | 60-90s | ✅ Parallel |
| Frontend Lint | 45-60s | ✅ Cached |
| Frontend Tests | 30-45s | ✅ Parallel |
| Security Audit | 20-30s | ⚠️ Optional |
| **Total (serial)** | 3-4 min | ✅ Good |

### Optimization Strategies

#### 1. Improve Cache Hit Rate

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
    cache-dependency-path: 'backend/package-lock.json'
```

**Tips:**
- Commit `package-lock.json`
- Use `npm ci` (not `npm install`)
- Avoid `npm update` in CI

#### 2. Skip Unnecessary Jobs

```yaml
# Only run security audit on main
if: github.ref == 'refs/heads/main'
```

#### 3. Parallel Execution

Currently, most jobs run in parallel:
- Backend lint + Frontend lint (simultaneous)
- Backend tests + Frontend tests (after linting)

**Cannot parallelize:**
- Backend tests depend on Backend lint
- Frontend tests depend on Frontend lint

#### 4. Database Optimization

```yaml
services:
  mysql:
    options: >-
      --health-cmd="mysqladmin ping"
      --health-interval=10s
      --health-timeout=5s
      --health-retries=3
```

**Waits for health check before tests start**

---

## Deployment

### Deployment Workflow

**Current:** Manual deployment (not automated in CI/CD)

**Future setup:**
```yaml
deploy:
  needs: [build-artifacts]
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Deploy to production
      run: |
        # Deploy script here
```

### Deployment Checklist

Before merging to `main`:
- [ ] All checks pass (green checkmark)
- [ ] Code review approved
- [ ] Manual testing complete
- [ ] Release notes updated

### Production Deployment

```bash
# Manual steps (add to CI/CD when ready)
git checkout main
git pull
npm run build
# Deploy to Vercel, Render, AWS, etc.
```

---

## Monitoring

### GitHub Actions Dashboard

**Navigate to:**
```
Repository → Actions tab → ci-cd workflow
```

**View:**
- Build history
- Duration trends
- Failure patterns
- Branch-specific stats

### Notification Settings

**GitHub:**
```
Settings → Notifications → Actions
- Email on: all failures, or branch failures
```

**Slack Integration (Optional):**
```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

### Performance Monitoring

**Check trends:**
1. Actions tab → ci-cd workflow
2. Scroll to "All runs"
3. Note duration changes over time

**Alert on:** Consistent slowdowns (30%+ increase)

### Coverage Monitoring

**Codecov Dashboard:**
```
https://codecov.io/gh/arsh342/dispatchCore
```

**Track:**
- Coverage % trends
- Per-file coverage
- Pull request comparisons

---

## Best Practices

### 1. Keep CI/CD Fast

- ✅ Parallelize where possible
- ✅ Use caching aggressively
- ✅ Skip unnecessary checks on branches
- ❌ Don't run long E2E tests on every PR

### 2. Fail Fast

```yaml
# Stop on first error
bail: 1

# Fail CI if coverage drops
fail_ci_if_error: true
```

### 3. Clear Logging

```bash
# Good: specific error messages
echo "Database migration failed: table users not found"

# Bad: vague errors
echo "Error"
```

### 4. Document Changes

```yaml
# When modifying workflow:
# Update CICD_GUIDE.md with changes
# Explain why (performance? reliability?)
```

### 5. Version Pinning

```yaml
# Good: specific version
uses: actions/setup-node@v4

# Avoid: @latest (unpredictable)
uses: actions/setup-node@latest
```

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)

---

## Troubleshooting

### Workflow not triggering

**Check:**
- Branch name matches trigger (`main` or `develop`)
- Event type matches (`push` or `pull_request`)
- File path correct: `.github/workflows/ci-cd.yml`

### "Out of disk space" error

**Solution:**
```yaml
- name: Free disk space
  run: |
    sudo rm -rf /usr/local/lib/android
    sudo rm -rf /usr/share/dotnet
```

### Secrets not available

**Add to:** Repository → Settings → Secrets → New repository secret

**Use in workflow:**
```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
