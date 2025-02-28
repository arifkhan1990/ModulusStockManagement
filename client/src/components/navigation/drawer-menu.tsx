import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface DrawerMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout?: () => void;
}

export function DrawerMenu({ isOpen, setIsOpen, onLogout }: DrawerMenuProps) {
  const { user } = useAuth();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>MSM</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:underline">
                Dashboard
              </Link>
              <Link href="/dashboard/products" className="text-sm font-medium hover:underline">
                Products
              </Link>
              <Link href="/dashboard/locations" className="text-sm font-medium hover:underline">
                Locations
              </Link>
              <Link href="/profile" className="text-sm font-medium hover:underline">
                Profile
              </Link>
              {onLogout && (
                <Button onClick={onLogout} variant="outline" size="sm">
                  Logout
                </Button>
              )}
            </>
          ) : (
            <>
              <Link href="/about" className="text-sm font-medium hover:underline">
                About
              </Link>
              <Link href="/features" className="text-sm font-medium hover:underline">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:underline">
                Pricing
              </Link>
              <Link href="/auth/login" className="text-sm font-medium hover:underline">
                Login
              </Link>
              <Link href="/auth/register" className="text-sm font-medium hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}