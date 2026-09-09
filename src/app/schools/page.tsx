import Link from "next/link";
import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function SchoolsPage() {
  const schools = await prisma.school.findMany({
    orderBy: { name: "asc" },
    include: {
      departments: { orderBy: { name: "asc" } },
      programmes: { orderBy: { name: "asc" } },
      _count: { select: { faculty: true } },
    },
  });

  if (schools.length === 0) {
    return (
      <EmptyState
        title="No schools seeded"
        description="Run npm run db:seed to load the Academic Universe."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">Learn</p>
        <h1 className="page-title mt-1">Academic Universe</h1>
        <p className="page-sub max-w-2xl">
          All {schools.length} schools of Adamas University with departments and programmes.
          Verify current intake and curricula on the official university site.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {schools.map((s) => (
          <Link
            key={s.id}
            href={`/schools/${s.slug}`}
            className="card block p-5 transition hover:shadow-lift hover:shadow-gold"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.12em] text-campus-700">
                  {s.shortName}
                </div>
                <h2 className="mt-1 font-display text-base font-semibold text-ink-950">{s.name}</h2>
              </div>
              <Badge tone="neutral">{s._count.faculty} people</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-600 line-clamp-3">{s.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge tone="gold">{s.departments.length} depts</Badge>
              <Badge tone="amber">{s.programmes.length} programmes</Badge>
            </div>
            {s.departments.length > 0 && (
              <ul className="mt-3 space-y-1 border-t border-ink-100 pt-3">
                {s.departments.slice(0, 3).map((d) => (
                  <li key={d.id} className="text-xs text-ink-500">
                    · {d.name}
                  </li>
                ))}
                {s.departments.length > 3 && (
                  <li className="text-xs text-ink-400">+ {s.departments.length - 3} more</li>
                )}
              </ul>
            )}
            <div className="mt-3">
              <SourceBadge
                sourceType={s.sourceType}
                status={s.status}
                confidence={s.confidence}
                compact
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
