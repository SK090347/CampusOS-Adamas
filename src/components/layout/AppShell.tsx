"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AccessibilityProvider>
      <div className="flex min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
        <BottomNav />
      </div>
    </AccessibilityProvider>
  );
}
