import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MyCampusPage() {
  const student = await prisma.demoStudent.findFirst();
  const favorites = student
    ? await prisma.favorite.findMany({ where: { studentId: student.id } })
    : [];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Campus</h1>
        <p className="page-sub">Favourites for {student?.name || "demo student"}.</p>
      </div>
      <ul className="card divide-y divide-ink-100">
        {favorites.map((f) => {
          const href =
            f.itemType === "course"
              ? `/academics/courses/${f.itemId}`
              : f.itemType === "club"
                ? `/clubs`
                : f.itemType === "node"
                  ? `/map?to=${f.itemId}`
                  : f.itemType === "facility"
                    ? `/library`
                    : "/";
          return (
            <li key={f.id}>
              <Link href={href} className="flex items-center justify-between px-4 py-3 hover:bg-ink-50">
                <div>
                  <div className="text-[11px] uppercase text-ink-400">{f.itemType}</div>
                  <div className="text-sm font-medium">{f.label || f.itemId}</div>
                </div>
              </Link>
            </li>
          );
        })}
        {favorites.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-ink-400">No favourites yet.</li>
        )}
      </ul>
    </div>
  );
}
