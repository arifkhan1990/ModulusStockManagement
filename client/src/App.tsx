import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Route, Switch } from "wouter";
import { queryClient } from "@/lib/query";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { LandingLayout } from "@/components/layouts/landing-layout";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { ThemeProvider } from "@/contexts/theme-context";
import { LanguageProvider } from "@/contexts/language-context";
import { CurrencyProvider } from "@/contexts/currency-context";
import HomePage from "@/pages/home";
import NotFoundPage from "@/pages/not-found";

// Error boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Loading spinner component
const LoadingSpinner = () => {
  return <div className="flex items-center justify-center h-screen">Loading...</div>;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <AuthProvider>
                <Suspense fallback={<LoadingSpinner />}>
                  <Switch>
                    <Route path="/">
                      <LandingLayout>
                        <HomePage />
                      </LandingLayout>
                    </Route>

                    <Route path="/auth/login">
                      <LandingLayout>
                        <LoginPage />
                      </LandingLayout>
                    </Route>

                    <Route path="/auth/register">
                      <LandingLayout>
                        <RegisterPage />
                      </LandingLayout>
                    </Route>

                    <Route path="/auth/forgot-password">
                      <LandingLayout>
                        <ForgotPasswordPage />
                      </LandingLayout>
                    </Route>

                    <Route path="/auth/reset-password">
                      <LandingLayout>
                        <ResetPasswordPage />
                      </LandingLayout>
                    </Route>

                    {/* Dashboard routes */}
                    <Route path="/dashboard">
                      <ProtectedRoute>
                        <DashboardLayout>
                          <DashboardPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    </Route>

                    {/* Stock management routes */}
                    <Route path="/dashboard/stock">
                      <ProtectedRoute>
                        <DashboardLayout>
                          <StockPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    </Route>

                    <Route path="/dashboard/stock/movements">
                      <ProtectedRoute>
                        <DashboardLayout>
                          <StockMovementsPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    </Route>

                    {/* Products routes */}
                    <Route path="/dashboard/products">
                      <ProtectedRoute>
                        <DashboardLayout>
                          <ProductsPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    </Route>

                    {/* Locations routes */}
                    <Route path="/dashboard/locations">
                      <ProtectedRoute>
                        <DashboardLayout>
                          <LocationsPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    </Route>

                    {/* Suppliers routes */}
                    <Route path="/dashboard/suppliers">
                      <ProtectedRoute>
                        <DashboardLayout>
                          <SuppliersPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    </Route>

                    {/* Customers routes - will be implemented later */}
                    <Route path="/dashboard/customers">
                      <ProtectedRoute>
                        <DashboardLayout>
                          <div className="container py-8">
                            <h1 className="text-3xl font-bold">Customers</h1>
                            <p className="mt-4">Coming soon...</p>
                          </div>
                        </DashboardLayout>
                      </ProtectedRoute>
                    </Route>

                    {/* Reports routes - will be implemented later */}
                    <Route path="/dashboard/reports">
                      <ProtectedRoute>
                        <DashboardLayout>
                          <div className="container py-8">
                            <h1 className="text-3xl font-bold">Reports</h1>
                            <p className="mt-4">Coming soon...</p>
                          </div>
                        </DashboardLayout>
                      </ProtectedRoute>
                    </Route>

                    {/* Settings routes */}
                    <Route path="/dashboard/settings">
                      <ProtectedRoute>
                        <DashboardLayout>
                          <SettingsPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    </Route>

                    {/* Profile routes - will be implemented later */}
                    <Route path="/dashboard/profile">
                      <ProtectedRoute>
                        <DashboardLayout>
                          <div className="container py-8">
                            <h1 className="text-3xl font-bold">Profile</h1>
                            <p className="mt-4">Coming soon...</p>
                          </div>
                        </DashboardLayout>
                      </ProtectedRoute>
                    </Route>

                    {/* 404 route */}
                    <Route>
                      <LandingLayout>
                        <NotFoundPage />
                      </LandingLayout>
                    </Route>
                  </Switch>
                </Suspense>
                <Toaster />
              </AuthProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// Lazy loaded page components
const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/register"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/forgot-password"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/reset-password"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const ProductsPage = lazy(() => import("@/pages/dashboard/products"));
const LocationsPage = lazy(() => import("@/pages/dashboard/locations"));
const StockPage = lazy(() => import("@/pages/dashboard/stock"));
const StockMovementsPage = lazy(() => import("@/pages/dashboard/stock/movements"));
const SuppliersPage = lazy(() => import("@/pages/dashboard/suppliers"));
const SettingsPage = lazy(() => import("@/pages/dashboard/settings"));