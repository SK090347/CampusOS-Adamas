import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FoodPage() {
  const facilities = await prisma.facility.findMany({ where: { type: "FOOD" }, include: { node: true } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Food</h1>
        <p className="page-sub">Campus dining facilities.</p>
      </div>
      {facilities.map((f) => (
        <div key={f.id} className="card space-y-3 p-5">
          <h2 className="text-lg font-semibold">{f.name}</h2>
          <p className="text-sm text-ink-600">{f.description}</p>
          {f.hours && <p className="text-xs text-ink-500">Hours: {f.hours}</p>}
          <SourceBadge {...f} />
          {f.node && (
            <Link href={`/map?to=${f.node.slug}&from=main-gate`} className="btn-primary inline-flex text-xs">Walk here</Link>
          )}
        </div>
      ))}
    </div>
  );
}
