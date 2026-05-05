/**
 * Example Unit Test - Email Utilities
 *
 * Demonstrates unit testing patterns:
 * - Testing pure functions
 * - Testing validators
 * - Testing with multiple inputs
 * - Error handling
 *
 * Run: npm test -- unit/
 */

// Simple email validation function (testable without mocks)
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatEmail = (email) => {
  return email.toLowerCase().trim();
};

describe('Email Utilities', () => {
  describe('validateEmail()', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'john.doe@company.co.uk',
        'support+tag@dispatchcore.tech'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        'invalid@',
        '@invalid.com',
        'spaces in@email.com'
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it('should handle empty strings', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('formatEmail()', () => {
    it('should convert to lowercase', () => {
      expect(formatEmail('USER@EXAMPLE.COM')).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      expect(formatEmail('  user@example.com  ')).toBe('user@example.com');
    });

    it('should handle already formatted emails', () => {
      expect(formatEmail('user@example.com')).toBe('user@example.com');
    });
  });

  describe('Email validation edge cases', () => {
    it('should handle very long emails', () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      expect(validateEmail(longEmail)).toBe(true);
    });

    it('should handle emails with multiple subdomains', () => {
      expect(validateEmail('user@mail.company.example.com')).toBe(true);
    });

    it('should reject emails with invalid special characters', () => {
      expect(validateEmail('user@exam ple.com')).toBe(false);
    });
  });
});
