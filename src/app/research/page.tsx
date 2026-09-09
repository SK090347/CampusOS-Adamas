import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const centers = await prisma.researchCenter.findMany({ include: { laboratories: true } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Research</h1>
        <p className="page-sub">Centres and labs listed in CampusOS (verify with official channels).</p>
      </div>
      {centers.map((c) => (
        <div key={c.id} className="card space-y-3 p-5">
          <h2 className="text-lg font-semibold">{c.name}</h2>
          <p className="text-sm text-ink-600">{c.description}</p>
          {c.focus && <p className="text-xs text-ink-500">Focus: {c.focus}</p>}
          <SourceBadge {...c} />
          {c.laboratories.length > 0 && (
            <ul className="text-sm text-ink-700">
              {c.laboratories.map((l) => (
                <li key={l.id}>· {l.name}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
