import Link from "next/link";
import prisma from "@/lib/prisma";
import { PeopleFilters } from "./PeopleFilters";

export const dynamic = "force-dynamic";

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string };
}) {
  const q = (searchParams.q || "").trim();
  const role = searchParams.role || "";
  const people = await prisma.person.findMany({
    where: {
      AND: [
        role ? { role } : {},
        q
          ? {
              OR: [
                { name: { contains: q } },
                { designation: { contains: q } },
                { bio: { contains: q } },
              ],
            }
          : {},
      ],
    },
    include: { school: true },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">People OS</h1>
        <p className="page-sub">Leadership, faculty, and staff — with source metadata.</p>
      </div>
      <PeopleFilters initialQ={q} initialRole={role} />
      <ul className="card divide-y divide-ink-100">
        {people.map((p) => (
          <li key={p.id}>
            <Link href={`/people/${p.slug}`} className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-ink-50">
              <div>
                <div className="text-sm font-medium text-ink-950">{p.name}</div>
                <div className="text-xs text-ink-500">
                  {p.designation || p.role}
                  {p.school ? ` · ${p.school.shortName || p.school.name}` : ""}
                </div>
              </div>
              <span className="text-[11px] uppercase tracking-wide text-ink-400">{p.role}</span>
            </Link>
          </li>
        ))}
        {people.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-ink-400">No matches.</li>
        )}
      </ul>
    </div>
  );
}
