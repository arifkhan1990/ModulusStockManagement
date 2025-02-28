
import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../../hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const [location, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login if not authenticated
        setLocation(`/login?redirect=${encodeURIComponent(location)}`);
      } else if (adminOnly && user.role !== "admin") {
        // Redirect to dashboard if not admin
        setLocation("/dashboard");
      }
    }
  }, [user, isLoading, location, setLocation, adminOnly]);

  // Show loading while checking authentication
  if (isLoading || !user) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner"></div>
      </div>
    );
  }

  // If admin route and user is not admin
  if (adminOnly && user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
