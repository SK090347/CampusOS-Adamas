"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CampusMap, type MapNode, type MapEdge } from "@/components/map/CampusMap";
import { Navigation, Loader2 } from "lucide-react";

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

  const selected = useMemo(
    () => nodes.find((n) => n.slug === toSlug || n.id === toSlug),
    [nodes, toSlug]
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
        `Route via ${data.nodes.map((n: MapNode) => n.label || n.name).join(" → ")} · relative hop weight ${data.relativeWeight} (not distance)`
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
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            Walk here
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </div>
      )}
      {info && (
        <div className="rounded-xl border border-campus-200 bg-campus-50 px-4 py-3 text-sm text-campus-900">
          {info}
        </div>
      )}

      <CampusMap
        nodes={nodes}
        edges={edges}
        routeNodeIds={routeIds}
        selectedSlug={selected?.slug}
        onSelect={(n) => {
          setToSlug(n.slug);
        }}
      />

      {selected && (
        <div className="card p-4">
          <div className="label-muted">Selected</div>
          <div className="text-lg font-semibold text-ink-950">{selected.name}</div>
          <div className="text-sm text-ink-500">{selected.kind}</div>
          <button
            type="button"
            className="btn-primary mt-3 text-xs"
            onClick={() => walk(fromSlug, selected.slug)}
          >
            <Navigation className="h-3.5 w-3.5" /> Walk here
          </button>
        </div>
      )}
    </div>
  );
}
