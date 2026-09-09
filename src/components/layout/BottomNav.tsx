"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200/80 bg-[var(--card)]/95 backdrop-blur-md lg:hidden"
      aria-label="Mobile"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {mobileNav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : item.href === "/more"
                ? pathname === "/more" ||
                  !["/", "/map", "/academics", "/events"].some(
                    (p) => pathname === p || (p !== "/" && pathname.startsWith(p))
                  )
                : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
                  active ? "text-ink-950" : "text-ink-400"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    active && "bg-campus-100 text-campus-800"
                  )}
                >
                  <Icon className={cn("h-5 w-5", active && "stroke-[2.25]")} />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
