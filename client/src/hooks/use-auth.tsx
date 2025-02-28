import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";
import { type User } from "@shared/schema";

// Type definition for login data
export type LoginData = {
  username: string;
  password: string;
};

// Type definition for user registration
export type InsertUser = {
  username: string;
  email: string;
  password: string;
  name: string;
};

// Hook exports
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

// Main auth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}