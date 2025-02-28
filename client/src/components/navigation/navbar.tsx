
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/language-context";
import { useCurrency } from "@/contexts/currency-context";
import { useTheme } from "@/contexts/theme-context";
import { DrawerMenu } from "./drawer-menu";
import { Globe, Moon, Sun, Laptop, CreditCard } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [_, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { theme, setMode } = useTheme();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span>MSM</span>
          </Link>

          {!isMobile && (
            <nav className="flex items-center gap-6">
              <Link href="/about" className="text-sm font-medium hover:underline">
                {t('about')}
              </Link>
              <Link href="/features" className="text-sm font-medium hover:underline">
                {t('features')}
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:underline">
                {t('pricing')}
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Language selector */}
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English {language === 'en' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('es')}>
                  Español {language === 'es' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('fr')}>
                  Français {language === 'fr' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('de')}>
                  Deutsch {language === 'de' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('zh')}>
                  中文 {language === 'zh' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Currency selector */}
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <CreditCard className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCurrency('USD')}>
                  $ USD {currency.code === 'USD' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency('EUR')}>
                  € EUR {currency.code === 'EUR' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency('GBP')}>
                  £ GBP {currency.code === 'GBP' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency('JPY')}>
                  ¥ JPY {currency.code === 'JPY' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Theme selector */}
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {theme.mode === 'light' ? (
                    <Sun className="h-4 w-4" />
                  ) : theme.mode === 'dark' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Laptop className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setMode('light')}>
                  <Sun className="h-4 w-4 mr-2" /> Light {theme.mode === 'light' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode('dark')}>
                  <Moon className="h-4 w-4 mr-2" /> Dark {theme.mode === 'dark' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode('system')}>
                  <Laptop className="h-4 w-4 mr-2" /> System {theme.mode === 'system' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user ? (
            <>
              {isMobile ? (
                <DrawerMenu 
                  isOpen={isMenuOpen} 
                  setIsOpen={setIsMenuOpen} 
                  onLogout={handleLogout}
                />
              ) : (
                <>
                  <Link href="/dashboard" className="text-sm font-medium hover:underline">
                    {t('dashboard')}
                  </Link>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    {t('logout')}
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              {isMobile ? (
                <DrawerMenu 
                  isOpen={isMenuOpen} 
                  setIsOpen={setIsMenuOpen}
                />
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm font-medium hover:underline">
                    {t('login')}
                  </Link>
                  <Button asChild size="sm">
                    <Link href="/auth/register">{t('register')}</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
