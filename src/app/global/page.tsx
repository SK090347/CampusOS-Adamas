import prisma from "@/lib/prisma";
import { SourceBadge, DiscrepancyAlert } from "@/components/ui/SourceBadge";

export const dynamic = "force-dynamic";

export default async function GlobalPage() {
  const claims = await prisma.globalClaim.findMany({ orderBy: { createdAt: "asc" } });
  const hasConflict = claims.some((c) => c.status === "CONFLICT");
  const secondary = claims.filter((c) => c.sourceType === "SECONDARY");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Global Adamas</h1>
        <p className="page-sub">
          Sourced institutional claims only. Secondary sources are never presented as official policy.
        </p>
      </div>
      {hasConflict && (
        <DiscrepancyAlert sources={claims.filter((c) => c.status === "CONFLICT").map((c) => c.title)} />
      )}
      {secondary.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Some claims below are secondary. Treat them as context, not official university statements.
        </div>
      )}
      <ul className="space-y-3">
        {claims.map((c) => (
          <li key={c.id} className="card space-y-3 p-5">
            <h2 className="text-sm font-semibold text-ink-950">{c.title}</h2>
            <p className="text-sm text-ink-700">{c.claim}</p>
            <SourceBadge {...c} />
          </li>
        ))}
      </ul>
    </div>
  );
}
