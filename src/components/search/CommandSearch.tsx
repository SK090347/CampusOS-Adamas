"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Navigation, Loader2, ArrowUpRight, MapPin, BookOpen, Users, Calendar } from "lucide-react";
import type { SearchHit } from "@/lib/search";
import { Badge } from "@/components/ui/Badge";

const TYPE_TONE: Record<string, "gold" | "amber" | "green" | "neutral" | "blue"> = {
  course: "gold",
  place: "amber",
  person: "green",
  club: "blue",
  event: "amber",
  notice: "neutral",
  school: "gold",
  facility: "amber",
  service: "neutral",
  room: "blue",
};

function TypeIcon({ type }: { type: string }) {
  if (type === "place" || type === "room" || type === "facility") return <MapPin className="h-4 w-4" />;
  if (type === "course" || type === "school") return <BookOpen className="h-4 w-4" />;
  if (type === "person" || type === "club") return <Users className="h-4 w-4" />;
  if (type === "event") return <Calendar className="h-4 w-4" />;
  return <ArrowUpRight className="h-4 w-4" />;
}

export function CommandSearch({
  initialQuery = "",
  autofocus = false,
}: {
  initialQuery?: string;
  autofocus?: boolean;
}) {
  const [q, setQ] = useState(initialQuery);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setHits([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setHits(data.hits || []);
      } catch {
        setError("Could not search right now. Try again.");
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="w-full">
      <label className="label-muted mb-2 block" htmlFor="campus-command-search">
        Command search
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden />
        <input
          id="campus-command-search"
          className="input pl-11"
          placeholder="e.g. Where is my AI class? · Library · Robotics club · Vice Chancellor"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus={autofocus}
          aria-label="Campus command search"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink-400" aria-label="Searching" />
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {hits.length > 0 && (
        <ul className="card mt-3 divide-y divide-ink-100 overflow-hidden animate-fade-up">
          {hits.map((h) => {
            const navigateHref =
              h.meta?.navigateTo ||
              (h.type === "place" || h.type === "room" || h.type === "facility"
                ? h.href.startsWith("/map")
                  ? h.href
                  : undefined
                : h.type === "course" && h.meta?.mapSlug
                  ? `/map?to=${h.meta.mapSlug}&from=main-gate`
                  : undefined);
            return (
              <li key={`${h.type}-${h.id}`} className="group">
                <div className="flex items-stretch gap-0">
                  <Link
                    href={h.href}
                    className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3 transition hover:bg-campus-50/70"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-campus-700 group-hover:bg-campus-100">
                      <TypeIcon type={h.type} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={TYPE_TONE[h.type] || "neutral"}>{h.type}</Badge>
                        {h.meta?.actionHint && (
                          <span className="text-[10px] uppercase tracking-wide text-ink-400">
                            {h.meta.actionHint}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-ink-950">{h.title}</div>
                      {h.subtitle && (
                        <div className="text-xs leading-relaxed text-ink-500">{h.subtitle}</div>
                      )}
                    </div>
                  </Link>
                  <div className="flex shrink-0 flex-col justify-center gap-1 border-l border-ink-100 px-3 py-2">
                    <Link href={h.href} className="btn-secondary text-[11px]">
                      Open
                    </Link>
                    {navigateHref && (
                      <Link href={navigateHref} className="btn-gold text-[11px]">
                        <Navigation className="h-3 w-3" /> Walk
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {q.trim() && !loading && hits.length === 0 && !error && (
        <p className="mt-3 text-sm text-ink-500">
          No matches in CampusOS data. Try a place, person, club, course, or notice keyword.
        </p>
      )}
    </div>
  );
}
