import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";

export const dynamic = "force-dynamic";

export default async function ClubPage({ params }: { params: { slug: string } }) {
  const club = await prisma.club.findUnique({
    where: { slug: params.slug },
    include: { events: { orderBy: { startAt: "asc" } } },
  });
  if (!club) notFound();
  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">{club.category}</p>
        <h1 className="page-title">{club.name}</h1>
        <p className="page-sub">{club.description}</p>
      </div>
      <div className="card space-y-3 p-5">
        <SourceBadge {...club} />
        {club.meetingInfo && <p className="text-sm text-ink-600">{club.meetingInfo}</p>}
      </div>
      {club.events.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold">Events</h2>
          <ul className="card divide-y divide-ink-100">
            {club.events.map((e) => (
              <li key={e.id}>
                <Link href={`/events/${e.slug}`} className="block px-4 py-3 text-sm hover:bg-ink-50">
                  {e.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
