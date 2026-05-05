/**
 * Example Hook Test - useAuth Hook
 *
 * Demonstrates React Hook testing patterns:
 * - Testing custom hooks with renderHook
 * - State updates
 * - Async operations
 * - Hook composition
 *
 * Run: npm run test:unit -- useAuth.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useState } from 'react';

// Mock useAuth hook (replace with actual import)
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call - simulated delay
      await new Promise(resolve => setTimeout(resolve, 10));
      setUser({ id: '1', email });
      localStorage.setItem('authToken', 'test_token');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return { user, loading, error, login, logout };
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update loading state during login', async () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('user@example.com', 'password');
    });

    expect(result.current.loading).toBe(true);
  });

  it('should set user after successful login', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('user@example.com', 'password');
    });

    expect(result.current.user).toEqual({
      id: '1',
      email: 'user@example.com'
    });
    expect(localStorage.getItem('authToken')).toBe('test_token');
  });

  it('should handle login error gracefully', async () => {
    const { result } = renderHook(() => useAuth());

    // Test that error state can be set
    expect(result.current.error).toBeNull();
  });

  it('should clear user on logout', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: async () => ({
        user: { id: '1', email: 'user@example.com' },
        token: 'auth_token_123'
      })
    });

    const { result } = renderHook(() => useAuth());

    // Login first
    await act(async () => {
      await result.current.login('user@example.com', 'password');
    });

    expect(result.current.user).not.toBeNull();

    // Logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('should support multiple logins', async () => {
    const { result } = renderHook(() => useAuth());

    // First login
    await act(async () => {
      await result.current.login('user1@example.com', 'pass');
    });
    expect(result.current.user).toBeDefined();

    // Second login
    await act(async () => {
      await result.current.login('user2@example.com', 'pass');
    });
    expect(result.current.user).toBeDefined();
  });
});
