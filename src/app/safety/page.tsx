import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";

export const dynamic = "force-dynamic";

export default async function SafetyPage() {
  const contacts = await prisma.emergencyContact.findMany();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Safety</h1>
        <p className="page-sub">
          CampusOS does not invent emergency phone numbers. Use verified guidance and national services.
        </p>
      </div>
      <div className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-700">
        India national emergency number: <strong>112</strong> (government service — not a campus-invented number).
      </div>
      <ul className="space-y-3">
        {contacts.map((c) => (
          <li key={c.id} className="card space-y-2 p-5">
            <h2 className="text-sm font-semibold">{c.label}</h2>
            <p className="text-sm text-ink-700">{c.description}</p>
            {c.contactHint && <p className="text-xs text-ink-600">{c.contactHint}</p>}
            <SourceBadge {...c} />
          </li>
        ))}
      </ul>
    </div>
  );
}
