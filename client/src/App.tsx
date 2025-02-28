import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { queryClient } from "@/lib/query";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { LandingLayout } from "@/components/layouts/landing-layout";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { AdminLayout } from "@/components/layout/AdminLayout"; // Added import
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


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Placeholder authentication logic.  Replace with actual authentication.
  const isAuthenticated = true; // Replace with actual authentication check
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};

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
const NotificationsPage = lazy(() => import("@/pages/dashboard/notifications")); // Added
const SharingPage = lazy(() => import("@/pages/dashboard/sharing")); // Added
const DownloadsPage = lazy(() => import("@/pages/dashboard/downloads")); // Added
const AdminDashboard = lazy(() => import("@/pages/admin")); // Added
const AdminFeaturesPage = lazy(() => import("@/pages/admin/features")); // Added
const CompaniesPage = lazy(() => import("@/pages/admin/companies")); // Added
const SubscriptionTiersPage = lazy(() => import("@/pages/admin/subscription-tiers")); // Added
const AdminCompaniesDetailPage = lazy(() => import('@/pages/admin/companies/detail')); // Added
const AdminCompaniesNewPage = lazy(() => import('@/pages/admin/companies/new')); // Added
const AdminAnalyticsPage = lazy(() => import('@/pages/admin/analytics')); // Added
const AdminUsersPage = lazy(() => import('@/pages/admin/users')); // Added
const PosPage = lazy(() => import('@/pages/dashboard/pos')); // Added


export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <AuthProvider>
                <Suspense fallback={<LoadingSpinner />}>
                  <Router>
                    <Routes>
                      <Route path="/" element={<LandingLayout><HomePage /></LandingLayout>} />

                      <Route path="/auth/login" element={<LandingLayout><LoginPage /></LandingLayout>} />
                      <Route path="/auth/register" element={<LandingLayout><RegisterPage /></LandingLayout>} />
                      <Route path="/auth/forgot-password" element={<LandingLayout><ForgotPasswordPage /></LandingLayout>} />
                      <Route path="/auth/reset-password" element={<LandingLayout><ResetPasswordPage /></LandingLayout>} />

                      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Outlet /></DashboardLayout></ProtectedRoute>}>
                        <Route index element={<DashboardPage />} />
                        <Route path="stock" element={<Outlet />}>
                          <Route index element={<StockPage />} />
                          <Route path="movements" element={<StockMovementsPage />} /> {/* Added movements route */}
                        </Route>
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="locations" element={<LocationsPage />} />
                        <Route path="suppliers" element={<SuppliersPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="sharing" element={<SharingPage />} />
                        <Route path="downloads" element={<DownloadsPage />} />
                        <Route path="pos" element={<PosPage />} />
                        <Route path="profile" element={<div>Profile Page</div>} /> {/* Placeholder */}
                        <Route path="customers" element={<div>Customers Page</div>} /> {/* Placeholder */}
                        <Route path="reports" element={<div>Reports Page</div>} /> {/* Placeholder */}
                      </Route>

                      {/* Admin routes */}
                      <Route path="/admin" element={<ProtectedRoute><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>}> {/* Added ProtectedRoute */}
                        <Route index element={<AdminDashboard />} />
                        <Route path="features" element={<AdminFeaturesPage />} />
                        <Route path="subscription-tiers" element={<SubscriptionTiersPage />} />
                        <Route path="companies" element={<CompaniesPage />} />
                        <Route path="companies/:id" element={<AdminCompaniesDetailPage />} />
                        <Route path="companies/new" element={<AdminCompaniesNewPage />} />
                        <Route path="analytics" element={<AdminAnalyticsPage />} />
                        <Route path="users" element={<AdminUsersPage />} />
                      </Route>

                      <Route path="*" element={<LandingLayout><NotFoundPage /></LandingLayout>} />
                    </Routes>
                  </Router>
                  <Toaster />
                </Suspense>
              </AuthProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}