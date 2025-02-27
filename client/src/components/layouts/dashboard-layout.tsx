import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Package,
  Warehouse,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  ArrowRightLeft
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: Warehouse, label: "Inventory", href: "/dashboard/inventory" },
  { icon: Users, label: "Suppliers", href: "/dashboard/suppliers" },
  { icon: TrendingUp, label: "Reports", href: "/dashboard/reports" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: ArrowRightLeft, label: "Stock Movements", href: "/dashboard/stock-movements" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/" className="text-2xl font-bold text-primary">
            MSM
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                        location === item.href
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-100"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute bottom-4 w-64 px-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-16 bg-white border-b" /> {/* Header spacer */}
        {children}
      </main>
    </div>
  );
}