import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { MapClient } from "./MapClient";
import { LoadingBlock } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const [nodes, edges] = await Promise.all([
    prisma.campusNode.findMany({ orderBy: { name: "asc" } }),
    prisma.campusEdge.findMany(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Digital Campus Map</h1>
        <p className="page-sub">
          Editable relative layout. Routes computed only from CampusNode / CampusEdge topology —
          never GPS or invented metres.
        </p>
      </div>
      <Suspense fallback={<LoadingBlock label="Loading map…" />}>
        <MapClient
          nodes={nodes}
          edges={edges}
          defaultFromSlug="main-gate"
        />
      </Suspense>
    </div>
  );
}
