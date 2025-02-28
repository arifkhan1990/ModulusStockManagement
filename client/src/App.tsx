
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import ProductsPage from "@/pages/dashboard/products";
import StockMovementsPage from "@/pages/dashboard/stock-movements";
import LocationsPage from "@/pages/dashboard/locations";
import Products from "@/pages/products";
import Stock from "@/pages/stock";

import { AuthProvider, useAuth } from "@/providers/auth-provider";
import RootLayout from "@/components/layouts/root-layout";

// Auth check component that redirects if not authenticated
function ProtectedRoute({ component: Component, ...rest }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) {
    return null; // RootLayout will handle showing LoadingLayout
  }

  return <Component {...rest} />;
}

// Simple component wrapper
function PublicRoute({ component: Component, ...rest }) {
  return <Component {...rest} />;
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" exact>
        {(params) => <ProtectedRoute component={Dashboard} params={params} />}
      </Route>
      <Route path="/dashboard/products">
        {(params) => (
          <ProtectedRoute component={ProductsPage} params={params} />
        )}
      </Route>
      <Route path="/dashboard/stock-movements">
        {(params) => (
          <ProtectedRoute component={StockMovementsPage} params={params} />
        )}
      </Route>
      <Route path="/dashboard/locations">
        {(params) => (
          <ProtectedRoute component={LocationsPage} params={params} />
        )}
      </Route>

      {/* Public Product/Stock Routes */}
      <Route path="/products" component={Products} />
      <Route path="/stock" component={Stock} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayout>
          <AppRouter />
        </RootLayout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SkeletonPage } from '@/components/ui/skeleton';
import { AuthProvider } from '@/hooks/use-auth';

// Lazy-loaded components for better performance
const DashboardLayout = React.lazy(() => import('@/components/layouts/dashboard-layout'));
const AuthPage = React.lazy(() => import('@/pages/auth'));
const HomePage = React.lazy(() => import('@/pages/home'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard'));
const ProductsPage = React.lazy(() => import('@/pages/products'));
const LocationsPage = React.lazy(() => import('@/pages/locations'));
const StockMovementsPage = React.lazy(() => import('@/pages/stock-movements'));
const ProfilePage = React.lazy(() => import('@/pages/profile'));
const SettingsPage = React.lazy(() => import('@/pages/settings'));
const NotificationsPage = React.lazy(() => import('@/pages/notifications'));

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/auth">
            <Suspense fallback={<SkeletonPage />}>
              <AuthPage />
            </Suspense>
          </Route>
          
          <Route path="/">
            <Suspense fallback={<SkeletonPage />}>
              <HomePage />
            </Suspense>
          </Route>
          
          <Route path="/dashboard">
            <Suspense fallback={<SkeletonPage />}>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </Suspense>
          </Route>
          
          <Route path="/dashboard/products">
            <Suspense fallback={<SkeletonPage />}>
              <DashboardLayout>
                <ProductsPage />
              </DashboardLayout>
            </Suspense>
          </Route>
          
          <Route path="/dashboard/locations">
            <Suspense fallback={<SkeletonPage />}>
              <DashboardLayout>
                <LocationsPage />
              </DashboardLayout>
            </Suspense>
          </Route>
          
          <Route path="/dashboard/stock-movements">
            <Suspense fallback={<SkeletonPage />}>
              <DashboardLayout>
                <StockMovementsPage />
              </DashboardLayout>
            </Suspense>
          </Route>
          
          <Route path="/dashboard/profile">
            <Suspense fallback={<SkeletonPage />}>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </Suspense>
          </Route>
          
          <Route path="/dashboard/settings">
            <Suspense fallback={<SkeletonPage />}>
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </Suspense>
          </Route>
          
          <Route path="/dashboard/notifications">
            <Suspense fallback={<SkeletonPage />}>
              <DashboardLayout>
                <NotificationsPage />
              </DashboardLayout>
            </Suspense>
          </Route>
          
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </AuthProvider>
    </QueryClientProvider>
  );
}
