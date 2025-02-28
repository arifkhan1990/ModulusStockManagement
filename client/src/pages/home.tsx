import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Multi-Channel Stock Management System
        </h1>
        <p className="text-lg text-muted-foreground">
          Streamline your inventory management across multiple channels,
          warehouses, and suppliers with our powerful platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link href="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/features">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter mb-6">
          Modulus Stock Management
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          A comprehensive solution for multi-channel inventory tracking and management
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Real-Time Tracking</h3>
          <p className="text-muted-foreground">
            Monitor your inventory across multiple channels in real time
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
          <p className="text-muted-foreground">
            Gain insights with comprehensive reporting and analytics
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Multi-Location Support</h3>
          <p className="text-muted-foreground">
            Manage inventory across warehouses and geographical locations
          </p>
        </div>
      </div>
    </div>
  );
}
