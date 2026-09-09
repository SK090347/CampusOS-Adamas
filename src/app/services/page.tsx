import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">Help</p>
        <h1 className="page-title mt-1">Service Hub</h1>
        <p className="page-sub max-w-2xl">
          How to access campus services — desks, hours, and steps. Contact details are not invented;
          follow in-person guidance at Admin Block where phone numbers are unverified.
        </p>
      </div>

      {services.length === 0 ? (
        <EmptyState title="No services listed" />
      ) : (
        categories.map((cat) => (
          <section key={cat} className="space-y-3">
            <h2 className="section-title">{cat}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {services
                .filter((s) => s.category === cat)
                .map((s) => (
                  <article key={s.id} id={s.slug} className="card scroll-mt-24 space-y-2 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-ink-950">{s.name}</h3>
                      <Badge tone="gold">{s.category}</Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-600">{s.description}</p>
                    {s.howToAccess && (
                      <p className="rounded-lg bg-campus-50 px-3 py-2 text-xs text-campus-950">
                        <strong>How:</strong> {s.howToAccess}
                      </p>
                    )}
                    {s.hours && <p className="text-xs text-ink-500">Hours: {s.hours}</p>}
                    <SourceBadge
                      sourceType={s.sourceType}
                      confidence={s.confidence}
                      status={s.status}
                      compact
                    />
                  </article>
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
