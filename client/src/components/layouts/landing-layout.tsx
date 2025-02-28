
import React, { ReactNode } from "react";
import Navbar from "@/components/navbar";

export function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        {children}
      </main>
      <footer className="bg-secondary py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Modulus Stock Management. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingLayout;
