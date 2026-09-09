"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CampusMap, type MapNode, type MapEdge } from "@/components/map/CampusMap";
import { Navigation, Loader2, MapPin, Route } from "lucide-react";
import { MAP_DISCLAIMER } from "@/lib/geo";
import { Badge } from "@/components/ui/Badge";

type Props = {
  nodes: MapNode[];
  edges: MapEdge[];
  defaultFromSlug: string;
};

export function MapClient({ nodes, edges, defaultFromSlug }: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const toParam = sp.get("to");
  const fromParam = sp.get("from") || defaultFromSlug;

  const [fromSlug, setFromSlug] = useState(fromParam);
  const [toSlug, setToSlug] = useState(toParam || "");
  const [routeIds, setRouteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const selected = useMemo(
    () => nodes.find((n) => n.slug === toSlug || n.id === toSlug),
    [nodes, toSlug]
  );

  const kinds = useMemo(
    () => ["ALL", ...Array.from(new Set(nodes.map((n) => n.kind))).sort()],
    [nodes]
  );

  const filtered = useMemo(
    () => (filter === "ALL" ? nodes : nodes.filter((n) => n.kind === filter)),
    [nodes, filter]
  );

  async function walk(from: string, to: string) {
    if (!from || !to) return;
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch(
        `/api/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No route");
      setRouteIds(data.nodeIds);
      setInfo(
        `Route via ${data.nodes.map((n: MapNode) => n.label || n.name).join(" → ")} · relative hop weight ${data.relativeWeight} (not metres)`
      );
      router.replace(`/map?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    } catch (e) {
      setRouteIds([]);
      setError(e instanceof Error ? e.message : "Routing failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (toParam) {
      setToSlug(toParam);
      walk(fromParam, toParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="card grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto]">
        <label className="block text-xs">
          <span className="label-muted">From</span>
          <select
            className="input mt-1 py-2"
            value={fromSlug}
            onChange={(e) => setFromSlug(e.target.value)}
            aria-label="Starting place"
          >
            {nodes.map((n) => (
              <option key={n.id} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="label-muted">To</span>
          <select
            className="input mt-1 py-2"
            value={toSlug}
            onChange={(e) => setToSlug(e.target.value)}
            aria-label="Destination"
          >
            <option value="">Select destination</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="button"
            className="btn-primary w-full sm:w-auto"
            disabled={!toSlug || loading}
            onClick={() => walk(fromSlug, toSlug)}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Navigation className="h-4 w-4" aria-hidden />
            )}
            Walk here
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter places by kind">
        {kinds.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={filter === k}
            className={
              filter === k
                ? "rounded-full bg-ink-950 px-3 py-1 text-xs font-medium text-cream"
                : "rounded-full border border-ink-200 bg-white px-3 py-1 text-xs text-ink-600 hover:border-campus-300"
            }
            onClick={() => setFilter(k)}
          >
            {k === "ALL" ? "All places" : k}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {error}
        </div>
      )}
      {info && (
        <div className="rounded-xl border border-campus-200 bg-campus-50 px-4 py-3 text-sm text-campus-950">
          <div className="flex items-start gap-2">
            <Route className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{info}</span>
          </div>
        </div>
      )}

      <CampusMap
        nodes={nodes}
        edges={edges}
        routeNodeIds={routeIds}
        selectedSlug={selected?.slug}
        onSelect={(n) => setToSlug(n.slug)}
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card max-h-72 overflow-y-auto">
          <div className="sticky top-0 border-b border-ink-100 bg-[var(--card)] px-4 py-3">
            <div className="text-sm font-semibold text-ink-950">Places directory</div>
            <p className="text-xs text-ink-500">{filtered.length} locations · {MAP_DISCLAIMER}</p>
          </div>
          <ul className="divide-y divide-ink-100">
            {filtered.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-campus-50/60"
                  onClick={() => setToSlug(n.slug)}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-campus-600" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-ink-950">{n.name}</span>
                      <Badge tone="amber">{n.kind}</Badge>
                    </div>
                    {n.description && (
                      <p className="mt-0.5 text-xs text-ink-500 line-clamp-2">{n.description}</p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selected ? (
          <div className="card space-y-3 p-5 animate-fade-up">
            <div className="label-muted">Selected destination</div>
            <div className="font-display text-xl font-semibold text-ink-950">{selected.name}</div>
            <Badge tone="neutral">{selected.kind}</Badge>
            {selected.description && (
              <p className="text-sm leading-relaxed text-ink-600">{selected.description}</p>
            )}
            <p className="text-[11px] text-ink-400">
              Coords:{" "}
              {typeof selected.lat === "number" && typeof selected.lng === "number"
                ? `${selected.lat.toFixed(5)}, ${selected.lng.toFixed(5)} (approx)`
                : "not set"}
            </p>
            <button
              type="button"
              className="btn-primary text-xs"
              onClick={() => walk(fromSlug, selected.slug)}
              disabled={loading}
            >
              <Navigation className="h-3.5 w-3.5" aria-hidden /> Walk here
            </button>
          </div>
        ) : (
          <div className="card flex items-center justify-center p-8 text-center text-sm text-ink-500">
            Select a destination on the map or from the directory to route.
          </div>
        )}
      </div>
    </div>
  );
}
