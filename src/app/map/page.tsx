import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { MapClient } from "./MapClient";
import { LoadingBlock } from "@/components/ui/EmptyState";
import { MAP_DISCLAIMER } from "@/lib/geo";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const [nodes, edges] = await Promise.all([
    prisma.campusNode.findMany({ orderBy: { name: "asc" } }),
    prisma.campusEdge.findMany(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">Navigation</p>
        <h1 className="page-title mt-1">Campus map</h1>
        <p className="page-sub max-w-2xl">
          Interactive OpenStreetMap view of Adamas Knowledge City with an admin-editable topology
          overlay. Routes use CampusNode / CampusEdge hop weights — never invented metre distances.
          {` ${MAP_DISCLAIMER}.`}
        </p>
      </div>
      <Suspense fallback={<LoadingBlock label="Loading map…" />}>
        <MapClient nodes={nodes} edges={edges} defaultFromSlug="main-gate" />
      </Suspense>
    </div>
  );
}
