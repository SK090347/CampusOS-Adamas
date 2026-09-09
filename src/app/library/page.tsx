import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const [resources, facility] = await Promise.all([
    prisma.libraryResource.findMany({ orderBy: { title: "asc" } }),
    prisma.facility.findFirst({ where: { type: "LIBRARY" }, include: { node: true } }),
  ]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Library</h1>
        <p className="page-sub">Link-out resources and campus library info. External sites open in a new tab.</p>
      </div>
      {facility && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold">{facility.name}</h2>
          <p className="mt-1 text-sm text-ink-600">{facility.description}</p>
          {facility.hours && <p className="mt-2 text-xs text-ink-500">Hours: {facility.hours}</p>}
          <SourceBadge {...facility} />
          {facility.node && (
            <Link href={`/map?to=${facility.node.slug}&from=main-gate`} className="btn-secondary mt-3 inline-flex text-xs">
              Walk to library
            </Link>
          )}
        </div>
      )}
      <ul className="card divide-y divide-ink-100">
        {resources.map((r) => (
          <li key={r.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-ink-400">{r.type}</div>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-950 hover:text-campus-700">
                  {r.title} <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {r.description && <p className="mt-1 text-xs text-ink-500">{r.description}</p>}
                <div className="mt-2"><SourceBadge {...r} compact /></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
