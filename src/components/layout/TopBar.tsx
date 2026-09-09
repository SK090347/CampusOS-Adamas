"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn, LogOut, Shield } from "lucide-react";

type Session = { role: string; name: string } | null;

export function TopBar() {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setSession(d.session))
      .catch(() => setSession(null));
  }, []);

  async function demoLogin() {
    const res = await fetch("/api/auth/demo", { method: "POST" });
    if (res.ok) {
      const d = await res.json();
      setSession(d.session);
      window.location.reload();
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-200/70 bg-[var(--card)]/90 px-4 backdrop-blur-md sm:px-6">
      <div className="lg:hidden">
        <Link href="/" className="font-display text-sm font-semibold tracking-tight text-ink-950">
          CampusOS
        </Link>
      </div>
      <div className="hidden text-xs text-ink-500 lg:block">
        Adamas Knowledge City · Barasat–Barrackpore Road · Kolkata 700126
      </div>
      <div className="flex items-center gap-2">
        {session ? (
          <>
            <span className="hidden text-xs text-ink-600 sm:inline">
              {session.name}
              {session.role === "admin" && (
                <span className="ml-1 rounded bg-campus-500 px-1.5 py-0.5 text-[10px] font-semibold text-ink-950">
                  Admin
                </span>
              )}
              {session.role === "student" && (
                <span className="ml-1 rounded bg-ink-100 px-1.5 py-0.5 text-[10px] text-ink-600">
                  Demo · fictional
                </span>
              )}
            </span>
            {session.role !== "admin" && (
              <Link href="/admin" className="btn-ghost text-xs">
                <Shield className="h-3.5 w-3.5" /> Admin
              </Link>
            )}
            <button type="button" onClick={logout} className="btn-secondary text-xs">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </>
        ) : (
          <button type="button" onClick={demoLogin} className="btn-primary text-xs">
            <LogIn className="h-3.5 w-3.5" /> Demo as Aarav
          </button>
        )}
      </div>
    </header>
  );
}
