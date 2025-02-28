
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  Settings, 
  Bell, 
  FileText, 
  Share2, 
  Download, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: { name: string; href: string }[];
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'Stock', 
    href: '/dashboard/stock', 
    icon: Package,
    subItems: [
      { name: 'Inventory', href: '/dashboard/stock/inventory' },
      { name: 'Movements', href: '/dashboard/stock/movements' },
      { name: 'Adjustments', href: '/dashboard/stock/adjustments' },
    ]
  },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart2 },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Share', href: '/dashboard/share', icon: Share2 },
  { name: 'Downloads', href: '/dashboard/downloads', icon: Download },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);
  
  const toggleExpand = (name: string) => {
    if (expanded === name) {
      setExpanded(null);
    } else {
      setExpanded(name);
    }
  };
  
  return (
    <motion.aside
      className="hidden md:flex w-64 flex-col border-r bg-background"
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-2 p-4">
        <p className="text-xs font-semibold text-muted-foreground px-2 py-1">MAIN</p>
        <nav className="grid gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
                            (location.pathname.startsWith(item.href) && item.href !== '/dashboard');
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expanded === item.name;
            
            return (
              <div key={item.name}>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm
                      ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-accent'}`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} />
                        <span>{item.name}</span>
                      </div>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm 
                      ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-accent'}`}
                    >
                      <item.icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </motion.div>
                
                {hasSubItems && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-6 mt-1 grid gap-1"
                  >
                    {item.subItems!.map((subItem) => {
                      const isSubActive = location.pathname === subItem.href;
                      
                      return (
                        <motion.div
                          key={subItem.name}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            to={subItem.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm
                            ${isSubActive ? 'text-primary font-medium' : 'text-muted-foreground hover:bg-accent'}`}
                          >
                            <span>{subItem.name}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
