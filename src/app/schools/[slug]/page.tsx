import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";

export const dynamic = "force-dynamic";

export default async function SchoolPage({ params }: { params: { slug: string } }) {
  const school = await prisma.school.findUnique({
    where: { slug: params.slug },
    include: {
      departments: true,
      programmes: true,
      faculty: { take: 12 },
    },
  });
  if (!school) notFound();
  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">{school.shortName}</p>
        <h1 className="page-title">{school.name}</h1>
        <p className="page-sub">{school.description}</p>
      </div>
      <div className="card p-4">
        <SourceBadge {...school} />
      </div>
      {school.departments.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold">Departments</h2>
          <ul className="card divide-y divide-ink-100">
            {school.departments.map((d) => (
              <li key={d.id} className="px-4 py-3 text-sm">{d.name}</li>
            ))}
          </ul>
        </section>
      )}
      {school.programmes.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold">Programmes</h2>
          <ul className="card divide-y divide-ink-100">
            {school.programmes.map((p) => (
              <li key={p.id} className="px-4 py-3 text-sm">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-ink-500">{p.degree}{p.duration ? ` · ${p.duration}` : ""}</div>
              </li>
            ))}
          </ul>
        </section>
      )}
      {school.faculty.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold">People</h2>
          <ul className="card divide-y divide-ink-100">
            {school.faculty.map((p) => (
              <li key={p.id}>
                <Link href={`/people/${p.slug}`} className="block px-4 py-3 text-sm hover:bg-ink-50">
                  {p.name} · {p.designation || p.role}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
