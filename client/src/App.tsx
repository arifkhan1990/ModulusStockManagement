
import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { queryClient } from "@/lib/query";
import { LandingLayout } from "@/components/layouts/landing-layout";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";

// Lazy-loaded Pages
const Home = lazy(() => import('@/pages/home'));
const NotFound = lazy(() => import('@/pages/not-found'));

// Auth Pages
const Login = lazy(() => import('@/pages/auth/login'));
const Register = lazy(() => import('@/pages/auth/register'));
const ForgotPassword = lazy(() => import('@/pages/auth/forgot-password'));
const ResetPassword = lazy(() => import('@/pages/auth/reset-password'));

// Dashboard Pages
const Dashboard = lazy(() => import('@/pages/dashboard/index'));
const Products = lazy(() => import('@/pages/dashboard/products'));
const Locations = lazy(() => import('@/pages/dashboard/locations'));

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
            
            {/* Authentication Routes */}
            <Route path="/auth/login">
              <LandingLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Login />
                </Suspense>
              </LandingLayout>
            </Route>
            <Route path="/auth/register">
              <LandingLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Register />
                </Suspense>
              </LandingLayout>
            </Route>
            <Route path="/auth/forgot-password">
              <LandingLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <ForgotPassword />
                </Suspense>
              </LandingLayout>
            </Route>
            <Route path="/auth/reset-password">
              <LandingLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <ResetPassword />
                </Suspense>
              </LandingLayout>
            </Route>
            
            {/* Protected Dashboard Routes */}
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
                    <Products />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            </Route>
            <Route path="/dashboard/locations">
              <ProtectedRoute>
                <DashboardLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Locations />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            </Route>
            
            {/* 404 Page */}
            <Route>
              <LandingLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <NotFound />
                </Suspense>
              </LandingLayout>
            </Route>
          </Switch>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
