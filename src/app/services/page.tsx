import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { category: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Service Hub</h1>
        <p className="page-sub">How to access campus services.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((s) => (
          <div key={s.id} id={s.slug} className="card scroll-mt-20 space-y-2 p-4">
            <div className="text-[11px] uppercase text-ink-400">{s.category}</div>
            <h2 className="text-sm font-semibold">{s.name}</h2>
            <p className="text-xs text-ink-600">{s.description}</p>
            {s.howToAccess && <p className="text-xs text-ink-800"><strong>Access:</strong> {s.howToAccess}</p>}
            {s.hours && <p className="text-[11px] text-ink-500">{s.hours}</p>}
            <SourceBadge {...s} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
