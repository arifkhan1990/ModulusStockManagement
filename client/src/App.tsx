import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import AuthGuard from "./components/auth/AuthGuard";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/auth/login"));
const Register = lazy(() => import("./pages/auth/register"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Stock = lazy(() => import("./pages/dashboard/stock"));
const Orders = lazy(() => import("./pages/dashboard/orders"));
const Customers = lazy(() => import("./pages/dashboard/customers"));
const Reports = lazy(() => import("./pages/dashboard/reports"));
const Settings = lazy(() => import("./pages/dashboard/settings"));
const AdminFeatures = lazy(() => import("./pages/admin/features"));
const NotFound = lazy(() => import("./pages/404"));

// Loading fallback
const LoadingFallback = () => (
  <div className="app-loading">
    <div className="app-loading-spinner"></div>
  </div>
);

function App() {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Switch>
          {/* Public routes */}
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          {/* Protected routes */}
          <Route path="/dashboard">
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          </Route>

          <Route path="/dashboard/stock">
            <AuthGuard>
              <Stock />
            </AuthGuard>
          </Route>

          <Route path="/dashboard/orders">
            <AuthGuard>
              <Orders />
            </AuthGuard>
          </Route>

          <Route path="/dashboard/customers">
            <AuthGuard>
              <Customers />
            </AuthGuard>
          </Route>

          <Route path="/dashboard/reports">
            <AuthGuard>
              <Reports />
            </AuthGuard>
          </Route>

          <Route path="/dashboard/settings">
            <AuthGuard>
              <Settings />
            </AuthGuard>
          </Route>

          {/* Admin routes */}
          <Route path="/admin/features">
            <AuthGuard adminOnly>
              <AdminFeatures />
            </AuthGuard>
          </Route>

          {/* 404 route */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
