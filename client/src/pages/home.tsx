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