"use client";

import dynamic from "next/dynamic";
import type { MapNode, MapEdge } from "./LeafletCampusMap";
import { LoadingBlock } from "@/components/ui/EmptyState";

export type { MapNode, MapEdge };

const LeafletCampusMap = dynamic(
  () => import("./LeafletCampusMap").then((m) => m.LeafletCampusMap),
  {
    ssr: false,
    loading: () => <LoadingBlock label="Loading interactive map…" />,
  }
);

type Props = {
  nodes: MapNode[];
  edges: MapEdge[];
  routeNodeIds?: string[];
  selectedSlug?: string | null;
  onSelect?: (node: MapNode) => void;
  className?: string;
  heightClass?: string;
};

/** Lazy Leaflet + OSM map. Client-only. */
export function CampusMap(props: Props) {
  return <LeafletCampusMap {...props} />;
}
