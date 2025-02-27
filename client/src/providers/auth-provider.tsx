import React, { ReactNode } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "wouter";
import { AuthContext, AuthContextType } from "@/contexts/AuthContext";
import { useLoginMutation, useLogoutMutation, useRegisterMutation } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/api";
import { type User } from "@shared/schema";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User>({
    queryKey: ["/api/user"],
    queryFn: () => apiRequest("GET", "/api/user").then(res => {
      if (!res.ok) return null;
      return res.json();
    }),
    retry: 1,
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnMount: true, // Refetch when component mounts
  });

  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const registerMutation = useRegisterMutation();

  const contextValue: AuthContextType = {
    user: user || null,
    isLoading,
    error: error as Error | null,
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