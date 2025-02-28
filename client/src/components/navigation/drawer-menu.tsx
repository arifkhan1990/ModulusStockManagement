
import React from 'react';
import { useLocation, Link } from 'wouter';
import {
  LayoutGrid,
  Package,
  Warehouse,
  TrendingUp,
  ArrowRightLeft,
  Settings,
  User,
  Bell,
  LogOut,
  ChevronDown,
  Home,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useNotifications } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

interface DrawerMenuProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: number | string;
  children?: Omit<MenuItem, 'icon' | 'children'>[];
}

export function DrawerMenu({ isOpen, toggleSidebar }: DrawerMenuProps) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Memoize menu items to prevent unnecessary re-renders
  const menuItems = React.useMemo<MenuItem[]>(() => [
    {
      title: 'Dashboard',
      icon: <LayoutGrid className="h-5 w-5" />,
      path: '/dashboard',
    },
    {
      title: 'Products',
      icon: <Package className="h-5 w-5" />,
      path: '/dashboard/products',
    },
    {
      title: 'Locations',
      icon: <Warehouse className="h-5 w-5" />,
      path: '/dashboard/locations',
    },
    {
      title: 'Stock Movements',
      icon: <ArrowRightLeft className="h-5 w-5" />,
      path: '/dashboard/stock-movements',
    },
    {
      title: 'Analytics',
      icon: <TrendingUp className="h-5 w-5" />,
      path: '/dashboard/analytics',
      children: [
        {
          title: 'Sales Report',
          path: '/dashboard/analytics/sales',
        },
        {
          title: 'Inventory Report',
          path: '/dashboard/analytics/inventory',
        },
      ],
    },
    {
      title: 'Profile',
      icon: <User className="h-5 w-5" />,
      path: '/dashboard/profile',
    },
    {
      title: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      path: '/dashboard/notifications',
      badge: unreadCount || undefined,
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/dashboard/settings',
      children: [
        {
          title: 'General',
          path: '/dashboard/settings/general',
        },
        {
          title: 'Appearance',
          path: '/dashboard/settings/appearance',
        },
        {
          title: 'Notifications',
          path: '/dashboard/settings/notifications',
        },
      ],
    },
  ], [unreadCount]);

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16",
        "md:relative"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <div className={cn("flex items-center", !isOpen && "md:justify-center")}>
          <Link href="/dashboard" className="flex items-center">
            <Home className="h-6 w-6 text-primary" />
            <span className={cn("ml-2 text-lg font-semibold", !isOpen && "md:hidden")}>
              MSM
            </span>
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 md:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-1 px-2">
          {menuItems.map((item) => 
            item.children ? (
              <Accordion
                type="single"
                collapsible
                key={item.path}
                className={cn(!isOpen && "md:hidden")}
              >
                <AccordionItem value={item.title} className="border-none">
                  <AccordionTrigger 
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm",
                      "hover:bg-accent hover:text-accent-foreground",
                      location.startsWith(item.path) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-1 pl-4 pt-1">
                      {item.children.map((child) => (
                        <Link key={child.path} href={child.path}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start",
                              location === child.path && "bg-accent text-accent-foreground"
                            )}
                          >
                            <span className="text-sm">{child.title}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    location === item.path && "bg-accent text-accent-foreground",
                    !isOpen && "md:justify-center"
                  )}
                >
                  {item.icon}
                  <span className={cn("ml-2", !isOpen && "md:hidden")}>
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className={cn(
                      "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground",
                      !isOpen && "md:ml-0 md:absolute md:top-0 md:right-0"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            )
          )}
        </nav>
      </ScrollArea>
      
      <div className="border-t p-2">
        <Button 
          variant="destructive" 
          className={cn("w-full", !isOpen && "md:p-2")}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className={cn("ml-2", !isOpen && "md:hidden")}>
            Log out
          </span>
        </Button>
      </div>
    </div>
  );
}
