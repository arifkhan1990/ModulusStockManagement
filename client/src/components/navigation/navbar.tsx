
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { DrawerMenu } from "./drawer-menu";

export function Navbar() {
  const { user, logout } = useAuth();
  const [_, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                About
              </Link>
              <Link href="/features" className="text-sm font-medium hover:underline">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:underline">
                Pricing
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
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
                    Dashboard
                  </Link>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Logout
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
                    Login
                  </Link>
                  <Button asChild size="sm">
                    <Link href="/auth/register">Sign Up</Link>
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
