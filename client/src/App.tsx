
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import ProductsPage from "@/pages/dashboard/products";
import StockMovementsPage from "@/pages/dashboard/stock-movements";
import LocationsPage from "@/pages/dashboard/locations";
import Dashboard from "@/pages/dashboard";
import Products from "@/pages/products";
import Stock from "@/pages/stock";

import { AuthProvider } from "@/providers/auth-provider";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";
import LoadingLayout from "@/components/layouts/loading-layout";
import { useEffect } from "react";

// Protected route component with dashboard layout
function ProtectedRoute({ component: Component, ...rest }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return <LoadingLayout />;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <Component {...rest} />
    </DashboardLayout>
  );
}

// Public routes
function PublicRoute({ component: Component, showNavbar = true, ...rest }) {
  return (
    <>
      {showNavbar && <Navbar />}
      <Component {...rest} />
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={(props) => <PublicRoute component={Home} {...props} />} />
      <Route path="/auth" component={(props) => <PublicRoute component={Auth} showNavbar={false} {...props} />} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" exact>
        {(params) => <ProtectedRoute component={Dashboard} params={params} />}
      </Route>
      <Route path="/dashboard/products">
        {(params) => <ProtectedRoute component={ProductsPage} params={params} />}
      </Route>
      <Route path="/dashboard/stock-movements">
        {(params) => <ProtectedRoute component={StockMovementsPage} params={params} />}
      </Route>
      <Route path="/dashboard/locations">
        {(params) => <ProtectedRoute component={LocationsPage} params={params} />}
      </Route>
      
      {/* Public Product/Stock Routes */}
      <Route path="/products">
        {(params) => <PublicRoute component={Products} {...params} />}
      </Route>
      <Route path="/stock">
        {(params) => <PublicRoute component={Stock} {...params} />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
