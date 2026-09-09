import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PulsePage() {
  const pulse = await prisma.pulseStatus.findMany({ orderBy: { area: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Campus Pulse</h1>
        <p className="page-sub">Admin-maintained status for key campus areas.</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {pulse.map((p) => (
          <li key={p.id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-semibold text-ink-950">{p.area}</h2>
              <Badge tone={p.status === "OPEN" ? "green" : p.status === "LIMITED" ? "amber" : p.status === "CLOSED" ? "red" : "blue"}>{p.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-ink-600">{p.message}</p>
            <p className="mt-2 text-[11px] text-ink-400">
              Updated {new Date(p.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
              {p.updatedBy ? ` · ${p.updatedBy}` : ""}
            </p>
          </li>
        ))}
      </ul>
      <Link href="/admin" className="btn-secondary text-xs">Edit in Admin CMS</Link>
    </div>
  );
}
