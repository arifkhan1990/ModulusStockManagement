
// use-auth.tsx
import { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
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

// Hook for login mutation
export function useLoginMutation() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
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
}

// Hook for logout mutation
export function useLogoutMutation() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Logout failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Success",
        description: "Successfully logged out!",
      });
      setLocation('/'); // Redirect to home
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook for registration mutation
export function useRegisterMutation() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Success",
        description: "Account created successfully!",
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
}

// Main auth hook
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}

// Helper function to get QueryClient
function useQueryClient() {
  // This is a stub - the actual useQueryClient should be imported from @tanstack/react-query
  return {
    setQueryData: (key: any, data: any) => {},
    invalidateQueries: (key: any) => {}
  };
}
