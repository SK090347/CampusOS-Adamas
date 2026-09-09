"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type MapNode = {
  id: string;
  name: string;
  slug: string;
  kind: string;
  x: number;
  y: number;
  label?: string | null;
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
};

export function CampusMap({
  nodes,
  edges,
  routeNodeIds = [],
  selectedSlug,
  onSelect,
  className,
}: Props) {
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const routeSet = useMemo(() => new Set(routeNodeIds), [routeNodeIds]);
  const routeKey = routeNodeIds.join(",");
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [routeKey]);

  const routePoints = routeNodeIds
    .map((id) => byId[id])
    .filter(Boolean)
    .map((n) => `${n.x},${n.y}`)
    .join(" ");

  return (
    <div className={cn("card overflow-hidden", className)}>
      <div className="border-b border-ink-100 px-4 py-3">
        <div className="text-sm font-medium text-ink-900">Digital Campus Map</div>
        <p className="text-xs text-ink-450 text-ink-500">
          Relative layout · topology navigation only · no GPS or fabricated distances
        </p>
      </div>
      <div className="relative bg-gradient-to-b from-ink-50 to-white p-2 sm:p-4">
        <svg viewBox="0 0 1000 800" className="h-auto w-full" role="img" aria-label="Campus map">
          <rect x="0" y="0" width="1000" height="800" fill="#f7f7f8" rx="12" />
          {/* soft grounds */}
          <ellipse cx="500" cy="420" rx="420" ry="280" fill="#eef6ff" opacity="0.7" />
          <path
            d="M40 520 C 120 500, 200 540, 280 480"
            fill="none"
            stroke="#d4d4d8"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.5"
          />

          {edges.map((e) => {
            const a = byId[e.fromNodeId];
            const b = byId[e.toNodeId];
            if (!a || !b) return null;
            const onRoute =
              routeSet.has(e.fromNodeId) &&
              routeSet.has(e.toNodeId) &&
              Math.abs(routeNodeIds.indexOf(e.fromNodeId) - routeNodeIds.indexOf(e.toNodeId)) === 1;
            return (
              <line
                key={e.id}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={onRoute ? "#0c8ce9" : "#d4d4d8"}
                strokeWidth={onRoute ? 4 : 2}
                strokeLinecap="round"
              />
            );
          })}

          {routePoints && (
            <polyline
              key={animKey}
              points={routePoints}
              fill="none"
              stroke="#0c8ce9"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="route-path"
              strokeDasharray="12 8"
              strokeDashoffset="120"
              opacity="0.95"
            />
          )}

          {nodes.map((n) => {
            const selected = selectedSlug === n.slug || selectedSlug === n.id;
            const onRoute = routeSet.has(n.id);
            const r = n.kind === "JUNCTION" ? 7 : n.kind === "GATE" ? 10 : 9;
            return (
              <g
                key={n.id}
                className="cursor-pointer"
                onClick={() => onSelect?.(n)}
                role="button"
                tabIndex={0}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") onSelect?.(n);
                }}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r + (selected || onRoute ? 4 : 0)}
                  fill={selected ? "#18181b" : onRoute ? "#0c8ce9" : "#ffffff"}
                  stroke={selected ? "#18181b" : onRoute ? "#0369a1" : "#a1a1aa"}
                  strokeWidth="2"
                  className={onRoute && !selected ? "nav-pulse" : undefined}
                />
                <text
                  x={n.x}
                  y={n.y - r - 8}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fontSize="11"
                  fill="#3f3f46"
                  fontWeight={selected ? 600 : 500}
                >
                  {n.label || n.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
