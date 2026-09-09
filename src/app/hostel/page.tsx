import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HostelPage() {
  const hostels = await prisma.hostel.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Hostel</h1>
        <p className="page-sub">Residential listings (demo). Verify allocations with university housing.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {hostels.map((h) => (
          <div key={h.id} className="card p-4">
            <div className="text-[11px] uppercase text-ink-400">{h.type}</div>
            <h2 className="text-sm font-semibold">{h.name}</h2>
            <p className="mt-1 text-xs text-ink-500">{h.description}</p>
            <div className="mt-3"><SourceBadge {...h} /></div>
          </div>
        ))}
      </div>
      <Link href="/map?to=hostel-zone&from=main-gate" className="btn-secondary text-xs">Walk to Hostel Zone</Link>
    </div>
  );
}
