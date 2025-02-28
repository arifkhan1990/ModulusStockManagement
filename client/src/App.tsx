import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { queryClient } from "@/lib/query";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { LandingLayout } from "@/components/layouts/landing-layout";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ThemeProvider } from "@/contexts/theme-context";
import { LanguageProvider } from "@/contexts/language-context";
import { CurrencyProvider } from "@/contexts/currency-context";
import HomePage from "@/pages/home";
import NotFoundPage from "@/pages/not-found";
import NotificationsPage from "@/pages/dashboard/notifications"; // Added import
import SharingPage from "@/pages/dashboard/sharing"; // Added import
import DownloadsPage from "@/pages/dashboard/downloads"; // Added import
import InvoicesPage from "@/pages/dashboard/invoices"; // Added import
import PreferencesPage from "@/pages/dashboard/settings/preferences"; // Added import


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
const AdminDashboard = lazy(() => import("@/pages/admin"));
const AdminFeaturesPage = lazy(() => import("@/pages/admin/features"));
const CompaniesPage = lazy(() => import("@/pages/admin/companies"));
const SubscriptionTiersPage = lazy(() => import("@/pages/admin/subscription-tiers"));
const AdminCompaniesDetailPage = lazy(() => import('@/pages/admin/companies/detail'));
const AdminCompaniesNewPage = lazy(() => import('@/pages/admin/companies/new'));
const AdminAnalyticsPage = lazy(() => import('@/pages/admin/analytics'));
const AdminUsersPage = lazy(() => import('@/pages/admin/users'));
const PosPage = lazy(() => import('@/pages/dashboard/pos'));


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
                          <Route path="movements" element={<StockMovementsPage />} />
                        </Route>
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="locations" element={<LocationsPage />} />
                        <Route path="suppliers" element={<SuppliersPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="sharing" element={<SharingPage />} />
                        <Route path="downloads" element={<DownloadsPage />} />
                        <Route path="pos" element={<PosPage />} />
                        <Route path="invoices" element={<InvoicesPage />} /> {/* Added invoices route */}
                        <Route path="settings/preferences" element={<PreferencesPage />} /> {/* Added preferences route */}
                        <Route path="profile" element={<div>Profile Page</div>} />
                        <Route path="customers" element={<div>Customers Page</div>} />
                        <Route path="reports" element={<div>Reports Page</div>} />
                      </Route>

                      <Route path="/admin" element={<ProtectedRoute><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>}>
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