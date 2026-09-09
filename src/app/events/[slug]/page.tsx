import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Navigation } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    include: { club: true, venueNode: true },
  });
  if (!event) notFound();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">{event.title}</h1>
        <p className="page-sub">{event.description}</p>
      </div>
      <div className="card space-y-3 p-5">
        <SourceBadge {...event} />
        <p className="text-sm text-ink-700">
          {new Date(event.startAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" })} IST
        </p>
        {event.location && <p className="text-sm text-ink-600">{event.location}</p>}
        {event.club && (
          <Link href={`/clubs/${event.club.slug}`} className="text-sm text-campus-700 hover:underline">
            {event.club.name}
          </Link>
        )}
        {event.venueNode && (
          <Link href={`/map?to=${event.venueNode.slug}&from=main-gate`} className="btn-primary inline-flex text-xs">
            <Navigation className="h-3.5 w-3.5" /> Walk to venue
          </Link>
        )}
      </div>
    </div>
  );
}
