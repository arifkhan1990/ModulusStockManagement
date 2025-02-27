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
import LocationsPage from "@/pages/dashboard/locations"; // Added LocationsPage import
import Dashboard from "@/pages/dashboard"; // Added Dashboard import
// Added imports for new pages (assuming these exist or will be created)
import Products from "@/pages/products";
import Stock from "@/pages/stock";

import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";
import Loading from "@/components/ui/loading";
import { useEffect } from "react";
import LoadingLayout from "@/components/layouts/loading-layout";

function AuthWrapper({ component: Component, ...rest }) {
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

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" exact>
        {(params) => (
          <AuthWrapper component={Dashboard} params={params} />
        )}
      </Route>
      <Route path="/dashboard/products">
        {(params) => (
          <AuthWrapper component={ProductsPage} params={params} />
        )}
      </Route>
      <Route path="/dashboard/stock-movements">
        {(params) => (
          <AuthWrapper component={StockMovementsPage} params={params} />
        )}
      </Route>
      <Route path="/dashboard/locations"> {/* Added route for LocationsPage */}
        {(params) => (
          <AuthWrapper component={LocationsPage} params={params} />
        )}
      </Route>
      <Route path="/products"> {/* Added route for Products */}
        {(params) => (
          <AuthWrapper component={Products} params={params} />
        )}
      </Route>
      <Route path="/stock"> {/* Added route for Stock */}
        {(params) => (
          <AuthWrapper component={Stock} params={params} />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navbar />
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;