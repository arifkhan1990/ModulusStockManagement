
import { Loader2 } from "lucide-react";

export default function LoadingLayout() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-medium">Loading your dashboard...</h2>
        <p className="text-muted-foreground mt-2">Please wait while we prepare your content</p>
      </div>
    </div>
  );
}
