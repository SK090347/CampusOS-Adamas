import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClubsPage() {
  const clubs = await prisma.club.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Clubs</h1>
          <p className="page-sub">All 15 campus clubs · find your fit.</p>
        </div>
        <Link href="/clubs/quiz" className="btn-primary text-xs">Find your club quiz</Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((c) => (
          <Link key={c.id} href={`/clubs/${c.slug}`} className="card block p-4 hover:shadow-lift">
            <div className="text-[11px] font-medium uppercase tracking-wide text-ink-400">{c.category}</div>
            <h2 className="mt-1 text-sm font-semibold text-ink-950">{c.name}</h2>
            <p className="mt-1 line-clamp-2 text-xs text-ink-500">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
