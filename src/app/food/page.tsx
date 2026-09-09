import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FoodPage() {
  const [facilities, pulse] = await Promise.all([
    prisma.facility.findMany({ where: { type: "FOOD" }, include: { node: true } }),
    prisma.pulseStatus.findFirst({ where: { area: { contains: "Food" } } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">Campus</p>
        <h1 className="page-title mt-1">Food</h1>
        <p className="page-sub max-w-2xl">
          Dining facilities on campus. Hours and counters can change — check Campus Pulse for
          live status. Menus are not invented here.
        </p>
      </div>

      {pulse && (
        <div className="card flex flex-wrap items-center gap-3 p-4">
          <Badge tone={pulse.status === "OPEN" ? "green" : "amber"}>{pulse.status}</Badge>
          <div>
            <div className="text-sm font-medium text-ink-900">{pulse.area}</div>
            <p className="text-xs text-ink-500">{pulse.message}</p>
          </div>
          <Link href="/pulse" className="ml-auto text-xs font-medium text-campus-800 hover:underline">
            Campus Pulse
          </Link>
        </div>
      )}

      {facilities.length === 0 ? (
        <EmptyState title="No food facilities listed" description="Ask admin to add dining POIs." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {facilities.map((f) => (
            <div key={f.id} className="card space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-ink-950">{f.name}</h2>
                <Badge tone="gold">{f.type}</Badge>
              </div>
              <p className="text-sm leading-relaxed text-ink-600">{f.description}</p>
              {f.hours && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-campus-800">
                  <Clock className="h-3.5 w-3.5" /> {f.hours}
                </p>
              )}
              <SourceBadge
                sourceType={f.sourceType}
                sourceTitle={f.sourceTitle}
                sourceURL={f.sourceURL}
                confidence={f.confidence}
                status={f.status}
              />
              {f.node && (
                <Link
                  href={`/map?to=${f.node.slug}&from=main-gate`}
                  className="btn-primary inline-flex text-xs"
                >
                  <MapPin className="h-3.5 w-3.5" /> Walk here
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
