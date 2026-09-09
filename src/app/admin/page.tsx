import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AdminGate } from "./AdminGate";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Admin CMS</h1>
          <p className="page-sub">Secure admin mode for content, map topology, pulse, and sources.</p>
        </div>
        <AdminGate />
      </div>
    );
  }

  const [nodes, edges, pulse, notices, uni] = await Promise.all([
    prisma.campusNode.findMany({ orderBy: { name: "asc" } }),
    prisma.campusEdge.findMany({ include: { fromNode: true, toNode: true } }),
    prisma.pulseStatus.findMany({ orderBy: { area: "asc" } }),
    prisma.notice.findMany({ orderBy: { publishedAt: "desc" }, take: 10 }),
    prisma.university.findFirst(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Admin CMS</h1>
        <p className="page-sub">Signed in as {session.name}. Edit map topology, pulse, and review sources.</p>
      </div>
      <AdminDashboard
        nodes={nodes}
        edges={edges.map((e) => ({
          id: e.id,
          fromNodeId: e.fromNodeId,
          toNodeId: e.toNodeId,
          weight: e.weight,
          fromName: e.fromNode.name,
          toName: e.toNode.name,
        }))}
        pulse={pulse}
        notices={notices.map((n) => ({
          id: n.id,
          title: n.title,
          sourceType: n.sourceType,
          status: n.status,
        }))}
        universityName={uni?.name || "Adamas University"}
      />
    </div>
  );
}
