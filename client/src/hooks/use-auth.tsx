// use-auth.tsx
import { createContext, useContext } from "react";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { type User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/contexts/AuthContext";

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

import { InsertUser } from "@/contexts/AuthContext";

const queryClient = useQueryClient();
const toast = useToast();

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Add simplified utility methods
  const { user, isLoading, loginMutation, logoutMutation, registerMutation } =
    context;

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


// auth-provider.tsx
import React, { createContext, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AuthContext } from "@/contexts/AuthContext";
import { useLoginMutation, useLogoutMutation, useRegisterMutation } from "@/hooks/use-auth";


type AuthContextType = {
  user: any | null; // Replace 'any' with the actual User type
  isLoading: boolean;
  error: Error | null;
  login: any; //Replace 'any' with the actual type
  logout: any; //Replace 'any' with the actual type
  register: any; //Replace 'any' with the actual type
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isRegistering: boolean;
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    queryFn: () => apiRequest("GET", "/api/user").then((res) => res.json()),
    enabled: true, // Always enabled
  });

  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const registerMutation = useRegisterMutation();

  const contextValue: AuthContextType = {
    user,
    isLoading,
    error,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    register: registerMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRegistering: registerMutation.isPending,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };