import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { MapPin, Dumbbell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SportsPage() {
  const [facilities, pulse, booking] = await Promise.all([
    prisma.facility.findMany({ where: { type: "SPORTS" }, include: { node: true } }),
    prisma.pulseStatus.findMany({
      where: { OR: [{ area: { contains: "Sports" } }, { area: { contains: "turf" } }] },
    }),
    prisma.service.findFirst({ where: { slug: "sports-booking" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">Campus</p>
        <h1 className="page-title mt-1">Sports & wellness</h1>
        <p className="page-sub max-w-2xl">
          Facilities, maintenance windows, and booking guidance. Live constraints appear in Campus
          Pulse — do not treat demo listings as official schedules without verification.
        </p>
      </div>

      {pulse.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {pulse.map((p) => (
            <div key={p.id} className="card flex items-start gap-3 p-4">
              <Badge tone={p.status === "OPEN" ? "green" : p.status === "LIMITED" ? "amber" : "red"}>
                {p.status}
              </Badge>
              <div>
                <div className="text-sm font-medium">{p.area}</div>
                <p className="text-xs text-ink-500">{p.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {facilities.length === 0 ? (
        <EmptyState title="No sports facilities listed" />
      ) : (
        facilities.map((f) => (
          <div key={f.id} className="card space-y-3 p-5">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-campus-600" />
              <h2 className="font-display text-lg font-semibold">{f.name}</h2>
            </div>
            <p className="text-sm text-ink-600">{f.description}</p>
            {f.hours && <p className="text-xs font-medium text-campus-800">Hours: {f.hours}</p>}
            <SourceBadge {...f} />
            {f.node && (
              <Link href={`/map?to=${f.node.slug}&from=main-gate`} className="btn-primary inline-flex text-xs">
                <MapPin className="h-3.5 w-3.5" /> Walk here
              </Link>
            )}
          </div>
        ))
      )}

      {booking && (
        <div className="card p-5">
          <h2 className="section-title">{booking.name}</h2>
          <p className="mt-2 text-sm text-ink-600">{booking.description}</p>
          {booking.howToAccess && (
            <p className="mt-2 text-xs text-campus-800">Access: {booking.howToAccess}</p>
          )}
          <Link href="/services" className="btn-secondary mt-3 inline-flex text-xs">
            Service Hub
          </Link>
        </div>
      )}
    </div>
  );
}
