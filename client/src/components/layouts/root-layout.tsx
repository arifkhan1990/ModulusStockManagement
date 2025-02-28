
import React, { ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/providers/auth-provider";
import LoadingLayout from "./loading-layout";
import DashboardLayout from "./dashboard-layout";
import Navbar from "@/components/navbar";

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
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        {children}
      </main>
      <footer className="bg-secondary py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Modulus Stock Management. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default RootLayout;
