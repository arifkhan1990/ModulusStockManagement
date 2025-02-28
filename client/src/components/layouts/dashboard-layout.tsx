import React from "react";
import { useLocation, Redirect } from "wouter";
import { Navbar } from "@/components/navigation/navbar";
import { DrawerMenu } from "@/components/navigation/drawer-menu";
import { useSidebar } from "@/hooks/use-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SkeletonPage } from "@/components/ui/skeleton";
import { ArrowRightLeft, LayoutGrid, Package, Warehouse } from "lucide-react";

export default function DashboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, user } = useAuth();
  const { isOpen, toggle } = useSidebar();

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Redirect to="/auth" />;
  }

  // Show skeleton loader while checking auth
  if (isLoading) {
    return <SkeletonPage />;
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col">
        <Navbar toggleSidebar={toggle} />
        <div className="flex flex-1 flex-col md:flex-row">
          <DrawerMenu isOpen={isOpen} toggleSidebar={toggle} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
const sidebarItems = [
  {
    href: "/dashboard",
    icon: LayoutGrid,
    label: "Dashboard",
  },
  {
    href: "/dashboard/products",
    icon: Package,
    label: "Products",
  },
  {
    href: "/dashboard/locations",
    icon: Warehouse,
    label: "Locations",
  },
  {
    href: "/dashboard/stock-movements",
    icon: ArrowRightLeft,
    label: "Stock Movements",
  },
];

// Custom component to handle navigation items
const NavItem = ({ href, icon: Icon, children, isActive }) => {
  return (
    <li>
      <div
        onClick={() => (window.location.href = href)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary cursor-pointer",
          isActive ? "bg-secondary text-primary" : "hover:bg-secondary",
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{children}</span>
      </div>
    </li>
  );
};

// Placeholder components - Replace with your actual implementation
const Dashboard = () => <div>Dashboard Content</div>;
const Products = () => <div>Products Content</div>;
const Inventory = () => <div>Inventory Content</div>;
const Suppliers = () => <div>Suppliers Content</div>;
const Reports = () => <div>Reports Content</div>;
const Settings = () => <div>Settings Content</div>;
const StockMovements = () => <div>Stock Movements Content</div>;
const Locations = () => <div>Locations Content</div>;

// Example Route Configuration (adapt to your routing library)
const routes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/dashboard/products", component: Products },
  { path: "/dashboard/inventory", component: Inventory },
  { path: "/dashboard/suppliers", component: Suppliers },
  { path: "/dashboard/reports", component: Reports },
  { path: "/dashboard/settings", component: Settings },
  { path: "/dashboard/stock-movements", component: StockMovements },
  { path: "/dashboard/locations", component: Locations },
];

//Example App.tsx (Adapt this to your actual routing setup)
function DashboardLayout() {
  const [location] = useLocation();

  const renderRoute = () => {
    const currentRoute = routes.find((route) =>
      location.startsWith(route.path),
    );
    return currentRoute ? <currentRoute.component /> : <div>404 Not Found</div>;
  };
  return <DashboardPage>{renderRoute()}</DashboardPage>;
}

export { DashboardLayout };
