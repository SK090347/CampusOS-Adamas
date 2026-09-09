import Link from "next/link";
import { ArrowRight, Map, GraduationCap, Activity, Bell } from "lucide-react";
import { HomeSearch } from "./HomeSearch";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [student, notices, pulse, events, uni] = await Promise.all([
    prisma.demoStudent.findFirst({ include: { programme: true } }),
    prisma.notice.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.pulseStatus.findMany({ orderBy: { updatedAt: "desc" }, take: 4 }),
    prisma.event.findMany({ orderBy: { startAt: "asc" }, take: 3 }),
    prisma.university.findFirst(),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <p className="label-muted">Adamas Knowledge City</p>
        <h1 className="page-title mt-1">Everything around your university</h1>
        <p className="page-sub max-w-2xl">
          {uni?.description ||
            "One intelligent operating layer — search, understand, navigate, and act."}
        </p>
      </section>

      <section className="card p-5 sm:p-6">
        <HomeSearch />
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Where is my AI class?",
            "Central Library",
            "Robotics club",
            "Who is the Vice Chancellor?",
          ].map((s) => (
            <Link
              key={s}
              href={`/?q=${encodeURIComponent(s)}`}
              className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs text-ink-600 hover:bg-white"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>

      {student && (
        <section className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label-muted">Demo student</p>
            <h2 className="text-lg font-semibold text-ink-950">{student.name}</h2>
            <p className="text-sm text-ink-500">
              {student.programme.name} · Year {student.year} · Sem {student.semester}
            </p>
            <p className="mt-1 text-[11px] text-amber-700">
              Fictional demo profile — no real student PII.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/academics" className="btn-primary text-xs">
              Open Academic OS <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/map?to=soet-block&from=main-gate" className="btn-secondary text-xs">
              Walk to SOET
            </Link>
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/map", icon: Map, title: "Campus Map", desc: "Topology navigation" },
          { href: "/academics", icon: GraduationCap, title: "Academic OS", desc: "Timetable & courses" },
          { href: "/pulse", icon: Activity, title: "Campus Pulse", desc: "Live area status" },
          { href: "/notices", icon: Bell, title: "Notices", desc: "What changed?" },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="card group p-4 transition hover:shadow-lift">
            <c.icon className="h-5 w-5 text-ink-400 group-hover:text-campus-600" />
            <div className="mt-3 text-sm font-semibold text-ink-950">{c.title}</div>
            <div className="text-xs text-ink-500">{c.desc}</div>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">Campus Pulse</h2>
            <Link href="/pulse" className="text-xs text-campus-700 hover:underline">
              View all
            </Link>
          </div>
          <ul className="card divide-y divide-ink-100">
            {pulse.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-ink-900">{p.area}</div>
                  <div className="text-xs text-ink-500">{p.message}</div>
                </div>
                <Badge
                  tone={
                    p.status === "OPEN"
                      ? "green"
                      : p.status === "LIMITED"
                        ? "amber"
                        : p.status === "CLOSED"
                          ? "red"
                          : "blue"
                  }
                >
                  {p.status}
                </Badge>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">Latest notices</h2>
            <Link href="/notices" className="text-xs text-campus-700 hover:underline">
              View all
            </Link>
          </div>
          <ul className="card divide-y divide-ink-100">
            {notices.map((n) => (
              <li key={n.id}>
                <Link href={`/notices/${n.slug}`} className="block px-4 py-3 hover:bg-ink-50">
                  <div className="text-sm font-medium text-ink-900">{n.title}</div>
                  {n.changeSummary && (
                    <div className="mt-0.5 text-xs text-campus-700">
                      What changed: {n.changeSummary}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mb-3 mt-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">Upcoming events</h2>
            <Link href="/events" className="text-xs text-campus-700 hover:underline">
              View all
            </Link>
          </div>
          <ul className="card divide-y divide-ink-100">
            {events.map((e) => (
              <li key={e.id}>
                <Link href={`/events/${e.slug}`} className="block px-4 py-3 hover:bg-ink-50">
                  <div className="text-sm font-medium text-ink-900">{e.title}</div>
                  <div className="text-xs text-ink-500">
                    {new Date(e.startAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}{" "}
                    IST
                    {e.location ? ` · ${e.location}` : ""}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
