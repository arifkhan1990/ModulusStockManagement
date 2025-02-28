
import React, { ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import LoadingLayout from "./loading-layout";
import DashboardLayout from "./dashboard-layout";
import LandingLayout from "./landing-layout";

export function RootLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();
  
  // If loading, show loading screen
  if (isLoading) {
    return <LoadingLayout />;
  }
  
  // If logged in and on dashboard path, use DashboardLayout
  if (user && location.startsWith("/dashboard")) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }
  
  // For public pages, use the landing layout
  return <LandingLayout>{children}</LandingLayout>;
}

export default RootLayout;
