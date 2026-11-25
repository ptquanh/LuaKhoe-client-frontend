"use client";

import React from "react";

import { MobileBottomNav } from "./MobileBottomNav";
import SharedHeader from "./SharedHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg-page text-text-primary min-h-screen transition-colors duration-200">
      <SharedHeader />
      <main className="mx-auto max-w-[1200px] px-4 pt-4 pb-24 sm:px-6 sm:pt-6 md:pb-10">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
