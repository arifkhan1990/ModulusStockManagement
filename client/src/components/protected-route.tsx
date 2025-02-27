
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
    if (!isLoading && !user) {
      setLocation("/auth");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return <Route path={path} component={Component} />;
}
