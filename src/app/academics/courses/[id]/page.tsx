import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Navigation } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      faculty: true,
      room: { include: { building: true } },
      programme: true,
      timetableSlots: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
    },
  });
  if (!course) notFound();

  const nodeId = course.room?.building?.nodeId;
  const node = nodeId
    ? await prisma.campusNode.findUnique({ where: { id: nodeId } })
    : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">Course</p>
        <h1 className="page-title">
          {course.code} · {course.name}
        </h1>
        <p className="page-sub">{course.description}</p>
      </div>

      <div className="card space-y-4 p-5">
        <SourceBadge
          sourceType={course.sourceType}
          sourceTitle={course.sourceTitle}
          sourceURL={course.sourceURL}
          confidence={course.confidence}
          status={course.status}
        />
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="label-muted">Credits</dt>
            <dd>{course.credits ?? "—"}</dd>
          </div>
          <div>
            <dt className="label-muted">Semester</dt>
            <dd>{course.semester ?? "—"}</dd>
          </div>
          <div>
            <dt className="label-muted">Faculty</dt>
            <dd>
              {course.faculty ? (
                <Link href={`/people/${course.faculty.slug}`} className="text-campus-700 hover:underline">
                  {course.faculty.name}
                </Link>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="label-muted">Room</dt>
            <dd>
              {course.room
                ? `${course.room.code || course.room.name} · ${course.room.building.name}`
                : "—"}
            </dd>
          </div>
        </dl>

        {node && (
          <Link
            href={`/map?to=${node.slug}&from=main-gate`}
            className="btn-primary inline-flex"
          >
            <Navigation className="h-4 w-4" /> Navigate to class
          </Link>
        )}
      </div>

      {course.timetableSlots.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold">Scheduled slots</h2>
          <ul className="card divide-y divide-ink-100">
            {course.timetableSlots.map((s) => (
              <li key={s.id} className="px-4 py-3 text-sm">
                Day {s.dayOfWeek} · {s.startTime}–{s.endTime}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
