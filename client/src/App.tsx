
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
const LocationsPage = React.lazy(() => import('@/pages/dashboard/locations'));
const StockMovementsPage = React.lazy(() => import('@/pages/dashboard/stock-movements'));
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
