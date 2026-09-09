import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SportsPage() {
  const facilities = await prisma.facility.findMany({ where: { type: "SPORTS" }, include: { node: true } });
  const pulse = await prisma.pulseStatus.findMany({ where: { area: { contains: "Sports" } } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Sports & Wellness</h1>
        <p className="page-sub">Facilities and live pulse for sports areas.</p>
      </div>
      {pulse.map((p) => (
        <div key={p.id} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>{p.area}:</strong> {p.message} ({p.status})
        </div>
      ))}
      {facilities.map((f) => (
        <div key={f.id} className="card space-y-3 p-5">
          <h2 className="text-lg font-semibold">{f.name}</h2>
          <p className="text-sm text-ink-600">{f.description}</p>
          {f.hours && <p className="text-xs text-ink-500">Hours: {f.hours}</p>}
          <SourceBadge {...f} />
          {f.node && (
            <Link href={`/map?to=${f.node.slug}&from=main-gate`} className="btn-primary inline-flex text-xs">Walk here</Link>
          )}
        </div>
      ))}
      <Link href="/clubs/crossfit-health" className="btn-secondary text-xs">CrossFit–Health club</Link>
    </div>
  );
}
