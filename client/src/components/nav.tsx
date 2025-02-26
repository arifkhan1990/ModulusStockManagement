import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Nav() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          MSM
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-primary">Features</a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary">Pricing</a>
          <a href="#demo" className="text-sm font-medium hover:text-primary">Request Demo</a>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline">Sign In</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </nav>
  );
}