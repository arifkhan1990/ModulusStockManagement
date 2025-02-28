
import React, { useRef } from 'react';
import { useLocation, Link } from 'wouter';
import {
  Menu,
  Bell,
  Search,
  X,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { useSearch } from '@/hooks/use-search';
import { useNotifications } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

interface NavbarProps {
  toggleSidebar: () => void;
}

export function Navbar({ toggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const isOnline = useOnlineStatus();
  const { query, setQuery, results, isLoading, clearSearch } = useSearch();
  const { unreadCount } = useNotifications();
  const [, navigate] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  
  // Handle keyboard shortcut: Ctrl + / for search focus
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchItemClick = (id: string, type: string) => {
    clearSearch();
    navigate(`/dashboard/${type}s/${id}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
          className="mr-2 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center justify-center">
          <Link href="/dashboard" className="text-xl font-bold text-primary mr-6">
            MSM
          </Link>
        </div>
        
        <div className="relative hidden md:flex md:flex-1 md:items-center md:gap-4 md:px-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchRef}
              type="search"
              placeholder="Search products, locations..."
              className="w-full pl-8 rounded-md"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {query && results.length > 0 && (
              <div className="absolute top-full mt-2 w-full rounded-md border bg-popover p-2 shadow-md">
                {isLoading ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Loading results...
                  </div>
                ) : (
                  <ul>
                    {results.map((item) => (
                      <li key={item.id}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleSearchItemClick(item.id, item.type)}
                        >
                          <span className="mr-2 text-xs text-muted-foreground">
                            {item.type}:
                          </span>
                          {item.name}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/dashboard/notifications">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 relative"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user?.avatarUrl || ''} 
                    alt={user?.name || 'User'} 
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span 
                  className={cn(
                    "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background", 
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  )}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
