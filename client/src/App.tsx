
import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Layouts
import { LandingLayout } from "@/components/layouts/landing-layout";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

// Landing pages
const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));

// Dashboard pages
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Products = lazy(() => import("@/pages/dashboard/products"));
const Stock = lazy(() => import("@/pages/stock"));
const Locations = lazy(() => import("@/pages/dashboard/locations"));
const Suppliers = lazy(() => import("@/pages/dashboard/suppliers"));
const Customers = lazy(() => import("@/pages/customers"));
const Reports = lazy(() => import("@/pages/reports"));
const Settings = lazy(() => import("@/pages/settings"));
const TestAuth = lazy(() => import("@/pages/test-auth"));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Switch>
            {/* Public routes */}
            <Route path="/">
              <LandingLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Home />
                </Suspense>
              </LandingLayout>
            </Route>
            <Route path="/login">
              <LandingLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Login />
                </Suspense>
              </LandingLayout>
            </Route>
            <Route path="/register">
              <LandingLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Register />
                </Suspense>
              </LandingLayout>
            </Route>

            {/* Dashboard routes */}
            <Route path="/dashboard">
              <DashboardLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Dashboard />
                </Suspense>
              </DashboardLayout>
            </Route>
            <Route path="/products">
              <DashboardLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Products />
                </Suspense>
              </DashboardLayout>
            </Route>
            <Route path="/stock">
              <DashboardLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Stock />
                </Suspense>
              </DashboardLayout>
            </Route>
            <Route path="/locations">
              <DashboardLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Locations />
                </Suspense>
              </DashboardLayout>
            </Route>
            <Route path="/suppliers">
              <DashboardLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Suppliers />
                </Suspense>
              </DashboardLayout>
            </Route>
            <Route path="/customers">
              <DashboardLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Customers />
                </Suspense>
              </DashboardLayout>
            </Route>
            <Route path="/reports">
              <DashboardLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Reports />
                </Suspense>
              </DashboardLayout>
            </Route>
            <Route path="/settings">
              <DashboardLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Settings />
                </Suspense>
              </DashboardLayout>
            </Route>
            <Route path="/test-auth">
              <DashboardLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <TestAuth />
                </Suspense>
              </DashboardLayout>
            </Route>

            {/* 404 fallback */}
            <Route>
              <LandingLayout>
                <div className="container flex h-screen items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold">404</h1>
                    <p className="mt-4 text-lg">Page not found</p>
                  </div>
                </div>
              </LandingLayout>
            </Route>
          </Switch>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
