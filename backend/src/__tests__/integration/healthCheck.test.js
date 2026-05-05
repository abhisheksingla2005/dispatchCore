/**
 * Example Integration Test - Response Utilities
 *
 * Demonstrates integration testing patterns:
 * - Testing response utilities with mocked Express response
 * - Error handling
 * - Response envelope validation
 *
 * Run: npm test -- integration/
 */

const { success, error } = require('../../utils/response');

describe('Response Utilities Integration', () => {
  // Mock Express response object
  const createMockResponse = () => {
    const res = {
      statusCode: 200,
      jsonData: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.jsonData = data;
        return this;
      },
    };
    return res;
  };

  describe('Success Response', () => {
    it('should format success response with data', () => {
      const res = createMockResponse();
      const data = { id: 1, name: 'Test' };
      success(res, data);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData).toHaveProperty('success', true);
      expect(res.jsonData.data).toEqual(data);
    });

    it('should handle success without data', () => {
      const res = createMockResponse();
      success(res, null);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData.success).toBe(true);
      expect(res.jsonData.data).toBeNull();
    });

    it('should set custom status code', () => {
      const res = createMockResponse();
      success(res, { id: 1 }, null, 201);

      expect(res.statusCode).toBe(201);
    });

    it('should include metadata when provided', () => {
      const res = createMockResponse();
      const meta = { page: 1, total: 100 };
      success(res, [], meta);

      expect(res.jsonData).toHaveProperty('meta', meta);
    });
  });

  describe('Error Response', () => {
    it('should format error response correctly', () => {
      const res = createMockResponse();
      error(res, 'VALIDATION_ERROR', 'Invalid input');

      expect(res.statusCode).toBe(400);
      expect(res.jsonData.success).toBe(false);
      expect(res.jsonData.error.code).toBe('VALIDATION_ERROR');
      expect(res.jsonData.error.message).toBe('Invalid input');
    });

    it('should set custom error status code', () => {
      const res = createMockResponse();
      error(res, 'NOT_FOUND', 'Resource not found', 404);

      expect(res.statusCode).toBe(404);
      expect(res.jsonData.error.status).toBe(404);
    });

    it('should have error status in response', () => {
      const res = createMockResponse();
      error(res, 'SERVER_ERROR', 'Internal error', 500);

      expect(res.jsonData.error.status).toBe(500);
    });
  });

  describe('Response Envelope Validation', () => {
    it('should always have success field', () => {
      const res = createMockResponse();
      success(res, { test: 'data' });

      expect(res.jsonData).toHaveProperty('success');
      expect(typeof res.jsonData.success).toBe('boolean');
    });

    it('should differentiate between success and error responses', () => {
      const successRes = createMockResponse();
      const errorRes = createMockResponse();

      success(successRes, {});
      error(errorRes, 'ERROR', 'Error message');

      expect(successRes.jsonData.success).toBe(true);
      expect(errorRes.jsonData.success).toBe(false);
    });
  });
});
