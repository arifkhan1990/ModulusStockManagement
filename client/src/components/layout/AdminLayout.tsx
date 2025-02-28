import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Layers,
  Settings,
  Users,
  CreditCard,
  BarChart3,
  Bell,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';

const AdminLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/admin',
    },
    {
      id: 'features',
      label: t('features'),
      icon: <Settings className="h-5 w-5" />,
      path: '/admin/features',
    },
    {
      id: 'subscription-tiers',
      label: t('subscriptionTiers'),
      icon: <Layers className="h-5 w-5" />,
      path: '/admin/subscription-tiers',
    },
    {
      id: 'companies',
      label: t('companies'),
      icon: <Users className="h-5 w-5" />,
      path: '/admin/companies',
    },
    {
      id: 'billing',
      label: t('billing'),
      icon: <CreditCard className="h-5 w-5" />,
      path: '/admin/billing',
    },
    {
      id: 'notifications',
      label: t('notifications'),
      icon: <Bell className="h-5 w-5" />,
      path: '/admin/notifications',
    },
    {
      id: 'security',
      label: t('security'),
      icon: <Shield className="h-5 w-5" />,
      path: '/admin/security',
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Top navigation */}
      <header className="bg-white border-b border-gray-200 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <div className="flex items-center">
                <Link to="/admin" className="flex items-center">
                  <div className="bg-primary text-white p-1 rounded mr-2">
                    <Shield className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-xl">Admin Panel</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-medium">Admin User</div>
                    <div className="text-xs text-muted-foreground">admin@example.com</div>
                  </div>
                  <Avatar>
                    <AvatarImage src="/user-avatar.png" />
                    <AvatarFallback>AU</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-white border-r border-gray-200 w-64 fixed inset-y-0 mt-16 md:relative md:translate-x-0 z-20 transition-transform duration-200 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-full px-3 py-4 overflow-y-auto">
            <nav className="space-y-1 py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="pt-6 mt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => navigate('/login')}
              >
                <LogOut className="mr-3 h-5 w-5" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className={cn(
          "flex-1 overflow-y-auto bg-muted transition-all duration-200 ease-in-out",
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;