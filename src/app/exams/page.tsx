import Link from "next/link";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  const exams = await prisma.exam.findMany({
    include: { course: true, room: { include: { building: true } } },
    orderBy: { startsAt: "asc" },
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Exams</h1>
        <p className="page-sub">Schedule only — CampusOS never shows fake grades.</p>
      </div>
      <Badge tone="amber">No grades published in this system</Badge>
      <ul className="card divide-y divide-ink-100">
        {exams.map((e) => (
          <li key={e.id} className="px-4 py-4">
            <div className="text-sm font-semibold text-ink-950">{e.title}</div>
            <div className="text-xs text-ink-500">
              {e.course.code} · {e.course.name}
            </div>
            <div className="mt-1 text-xs text-ink-600">
              {new Date(e.startsAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST
              {e.room ? ` · ${e.room.code || e.room.name}` : ""}
            </div>
            {e.room?.building.nodeId && (
              <Link href={`/map?to=${e.room.building.nodeId}&from=main-gate`} className="mt-2 inline-block text-xs text-campus-700 hover:underline">
                Navigate to exam venue
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
