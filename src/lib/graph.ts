/** Topology-only pathfinding. Weights are relative hop costs — never meters/GPS. */

export type GraphEdge = {
  from: string;
  to: string;
  weight: number;
  bidirectional: boolean;
};

export type PathResult = {
  nodeIds: string[];
  totalWeight: number;
} | null;

export function shortestPath(
  edges: GraphEdge[],
  fromId: string,
  toId: string
): PathResult {
  if (fromId === toId) return { nodeIds: [fromId], totalWeight: 0 };

  const adj = new Map<string, { to: string; w: number }[]>();
  for (const e of edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from)!.push({ to: e.to, w: e.weight });
    if (e.bidirectional) {
      if (!adj.has(e.to)) adj.set(e.to, []);
      adj.get(e.to)!.push({ to: e.from, w: e.weight });
    }
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();
  dist.set(fromId, 0);
  prev.set(fromId, null);

  while (true) {
    let u: string | null = null;
    let best = Infinity;
    dist.forEach((d, id) => {
      if (!visited.has(id) && d < best) {
        best = d;
        u = id;
      }
    });
    if (u === null) break;
    if (u === toId) break;
    visited.add(u);
    const neighbors = adj.get(u) || [];
    for (let i = 0; i < neighbors.length; i++) {
      const { to, w } = neighbors[i];
      const nd = best + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd);
        prev.set(to, u);
      }
    }
  }

  if (!dist.has(toId)) return null;
  const nodeIds: string[] = [];
  let cur: string | null = toId;
  while (cur) {
    nodeIds.unshift(cur);
    cur = prev.get(cur) ?? null;
  }
  return { nodeIds, totalWeight: dist.get(toId)! };
}
