
import React, { useEffect } from "react";
import { useLocation, Route } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Loading from "@/components/ui/loading";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export default function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Only redirect if not loading and no user is found
    if (!isLoading && !user) {
      setLocation("/auth");
    }
  }, [user, isLoading, setLocation]);

  // Show loading while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loading /></div>;
  }

  // Don't render anything if not authenticated (will redirect in useEffect)
  if (!user) {
    return null;
  }

  // User is authenticated, render the component
  return <Route path={path} component={Component} />;
}
