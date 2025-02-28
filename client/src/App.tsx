
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
