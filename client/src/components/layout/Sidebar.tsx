import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { SheetContent, SheetTrigger } from '../ui/sheet';
import { FeatureToggle } from '../saas/FeatureToggle';
import { useAuth } from '../../hooks/use-auth';
import { 
  ChevronRight, 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings, 
  BarChart,
  LayoutDashboard,
  CreditCard,
  Bell,
  Share2,
  Download,
  Store,
  FileBarChart,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Track open menu sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    stock: true,
    sales: false,
    customers: false,
    reports: false,
    settings: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  const pathMatches = (href:string) => {
    return location.pathname.startsWith(href);
  }

  const sidebarVariants = {
    open: { width: 260, transition: { duration: 0.2 } },
    closed: { width: 0, transition: { duration: 0.2 } }
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/dashboard',
    },
    {
      id: 'stock',
      label: t('stockManagement'),
      icon: <Package className="h-5 w-5" />,
      path: '/dashboard/stock',
      submenu: [
        { label: t('products'), path: '/dashboard/stock' },
        { label: t('stockMovements'), path: '/dashboard/stock/movements' },
        { label: t('categories'), path: '/dashboard/stock/categories' },
        { label: t('locations'), path: '/dashboard/stock/locations' },
      ],
    },
    {
      id: 'sales',
      label: t('sales'),
      icon: <ShoppingCart className="h-5 w-5" />,
      path: '/dashboard/sales',
      submenu: [
        { label: t('orders'), path: '/dashboard/sales/orders' },
        { label: t('invoices'), path: '/dashboard/sales/invoices' },
        { label: t('payments'), path: '/dashboard/sales/payments' },
        { label: t('pos'), path: '/dashboard/sales/pos' }, // Added POS link
      ],
    },
    {
      id: 'customers',
      label: t('customers'),
      icon: <Users className="h-5 w-5" />,
      path: '/dashboard/customers',
      submenu: [
        { label: t('customerList'), path: '/dashboard/customers' },
        { label: t('segments'), path: '/dashboard/customers/segments' },
      ],
    },
    {
      feature: 'reports',
      id: 'reports',
      label: t('reports'),
      icon: <FileBarChart className="h-5 w-5" />,
      path: '/dashboard/reports',
      submenu: [
        { label: t('salesReports'), path: '/dashboard/reports/sales' },
        { label: t('inventoryReports'), path: '/dashboard/reports/inventory' },
        { label: t('financialReports'), path: '/dashboard/reports/financial' },
      ],
    },
    {
      feature: 'notifications',
      id: 'notifications',
      label: t('notifications'),
      icon: <Bell className="h-5 w-5" />,
      path: '/dashboard/notifications',
    },
    {
      feature: 'sharing',
      id: 'sharing',
      label: t('sharing'),
      icon: <Share2 className="h-5 w-5" />,
      path: '/dashboard/sharing',
    },
    {
      id: 'settings',
      label: t('settings'),
      icon: <Settings className="h-5 w-5" />,
      path: '/dashboard/settings',
      submenu: [
        { label: t('profile'), path: '/dashboard/settings/profile' },
        { label: t('companySettings'), path: '/dashboard/settings/company' },
        { label: t('users'), path: '/dashboard/settings/users' },
        { label: t('features'), path: '/dashboard/settings/features' },
        { label: t('preferences'), path: '/dashboard/settings/preferences' },
      ],
    },
    {
      feature: 'billing',
      id: 'billing',
      label: t('billing'),
      icon: <CreditCard className="h-5 w-5" />,
      path: '/dashboard/billing',
    },
  ];

  const adminLinks = [
    { name: t('dashboard'), href: '/admin', icon: LayoutDashboard },
    { name: t('features'), href: '/admin/features', icon: <Puzzle /> },
    { name: t('subscriptionTiers'), href: '/admin/subscription-tiers', icon: <Tag /> },
    { name: t('companies'), href: '/admin/companies', icon: <Building2 /> },
    { name: t('analytics'), href: '/admin/analytics', icon: <BarChart /> },
  ];

  const settingsLinks = [
    { name: t('preferences'), href: '/dashboard/settings/preferences', icon: <Settings /> },
  ];


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0 }}
          animate="open"
          exit="closed"
          variants={sidebarVariants}
          className="border-r dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden z-20 fixed md:relative h-full left-0 top-0"
        >
          <div className="flex h-16 items-center border-b px-4 dark:border-gray-800">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="text-lg font-bold">M</span>
              </div>
              <span className="text-xl">Modulus</span>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="ml-auto md:hidden"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="px-3 py-2">
              <div className="mb-4 px-4 py-2">
                <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider">
                  {user?.company?.name || 'Your Company'}
                </p>
              </div>

              <nav className="space-y-1 px-1">
                {menuItems.map((item) => {
                  // If the item has a feature flag, wrap it with FeatureToggle
                  const menuItem = (
                    <div key={item.id} className="mb-1">
                      {item.submenu ? (
                        <Collapsible
                          open={openSections[item.id]}
                          onOpenChange={() => toggleSection(item.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-between font-normal h-10",
                                (item.submenu && item.submenu.some(subitem => isLinkActive(subitem.path))) && 
                                "bg-muted text-primary font-medium"
                              )}
                            >
                              <div className="flex items-center">
                                {item.icon}
                                <span className="ml-3">{item.label}</span>
                              </div>
                              <ChevronDown className={cn(
                                "h-4 w-4 transition-transform",
                                openSections[item.id] && "transform rotate-180"
                              )} />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-9 space-y-1 mt-1">
                            {item.submenu.map((subitem) => (
                              <Button
                                key={subitem.path}
                                variant="ghost"
                                asChild
                                className={cn(
                                  "w-full justify-start font-normal h-9",
                                  isLinkActive(subitem.path) && "bg-muted text-primary font-medium"
                                )}
                              >
                                <Link to={subitem.path}>{subitem.label}</Link>
                              </Button>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <Button
                          variant="ghost"
                          asChild
                          className={cn(
                            "w-full justify-start font-normal h-10",
                            isLinkActive(item.path) && "bg-muted text-primary font-medium"
                          )}
                        >
                          <Link to={item.path}>
                            {item.icon}
                            <span className="ml-3">{item.label}</span>
                          </Link>
                        </Button>
                      )}
                    </div>
                  );

                  return item.feature ? (
                    <FeatureToggle key={item.id} featureId={item.feature}>
                      {menuItem}
                    </FeatureToggle>
                  ) : menuItem;
                })}
              </nav>
            </div>
          </ScrollArea>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}