import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import LandingLayout from "@/components/layouts/landing-layout";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import ProtectedRoute from "@/components/auth/protected-route";
import { ErrorBoundary } from "@/components/error-boundary";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Lazy-loaded pages for better performance
const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));
//const Products = lazy(() => import("@/pages/dashboard/products")); // Add this import manually
//const Locations = lazy(() => import("@/pages/dashboard/locations")); // Add this import manually


export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Switch>
            {/* Public routes */}
            <Route path="/">
              <LandingLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Home />
                </Suspense>
              </LandingLayout>
            </Route>
            <Route path="/login">
              <LandingLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Login />
                </Suspense>
              </LandingLayout>
            </Route>
            <Route path="/register">
              <LandingLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Register />
                </Suspense>
              </LandingLayout>
            </Route>

            {/* Protected routes */}
            <Route path="/dashboard">
              <ProtectedRoute>
                <DashboardLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Dashboard />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            </Route>
            <Route path="/dashboard/products">
              <ProtectedRoute>
                <DashboardLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    {/*<Products />*/}
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            </Route>
            <Route path="/dashboard/locations">
              <ProtectedRoute>
                <DashboardLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    {/*<Locations />*/}
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            </Route>

            {/* 404 route */}
            <Route>
              <LandingLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <NotFound />
                </Suspense>
              </LandingLayout>
            </Route>
          </Switch>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}