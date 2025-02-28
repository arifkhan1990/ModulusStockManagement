
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M3 3h18v18H3z" />
                <path d="M7 7h10v10H7z" />
                <path d="M10 10h4v4h-4z" />
              </svg>
              <span className="hidden font-bold sm:inline-block">
                MSM System
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/features">
            <span className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </span>
          </Link>
          <Link href="/pricing">
            <span className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </span>
          </Link>
          <Link href="/about">
            <span className="text-sm font-medium transition-colors hover:text-primary">
              About
            </span>
          </Link>
          <Link href="/contact">
            <span className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </span>
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <div>
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </div>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = "/settings"}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link href="/login">
                <div>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </div>
              </Link>
              <Link href="/register">
                <div>
                  <Button size="sm">Register</Button>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="block md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50 bg-background transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="container pt-20 pb-8 h-full flex flex-col">
          <button
            className="absolute top-4 right-4"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <nav className="flex flex-col gap-4">
            <Link href="/features">
              <span
                className="text-lg font-medium py-2 transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Features
              </span>
            </Link>
            <Link href="/pricing">
              <span
                className="text-lg font-medium py-2 transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </span>
            </Link>
            <Link href="/about">
              <span
                className="text-lg font-medium py-2 transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                About
              </span>
            </Link>
            <Link href="/contact">
              <span
                className="text-lg font-medium py-2 transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </span>
            </Link>
          </nav>
          <div className="mt-auto flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard">
                  <div>
                    <Button variant="default" className="w-full" onClick={() => setIsOpen(false)}>
                      Dashboard
                    </Button>
                  </div>
                </Link>
                <Button variant="outline" className="w-full" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <div>
                    <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                      Login
                    </Button>
                  </div>
                </Link>
                <Link href="/register">
                  <div>
                    <Button variant="default" className="w-full" onClick={() => setIsOpen(false)}>
                      Register
                    </Button>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
