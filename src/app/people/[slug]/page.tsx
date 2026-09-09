import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";

export const dynamic = "force-dynamic";

export default async function PersonPage({ params }: { params: { slug: string } }) {
  const person = await prisma.person.findUnique({
    where: { slug: params.slug },
    include: { school: true, courses: true },
  });
  if (!person) notFound();
  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">{person.role}</p>
        <h1 className="page-title">{person.name}</h1>
        <p className="page-sub">{person.designation}{person.school ? ` · ${person.school.name}` : ""}</p>
      </div>
      <div className="card space-y-4 p-5">
        <SourceBadge {...person} />
        {person.bio && <p className="text-sm text-ink-700">{person.bio}</p>}
        {person.email && (
          <p className="text-sm text-ink-500">
            Email (demo): <span className="text-ink-800">{person.email}</span>
          </p>
        )}
      </div>
      {person.courses.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold">Courses</h2>
          <ul className="card divide-y divide-ink-100">
            {person.courses.map((c) => (
              <li key={c.id} className="px-4 py-3 text-sm">
                {c.code} · {c.name}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
