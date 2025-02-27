import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LayoutGrid, Package, Warehouse, Users, TrendingUp, Settings, ArrowRightLeft, Store, LogOut } from "lucide-react";

import {
  LayoutGrid,
  Package,
  Warehouse,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  ArrowRightLeft,
  BarChart3,
  Store,
  Truck,
  MoveHorizontal,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';


// Custom component to handle navigation items
const NavItem = ({ href, icon: Icon, children, isActive }) => {
  return (
    <li>
      <div 
        onClick={() => window.location.href = href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary cursor-pointer",
          isActive ? "bg-secondary text-primary" : "hover:bg-secondary"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{children}</span>
      </div>
    </li>
  );
};

const sidebarItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: Warehouse, label: "Inventory", href: "/dashboard/inventory" },
  { icon: Users, label: "Suppliers", href: "/dashboard/suppliers" },
  { icon: TrendingUp, label: "Reports", href: "/dashboard/reports" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: ArrowRightLeft, label: "Stock Movements", href: "/dashboard/stock-movements" },
  { icon: Store, label: "Locations", href: "/dashboard/locations" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();

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
            {sidebarItems.map((item) => (
              <li key={item.href} className={`rounded-md ${location === item.href ? 'bg-primary/10' : ''}`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2"
                  onClick={() => window.location.href = item.href}
                >
                  {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-4 w-64 px-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => logout()}
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
  { path: '/dashboard', component: Dashboard },
  { path: '/dashboard/products', component: Products },
  { path: '/dashboard/inventory', component: Inventory },
  { path: '/dashboard/suppliers', component: Suppliers },
  { path: '/dashboard/reports', component: Reports },
  { path: '/dashboard/settings', component: Settings },
  { path: '/dashboard/stock-movements', component: StockMovements },
  { path: '/dashboard/locations', component: Locations },
];


//Example App.tsx (Adapt this to your actual routing setup)
function App() {
    const [location] = useLocation();

  const renderRoute = () => {
    const currentRoute = routes.find(route => location.startsWith(route.path));
    return currentRoute ? <currentRoute.component /> : <div>404 Not Found</div>;
  };
    return (
    <DashboardLayout>
      {renderRoute()}
    </DashboardLayout>
  );
}

export default App;