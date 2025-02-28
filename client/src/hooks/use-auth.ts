import { useState, useEffect, useMemo, createContext, useContext } from 'react';
import api from '@/utils/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = useMemo(() => !!user, [user]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return false;
      }

      // Verify token with backend
      const response = await api.get('/api/auth/verify');
      const userData = response.data.user;

      setUser(userData);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Authentication check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      setUser(user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const getSessionUser = (): User | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      permissions: decoded.permissions || [],
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};