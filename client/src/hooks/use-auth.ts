
import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiRequest('GET', '/api/auth/me');
      
      if (response.error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null, // Don't show error for unauthenticated state
        });
        return;
      }
      
      setAuthState({
        isAuthenticated: true,
        user: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: (error as Error).message,
      });
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiRequest('POST', '/api/auth/login', { email, password });
      
      if (response.error) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error,
        }));
        return false;
      }
      
      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
      return false;
    }
  };

  // Register function
  const register = async (userData: any) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiRequest('POST', '/api/auth/register', userData);
      
      if (response.error) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error,
        }));
        return false;
      }
      
      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      await apiRequest('POST', '/api/auth/logout');
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
      return false;
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    refreshAuth: checkAuthStatus,
  };
}
