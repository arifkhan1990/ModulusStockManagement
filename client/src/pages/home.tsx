
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  CheckCircle,
  Database,
  Globe,
  LayoutGrid,
  LineChart,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Modulus Stock Management
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Streamline your inventory across all sales channels with our
                powerful SaaS platform.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Powerful Features
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Everything you need to manage your inventory efficiently
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 pt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-4">
                <LayoutGrid className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Multi-Channel Management</h3>
              <p className="text-center text-muted-foreground">
                Manage inventory across all your sales channels from one
                platform.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Real-Time Analytics</h3>
              <p className="text-center text-muted-foreground">
                Track performance and make data-driven decisions with powerful
                insights.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Automated Restocking</h3>
              <p className="text-center text-muted-foreground">
                Automate purchase orders based on inventory levels and demand
                forecasts.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Global Scalability</h3>
              <p className="text-center text-muted-foreground">
                Scale your operations worldwide with our cloud-based platform.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure Data</h3>
              <p className="text-center text-muted-foreground">
                Enterprise-grade security for all your business data.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Easy Integration</h3>
              <p className="text-center text-muted-foreground">
                Connect with your existing systems through our extensive API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Transform Your Inventory Management?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Join thousands of businesses that trust Modulus Stock
                Management.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg">Start Your Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
