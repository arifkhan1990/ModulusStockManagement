
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-9xl font-extrabold tracking-tight text-primary">
        404
      </h1>
      <h2 className="text-4xl font-bold tracking-tight mb-6">
        Page Not Found
      </h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved or doesn't exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button size="lg" variant="default">
            Go Home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button size="lg" variant="outline">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
