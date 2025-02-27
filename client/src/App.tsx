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

import { AuthProvider, useAuth } from "@/hooks/use-auth";
// Added Navbar component import
import Navbar from "@/components/navbar"; // Assuming the Navbar component is in this location
import Loading from "@/components/ui/loading";
import { useEffect } from "react";

// Import the new loading layout
import LoadingLayout from "@/components/layouts/loading-layout";

// Create a wrapper component to handle authentication
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
    return null; // Will redirect in useEffect
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard">
        {(params) => (
          <AuthWrapper component={DashboardLayout} params={params} />
        )}
      </Route>
      <Route path="/dashboard/products">
        {(params) => <AuthWrapper component={ProductsPage} params={params} />}
      </Route>
      <Route path="/dashboard/stock-movements">
        {(params) => (
          <AuthWrapper component={StockMovementsPage} params={params} />
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
        {/* Added Navbar component */}
        <Navbar />
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
