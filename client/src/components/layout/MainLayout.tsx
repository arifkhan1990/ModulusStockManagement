
import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <motion.main 
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
          <Footer />
        </motion.main>
      </div>
    </div>
  );
}
import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../hooks/useAuth";
import { 
  LayoutGrid, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  LogOut,
  Moon,
  Sun,
  LucideIcon
} from "lucide-react";
import { useTheme } from "../../providers/ThemeProvider";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href}>
      <a className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted"
      }`}>
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </a>
    </Link>
  );
}

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
    { href: "/dashboard/stock", icon: Package, label: "Stock" },
    { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/dashboard/customers", icon: Users, label: "Customers" },
    { href: "/dashboard/reports", icon: BarChart3, label: "Reports" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden ${
        sidebarOpen ? "block" : "hidden"
      }`} onClick={toggleSidebar} />
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 border-r bg-card transition-transform lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:z-0`}>
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard">
            <a className="flex items-center font-bold text-lg text-primary">
              MSM
            </a>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto lg:hidden" 
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <NavItem 
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={location === item.href}
            />
          ))}
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b bg-card flex items-center px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden mr-2" 
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          
          <div className="ml-auto flex items-center space-x-2">
            {/* Theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:inline-block">
                    {user?.name || "User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <a className="w-full flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
