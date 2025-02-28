import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Package,
  LogOut,
  Warehouse,
  Users,
  TrendingUp,
  ArrowRightLeft,
  BarChart3,
  Store,
  Truck,
  MoveHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

// Define sidebar items
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Stock Manager</h2>
          </div>
          <nav className="p-4 flex-grow">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Button
                    variant={location === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => (window.location.href = item.href)}
                  >
                    {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t mt-auto">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => logout()}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}

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
function App() {
  const [location] = useLocation();

  const renderRoute = () => {
    const currentRoute = routes.find((route) =>
      location.startsWith(route.path),
    );
    return currentRoute ? <currentRoute.component /> : <div>404 Not Found</div>;
  };
  return <DashboardLayout>{renderRoute()}</DashboardLayout>;
}

export default App;
