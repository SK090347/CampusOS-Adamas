"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { CAMPUS_CENTROID, kindColor, MAP_DISCLAIMER } from "@/lib/geo";
import { cn } from "@/lib/utils";

export type MapNode = {
  id: string;
  name: string;
  slug: string;
  kind: string;
  x: number;
  y: number;
  lat?: number | null;
  lng?: number | null;
  label?: string | null;
  description?: string | null;
};

export type MapEdge = {
  id: string;
  fromNodeId: string;
  toNodeId: string;
};

type Props = {
  nodes: MapNode[];
  edges: MapEdge[];
  routeNodeIds?: string[];
  selectedSlug?: string | null;
  onSelect?: (node: MapNode) => void;
  className?: string;
  heightClass?: string;
};

function pinIcon(kind: string, active: boolean, onRoute: boolean) {
  const color = active ? "#12100e" : onRoute ? "#c4a35a" : kindColor(kind);
  const size = active || onRoute ? 28 : 22;
  const html = `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid #fffcf7;box-shadow:0 2px 8px rgba(18,16,14,.35);display:flex;align-items:center;justify-content:center;">
    <span style="width:6px;height:6px;border-radius:9999px;background:#faf6ee;"></span>
  </div>`;
  return L.divIcon({
    className: "campus-marker-pin",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function FitRoute({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(L.latLngBounds(positions), { padding: [48, 48], maxZoom: 17 });
    }
  }, [map, positions]);
  return null;
}

export function LeafletCampusMap({
  nodes,
  edges,
  routeNodeIds = [],
  selectedSlug,
  onSelect,
  className,
  heightClass = "h-[420px] sm:h-[520px]",
}: Props) {
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const routeSet = useMemo(() => new Set(routeNodeIds), [routeNodeIds]);

  const withCoords = useMemo(
    () =>
      nodes.filter(
        (n): n is MapNode & { lat: number; lng: number } =>
          typeof n.lat === "number" && typeof n.lng === "number"
      ),
    [nodes]
  );

  const edgeLines = useMemo(() => {
    return edges
      .map((e) => {
        const a = byId[e.fromNodeId];
        const b = byId[e.toNodeId];
        if (!a?.lat || !a?.lng || !b?.lat || !b?.lng) return null;
        const onRoute =
          routeSet.has(e.fromNodeId) &&
          routeSet.has(e.toNodeId) &&
          Math.abs(routeNodeIds.indexOf(e.fromNodeId) - routeNodeIds.indexOf(e.toNodeId)) === 1;
        return {
          id: e.id,
          positions: [
            [a.lat, a.lng] as [number, number],
            [b.lat, b.lng] as [number, number],
          ],
          onRoute,
        };
      })
      .filter(Boolean) as { id: string; positions: [number, number][]; onRoute: boolean }[];
  }, [edges, byId, routeSet, routeNodeIds]);

  const routePositions = useMemo(() => {
    return routeNodeIds
      .map((id) => byId[id])
      .filter((n): n is MapNode & { lat: number; lng: number } => !!n && typeof n.lat === "number" && typeof n.lng === "number")
      .map((n) => [n.lat, n.lng] as [number, number]);
  }, [routeNodeIds, byId]);

  if (withCoords.length === 0) {
    return (
      <div className={cn("card p-6 text-sm text-ink-500", className)}>
        No approximate map coordinates seeded yet. Admins can set lat/lng on nodes.
      </div>
    );
  }

  return (
    <div className={cn("card overflow-hidden", className)}>
      <div className="flex flex-col gap-1 border-b border-ink-100 bg-cream/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-ink-950">Interactive campus map</div>
          <p className="text-xs text-ink-500">OpenStreetMap tiles · topology routing overlay</p>
        </div>
        <p className="rounded-full bg-campus-100 px-3 py-1 text-[11px] font-medium text-campus-900">
          {MAP_DISCLAIMER}
        </p>
      </div>
      <div className={cn("relative w-full", heightClass)}>
        <MapContainer
          center={[CAMPUS_CENTROID.lat, CAMPUS_CENTROID.lng]}
          zoom={16}
          scrollWheelZoom
          className="h-full w-full"
          aria-label="Adamas Knowledge City approximate campus map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {edgeLines.map((e) => (
            <Polyline
              key={e.id}
              positions={e.positions}
              pathOptions={{
                color: e.onRoute ? "#c4a35a" : "#d6d1c6",
                weight: e.onRoute ? 5 : 3,
                opacity: e.onRoute ? 0.95 : 0.7,
              }}
            />
          ))}
          {routePositions.length >= 2 && (
            <>
              <Polyline
                positions={routePositions}
                pathOptions={{ color: "#12100e", weight: 4, dashArray: "10 8", opacity: 0.9 }}
              />
              <FitRoute positions={routePositions} />
            </>
          )}
          {withCoords.map((n) => {
            const selected = selectedSlug === n.slug || selectedSlug === n.id;
            const onRoute = routeSet.has(n.id);
            return (
              <Marker
                key={n.id}
                position={[n.lat, n.lng]}
                icon={pinIcon(n.kind, selected, onRoute)}
                eventHandlers={{ click: () => onSelect?.(n) }}
              >
                <Popup>
                  <div className="min-w-[140px]">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                      {n.kind}
                    </div>
                    <div className="font-semibold text-ink-950">{n.label || n.name}</div>
                    {n.description && (
                      <p className="mt-1 text-xs text-ink-500">{n.description}</p>
                    )}
                    <p className="mt-2 text-[10px] text-ink-400">{MAP_DISCLAIMER}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
