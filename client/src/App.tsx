
import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";

// Layouts
import { LandingLayout } from "@/components/layouts/landing-layout";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

// Landing pages
const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));

// Dashboard pages
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Products = lazy(() => import("@/pages/products"));
const Stock = lazy(() => import("@/pages/stock"));
const Locations = lazy(() => import("@/pages/locations"));
const Suppliers = lazy(() => import("@/pages/suppliers"));
const Customers = lazy(() => import("@/pages/customers"));
const Reports = lazy(() => import("@/pages/reports"));
const Settings = lazy(() => import("@/pages/settings"));
const TestAuth = lazy(() => import("@/pages/test-auth"));

export default function App() {
  return (
    <AuthProvider>
      <Switch>
        {/* Landing Routes */}
        <Route path="/">
          <LandingLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          </LandingLayout>
        </Route>
        <Route path="/login">
          <LandingLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Login />
            </Suspense>
          </LandingLayout>
        </Route>
        <Route path="/register">
          <LandingLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Register />
            </Suspense>
          </LandingLayout>
        </Route>
        <Route path="/test-auth">
          <Suspense fallback={<div>Loading...</div>}>
            <TestAuth />
          </Suspense>
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard">
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </Suspense>
          </DashboardLayout>
        </Route>
        <Route path="/products">
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Products />
            </Suspense>
          </DashboardLayout>
        </Route>
        <Route path="/stock">
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Stock />
            </Suspense>
          </DashboardLayout>
        </Route>
        <Route path="/locations">
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Locations />
            </Suspense>
          </DashboardLayout>
        </Route>
        <Route path="/suppliers">
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Suppliers />
            </Suspense>
          </DashboardLayout>
        </Route>
        <Route path="/customers">
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Customers />
            </Suspense>
          </DashboardLayout>
        </Route>
        <Route path="/reports">
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Reports />
            </Suspense>
          </DashboardLayout>
        </Route>
        <Route path="/settings">
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Settings />
            </Suspense>
          </DashboardLayout>
        </Route>
      </Switch>
      <Toaster />
    </AuthProvider>
  );
}
