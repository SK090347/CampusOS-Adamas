"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Navigation, Loader2 } from "lucide-react";
import type { SearchHit } from "@/lib/search";

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
      <label className="label-muted mb-2 block">Where do you need to go?</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          className="input pl-11"
          placeholder="e.g. Where is my AI class? · Library · Robotics club"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus={autofocus}
          aria-label="Campus command search"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink-400" />
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {hits.length > 0 && (
        <ul className="card mt-3 divide-y divide-ink-100 overflow-hidden">
          {hits.map((h) => (
            <li key={`${h.type}-${h.id}`}>
              <Link
                href={h.href}
                className="flex items-start justify-between gap-3 px-4 py-3 transition hover:bg-ink-50"
              >
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                    {h.type}
                  </div>
                  <div className="text-sm font-medium text-ink-950">{h.title}</div>
                  {h.subtitle && (
                    <div className="text-xs text-ink-500">{h.subtitle}</div>
                  )}
                </div>
                {(h.type === "place" || h.type === "course" || h.type === "room") && (
                  <span className="btn-secondary shrink-0 text-xs">
                    <Navigation className="h-3.5 w-3.5" /> Open
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {q.trim() && !loading && hits.length === 0 && !error && (
        <p className="mt-3 text-sm text-ink-500">No matches in CampusOS data.</p>
      )}
    </div>
  );
}
