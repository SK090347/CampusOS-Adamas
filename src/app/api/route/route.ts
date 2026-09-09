import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { shortestPath } from "@/lib/graph";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  if (!from || !to) {
    return NextResponse.json({ error: "from and to required (node id or slug)" }, { status: 400 });
  }

  const nodes = await prisma.campusNode.findMany();
  const resolve = (key: string) =>
    nodes.find((n) => n.id === key || n.slug === key) || null;

  const fromNode = resolve(from);
  const toNode = resolve(to);
  if (!fromNode || !toNode) {
    return NextResponse.json({ error: "Unknown node" }, { status: 404 });
  }

  const edges = await prisma.campusEdge.findMany();
  const path = shortestPath(
    edges.map((e) => ({
      from: e.fromNodeId,
      to: e.toNodeId,
      weight: e.weight,
      bidirectional: e.bidirectional,
    })),
    fromNode.id,
    toNode.id
  );

  if (!path) {
    return NextResponse.json({ error: "No topology path", path: null }, { status: 404 });
  }

  const ordered = path.nodeIds.map((id) => nodes.find((n) => n.id === id)!);

  return NextResponse.json({
    from: fromNode,
    to: toNode,
    nodeIds: path.nodeIds,
    nodes: ordered,
    relativeWeight: path.totalWeight,
    note: "relativeWeight is topology hop cost — not meters or GPS distance",
  });
}
