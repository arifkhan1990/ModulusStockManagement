import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Loading from "@/components/ui/loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  path: string;
}

export default function ProtectedRoute({
  children,
  path,
  component;,
}: ProtectedRouteProps) {
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

  return <>{children}</>;
}
