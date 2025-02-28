import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/api";
import React, { createContext, useContext, useState, useEffect } from 'react';

// Auth type definitions
type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: Error | null;
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate checking auth status
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Auth status check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulated API call
      // In a real app, you would make an API request to your auth endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      if (email === 'user@example.com' && password === 'password') {
        const userData = {
          id: '1',
          name: 'Demo User',
          email: 'user@example.com'
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful registration
      const userData = {
        id: Date.now().toString(),
        name,
        email
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Registration failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Auth hook for components to use
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export type LoginData = {
  username: string;
  password: string;
};

export type InsertUser = {
  username: string;
  email: string;
  password: string;
  name: string;
};

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/login", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to login");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/dashboard");
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to logout");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/");
      toast({
        title: "Success",
        description: "You have successfully logged out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await apiRequest("POST", "/api/register", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/dashboard");
      toast({
        title: "Success",
        description: "You have successfully registered",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register",
        variant: "destructive",
      });
    },
  });
}