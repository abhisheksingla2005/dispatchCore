#!/bin/bash

# Package.json Script Updates
# Add these scripts to both backend/package.json and frontend/package.json

# ============================================
# BACKEND package.json - Add to "scripts"
# ============================================

# "test": "jest --coverage",
# "test:unit": "jest src/__tests__/unit --coverage",
# "test:integration": "jest src/__tests__/integration --coverage",
# "test:watch": "jest --watch",
# "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",

# ============================================
# FRONTEND package.json - Add to "scripts"
# ============================================

# "test:unit": "vitest run",
# "test:unit:watch": "vitest",
# "test:components": "vitest run src/__tests__/components",
# "test:coverage": "vitest run --coverage",
# "test:debug": "vitest --inspect-brk --inspect --no-coverage",

# ============================================
# How to add scripts manually:
# ============================================

# 1. Open backend/package.json or frontend/package.json
# 2. Find the "scripts" section
# 3. Add new test scripts as shown above
# 4. Save and run: npm install
# 5. Verify: npm run test

# ============================================
# Example scripts section:
# ============================================

# "scripts": {
#   "dev": "...",
#   "build": "...",
#   "lint": "...",
#   "format": "...",
#   "test": "jest --coverage",
#   "test:unit": "jest src/__tests__/unit --coverage",
#   "test:integration": "jest src/__tests__/integration --coverage",
#   "test:watch": "jest --watch",
#   "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
# }

# ============================================
# Dependencies to install:
# ============================================

# Backend:
# npm install --save-dev jest supertest

# Frontend:
# npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# ============================================
# Verify installation:
# ============================================

# Backend:
# npx jest --version
# npx supertest --version

# Frontend:
# npx vitest --version
# npm ls @testing-library/react
