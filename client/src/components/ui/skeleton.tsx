
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        className
      )}
    />
  );
}

export function SkeletonPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-14 border-b bg-background flex items-center px-4">
        <Skeleton className="h-8 w-40" />
        <div className="ml-auto">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="hidden md:block w-64 border-r p-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <main className="flex-1 p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Skeleton className="h-[180px] w-full rounded-xl" />
            <Skeleton className="h-[180px] w-full rounded-xl" />
            <Skeleton className="h-[180px] w-full rounded-xl" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    </div>
  );
}
