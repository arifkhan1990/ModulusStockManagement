import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { type User, type InsertUser } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';

type LoginData = {
  username: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, InsertUser>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User>({
    queryKey: ["/api/user"],
    retry: 1,
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnMount: true, // Refetch when component mounts
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Success",
        description: "Successfully logged in!",
      });
      setLocation('/dashboard'); // Redirect to dashboard
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", data);
      return res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { User } from '@/types';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Add simplified utility methods
  const { user, isLoading, loginMutation, logoutMutation, registerMutation } = context;

  return {
    ...context,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: () => logoutMutation.mutate(),
    register: registerMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}

export { AuthProvider } from '@/providers/auth-provider';