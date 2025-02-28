
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  HelpCircle 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { useTheme } from '../../hooks/use-theme';
import { useAuth } from '../../hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: 'Low stock alert',
      description: 'Product SKU-1001 is running low on stock',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      title: 'New order received',
      description: 'Order #12345 has been placed',
      time: '1 hour ago',
      read: true,
    },
    {
      id: '3',
      title: 'Payment received',
      description: 'Payment for Invoice #INV-2022-001 has been received',
      time: '3 hours ago',
      read: true,
    },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-10">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {showSearch ? (
            <div className="relative md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t('search')} 
                className="pl-8"
                onBlur={() => setShowSearch(false)}
                autoFocus
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
              className="md:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <div className="hidden md:block relative md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('search')} className="pl-8" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                >
                  {notifications.filter(n => !n.read).length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-0">
                      <div className={`flex items-start space-x-2 p-2 w-full ${!notification.read ? 'bg-primary/5' : ''}`}>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-primary rounded-full mt-1.5"></div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="w-full cursor-pointer">
                <Link to="/dashboard/notifications" className="w-full text-center justify-center">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <p>Settings</p>
                  <p className="text-xs font-normal text-muted-foreground">Customize your experience</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings/company" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Company Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings/features" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Feature Management</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 gap-1.5 pr-0 pl-2 flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 text-left hidden md:flex">
                  <span className="text-sm font-medium leading-none">{user?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground leading-none">{user?.email || 'user@example.com'}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings/company" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/support" className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
