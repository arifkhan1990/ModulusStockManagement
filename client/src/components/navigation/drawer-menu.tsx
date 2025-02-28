import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Box,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Store,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface DrawerMenuProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function DrawerMenu({ isOpen, toggleSidebar }: DrawerMenuProps) {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-lg transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:relative lg:translate-x-0"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
          <div className="flex items-center gap-2 font-semibold">
            <Box className="h-5 w-5" />
            <span>Modulus MSM</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <NavItem
              href="/dashboard"
              icon={LayoutDashboard}
              isActive={location === "/dashboard"}
              onClick={toggleSidebar}
            >
              Dashboard
            </NavItem>
            <NavItem
              href="/products"
              icon={Package}
              isActive={location === "/products"}
              onClick={toggleSidebar}
            >
              Products
            </NavItem>
            <NavItem
              href="/stock"
              icon={Box}
              isActive={location === "/stock"}
              onClick={toggleSidebar}
            >
              Stock
            </NavItem>
            <NavItem
              href="/locations"
              icon={Store}
              isActive={location === "/locations"}
              onClick={toggleSidebar}
            >
              Locations
            </NavItem>
            <NavItem
              href="/suppliers"
              icon={Truck}
              isActive={location === "/suppliers"}
              onClick={toggleSidebar}
            >
              Suppliers
            </NavItem>
            <NavItem
              href="/customers"
              icon={Users}
              isActive={location === "/customers"}
              onClick={toggleSidebar}
            >
              Customers
            </NavItem>
            <NavItem
              href="/reports"
              icon={BarChart3}
              isActive={location === "/reports"}
              onClick={toggleSidebar}
            >
              Reports
            </NavItem>
            <NavItem
              href="/settings"
              icon={Settings}
              isActive={location === "/settings"}
              onClick={toggleSidebar}
            >
              Settings
            </NavItem>
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              logout();
              toggleSidebar();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavItem({
  href,
  icon: Icon,
  isActive,
  children,
  onClick,
}: NavItemProps) {
  const [, setLocation] = useLocation();

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start"
      onClick={() => {
        setLocation(href);
        if (onClick) {
          onClick();
        }
      }}
    >
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}