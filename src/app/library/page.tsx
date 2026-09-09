import prisma from "@/lib/prisma";
import { OfficialPanel } from "@/components/content/OfficialPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const [resources, facility] = await Promise.all([
    prisma.libraryResource.findMany({ orderBy: { title: "asc" } }),
    prisma.facility.findFirst({ where: { type: "LIBRARY" }, include: { node: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">Learn</p>
        <h1 className="page-title mt-1">Library</h1>
        <p className="page-sub max-w-2xl">
          In-app resource panels with official-source attribution. Embeds open only for allowlisted
          HTTPS sites — CampusOS never bypasses logins or scrapes behind authentication.
        </p>
      </div>

      {facility && (
        <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-950">{facility.name}</h2>
            <p className="text-sm text-ink-500">{facility.description}</p>
            {facility.hours && (
              <p className="mt-1 text-xs font-medium text-campus-800">Hours: {facility.hours}</p>
            )}
          </div>
          {facility.node && (
            <Link
              href={`/map?to=${facility.node.slug}&from=main-gate`}
              className="btn-primary text-xs"
            >
              <MapPin className="h-3.5 w-3.5" /> Walk to library
            </Link>
          )}
        </div>
      )}

      {resources.length === 0 ? (
        <EmptyState title="No library resources seeded" description="Admins can add resources later." />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(resources.map((r) => r.type))).map((t) => (
              <Badge key={t} tone="gold">
                {t}
              </Badge>
            ))}
          </div>
          {resources.map((r) => (
            <OfficialPanel
              key={r.id}
              title={r.title}
              summary={r.description}
              url={r.url}
              provider={r.provider}
              sourceType={r.sourceType}
              sourceTitle={r.sourceTitle}
              sourceURL={r.sourceURL || r.url}
              confidence={r.confidence}
              status={r.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
