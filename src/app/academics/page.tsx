import Link from "next/link";
import prisma from "@/lib/prisma";
import { DAY_FULL } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AcademicsPage() {
  const student = await prisma.demoStudent.findFirst({
    include: {
      programme: { include: { school: true, department: true } },
      timetableSlots: {
        include: {
          course: { include: { faculty: true } },
          room: { include: { building: true } },
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
  });

  if (!student) {
    return (
      <div>
        <h1 className="page-title">Academic OS</h1>
        <p className="page-sub">Demo student not seeded. Run npm run db:seed.</p>
      </div>
    );
  }

  const byDay = new Map<number, typeof student.timetableSlots>();
  for (const s of student.timetableSlots) {
    if (!byDay.has(s.dayOfWeek)) byDay.set(s.dayOfWeek, []);
    byDay.get(s.dayOfWeek)!.push(s);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Academic OS</h1>
        <p className="page-sub">
          Timetable and courses for {student.name} · {student.programme.name}
        </p>
      </div>

      <section className="card p-5">
        <p className="label-muted">Programme</p>
        <h2 className="text-lg font-semibold">{student.programme.name}</h2>
        <p className="text-sm text-ink-500">
          {student.programme.school.name}
          {student.programme.department
            ? ` · ${student.programme.department.name}`
            : ""}{" "}
          · Year {student.year} · Semester {student.semester}
        </p>
        <Badge tone="amber" className="mt-2">
          Fictional demo enrolment
        </Badge>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink-900">Weekly timetable</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((day) => (
            <div key={day} className="card overflow-hidden">
              <div className="border-b border-ink-100 bg-ink-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
                {DAY_FULL[day]}
              </div>
              <ul className="divide-y divide-ink-100">
                {(byDay.get(day) || []).length === 0 && (
                  <li className="px-4 py-3 text-sm text-ink-400">No classes</li>
                )}
                {(byDay.get(day) || []).map((slot) => (
                  <li key={slot.id}>
                    <Link
                      href={`/academics/courses/${slot.course.id}`}
                      className="flex flex-col gap-1 px-4 py-3 hover:bg-ink-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-ink-950">
                          {slot.course.code} · {slot.course.name}
                        </div>
                        <div className="text-xs text-ink-500">
                          {slot.room
                            ? `${slot.room.code || slot.room.name} · ${slot.room.building.name}`
                            : "Room TBA"}
                          {slot.course.faculty ? ` · ${slot.course.faculty.name}` : ""}
                        </div>
                      </div>
                      <div className="text-xs font-medium tabular-nums text-ink-600">
                        {slot.startTime}–{slot.endTime}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/exams" className="btn-secondary text-xs">
          Exams
        </Link>
        <Link href="/schools" className="btn-secondary text-xs">
          Academic Universe
        </Link>
        <Link href="/map?to=soet-block&from=main-gate" className="btn-primary text-xs">
          Navigate to SOET
        </Link>
      </div>
    </div>
  );
}
