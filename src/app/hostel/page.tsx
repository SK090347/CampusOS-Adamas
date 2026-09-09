import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { MapPin, BedDouble } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HostelPage() {
  const [hostels, services] = await Promise.all([
    prisma.hostel.findMany({ orderBy: { name: "asc" }, include: { building: true } }),
    prisma.service.findMany({ where: { category: "Housing" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">Campus</p>
        <h1 className="page-title mt-1">Hostel</h1>
        <p className="page-sub max-w-2xl">
          Residential listings for orientation. Allocations, fees, and rules must be confirmed with
          university housing — CampusOS does not invent official hostel policy.
        </p>
      </div>

      <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-base font-semibold">Hostel Zone</h2>
          <p className="text-sm text-ink-500">
            Approximate map overlay landmark for the residential cluster.
          </p>
        </div>
        <Link href="/map?to=hostel-zone&from=main-gate" className="btn-primary text-xs">
          <MapPin className="h-3.5 w-3.5" /> Walk to Hostel Zone
        </Link>
      </div>

      {hostels.length === 0 ? (
        <EmptyState title="No hostels listed" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {hostels.map((h) => (
            <div key={h.id} className="card p-5">
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-campus-600" />
                <Badge tone="neutral">{h.type}</Badge>
              </div>
              <h2 className="mt-2 font-display text-base font-semibold text-ink-950">{h.name}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{h.description}</p>
              {h.capacity != null && (
                <p className="mt-2 text-xs text-ink-400">Indicative capacity field: {h.capacity}</p>
              )}
              <div className="mt-3">
                <SourceBadge
                  sourceType={h.sourceType}
                  sourceTitle={h.sourceTitle}
                  confidence={h.confidence}
                  status={h.status}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {services.length > 0 && (
        <section className="space-y-3">
          <h2 className="section-title">Related services</h2>
          {services.map((s) => (
            <div key={s.id} className="card p-4">
              <h3 className="text-sm font-semibold text-ink-950">{s.name}</h3>
              <p className="mt-1 text-xs text-ink-500">{s.description}</p>
              {s.howToAccess && (
                <p className="mt-2 text-xs text-campus-800">How: {s.howToAccess}</p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
