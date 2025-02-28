import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  TruckIcon, 
  UsersIcon, 
  BarChart3, 
  Settings, 
  User,
  ArrowRightLeft, 
  Bell
} from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { useLanguage } from "@/contexts/language-context";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    { href: "/dashboard", label: t('dashboard'), icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/dashboard/stock", label: t('stock'), icon: <ArrowRightLeft className="h-4 w-4" /> },
    { href: "/dashboard/products", label: t('products'), icon: <Package className="h-4 w-4" /> },
    { href: "/dashboard/locations", label: t('locations'), icon: <MapPin className="h-4 w-4" /> },
    { href: "/dashboard/suppliers", label: t('suppliers'), icon: <TruckIcon className="h-4 w-4" /> },
    { href: "/dashboard/customers", label: t('customers'), icon: <UsersIcon className="h-4 w-4" /> },
    { href: "/dashboard/reports", label: t('reports'), icon: <BarChart3 className="h-4 w-4" /> },
  ];

  const bottomMenuItems = [
    { href: "/dashboard/notifications", label: t('notifications'), icon: <Bell className="h-4 w-4" /> },
    { href: "/dashboard/settings", label: t('settings'), icon: <Settings className="h-4 w-4" /> },
    { href: "/dashboard/profile", label: t('profile'), icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/40 pt-6 hidden md:block">
          <nav className="grid gap-1 px-2">
            <div className="px-3 pb-2 text-xs font-medium text-muted-foreground">
              Main Navigation
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                  location === item.href || location.startsWith(`${item.href}/`)
                    ? "bg-muted font-medium"
                    : "hover:bg-muted/80"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            <div className="mt-6 px-3 py-2 text-xs font-medium text-muted-foreground">
              User
            </div>
            {bottomMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                  location === item.href || location.startsWith(`${item.href}/`)
                    ? "bg-muted font-medium"
                    : "hover:bg-muted/80"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}