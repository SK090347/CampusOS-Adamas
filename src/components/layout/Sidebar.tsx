"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { desktopNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const groups = Array.from(new Set(desktopNav.map((n) => n.group)));

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-ink-200/80 bg-white lg:flex">
      <div className="border-b border-ink-100 px-5 py-5">
        <Link href="/" className="block">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">
            CampusOS
          </div>
          <div className="mt-0.5 text-sm font-semibold tracking-tight text-ink-950">
            Adamas University
          </div>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group} className="mb-4">
            <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              {group}
            </div>
            <ul className="space-y-0.5">
              {desktopNav
                .filter((n) => n.group === group)
                .map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition",
                          active
                            ? "bg-ink-950 text-white"
                            : "text-ink-600 hover:bg-ink-50 hover:text-ink-950"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-80" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-ink-100 px-4 py-3 text-[11px] text-ink-400">
        Search → Understand → Navigate → Act
      </div>
    </aside>
  );
}
