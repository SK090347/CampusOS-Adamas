import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startAt: "asc" },
    include: { club: true },
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Events</h1>
        <p className="page-sub">Campus happenings with optional map venues.</p>
      </div>
      <ul className="card divide-y divide-ink-100">
        {events.map((e) => (
          <li key={e.id}>
            <Link href={`/events/${e.slug}`} className="block px-4 py-4 hover:bg-ink-50">
              <div className="text-sm font-semibold text-ink-950">{e.title}</div>
              <div className="mt-0.5 text-xs text-ink-500">
                {new Date(e.startAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST
                {e.location ? ` · ${e.location}` : ""}
                {e.club ? ` · ${e.club.name}` : ""}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
