import Link from "next/link";
import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";

export const dynamic = "force-dynamic";

export default async function SchoolsPage() {
  const schools = await prisma.school.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Academic Universe</h1>
        <p className="page-sub">The ten schools of Adamas University.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {schools.map((s) => (
          <Link key={s.id} href={`/schools/${s.slug}`} className="card block p-4 transition hover:shadow-lift">
            <div className="text-[11px] font-medium text-ink-400">{s.shortName}</div>
            <h2 className="mt-1 text-sm font-semibold text-ink-950">{s.name}</h2>
            <p className="mt-1 text-xs text-ink-500 line-clamp-2">{s.description}</p>
            <div className="mt-3">
              <SourceBadge sourceType={s.sourceType} status={s.status} confidence={s.confidence} compact />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
