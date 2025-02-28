import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
    />
  );
}

export function SkeletonPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Skeleton navbar */}
      <div className="h-14 border-b bg-background">
        <div className="flex h-full items-center px-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="ml-4 h-7 w-[200px]" />
          <div className="ml-auto flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-1">
        {/* Skeleton sidebar */}
        <div className="hidden w-64 border-r bg-background md:block">
          <div className="flex h-14 items-center border-b px-4">
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="mb-2 h-10 w-full" />
            ))}
          </div>
        </div>
        
        {/* Skeleton content */}
        <main className="flex-1 p-6">
          <Skeleton className="h-10 w-[250px] mb-6" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="mt-8 h-64 w-full" />
        </main>
      </div>
    </div>
  );
}
