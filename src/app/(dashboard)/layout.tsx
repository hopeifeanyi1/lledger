// src/app/(dashboard)/layout.tsx
"use client";
import React from "react";
import { ThemeToggle } from "@/components/store/ThemeToggle";
import DashboardSide from "@/components/store/DashboardSide";

export default function DashboardLayout({
    children
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  

  return (
    <div className="h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
      <div className="w-full h-full px-3 lg:container">
        <header className="fixed top-0 right-3 lg:right-5 lg:top-2 z-40 flex justify-between items-center w-[calc(100%-1.5rem)] lg:bg-transparent bg-background">
          <div className="lg:hidden">
            <DashboardSide />
          </div>
          <div className="ml-auto pt-2 flex space-x-2">
            <div className="">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="flex h-full lg:flex gap-6 overflow-hidden lg:w-screen">
          <aside className="lg:block hidden">
            <DashboardSide />
          </aside>
          <main className="flex-1 lg:w-[calc(100vw-220px)] h-full ">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}