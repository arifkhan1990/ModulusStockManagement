import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer">MSM</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/">
              <span className="text-sm font-medium cursor-pointer">Home</span>
            </Link>
            <Link href="/features">
              <span className="text-sm font-medium cursor-pointer">Features</span>
            </Link>
            <Link href="/pricing">
              <span className="text-sm font-medium cursor-pointer">Pricing</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <span>Login</span>
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">
                  <span>Register</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}