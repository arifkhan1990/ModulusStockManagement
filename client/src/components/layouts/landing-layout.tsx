import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navigation/navbar";

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  );
}