import Link from "next/link";
import {
  ArrowRight,
  Map,
  GraduationCap,
  Activity,
  Bell,
  Users,
  Library,
  Sparkles,
  Utensils,
} from "lucide-react";
import { HomeSearch } from "./HomeSearch";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { SourceBadge } from "@/components/ui/SourceBadge";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [student, notices, pulse, events, uni, schools, clubs] = await Promise.all([
    prisma.demoStudent.findFirst({ include: { programme: true } }),
    prisma.notice.findMany({ orderBy: { publishedAt: "desc" }, take: 4 }),
    prisma.pulseStatus.findMany({ orderBy: { updatedAt: "desc" }, take: 4 }),
    prisma.event.findMany({ orderBy: { startAt: "asc" }, take: 4 }),
    prisma.university.findFirst(),
    prisma.school.count(),
    prisma.club.count(),
  ]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-ink-200/70 bg-[var(--card)] p-6 shadow-soft sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-campus-200/40 blur-3xl" />
        <p className="label-muted">Adamas Knowledge City · Kolkata 700126</p>
        <h1 className="page-title mt-2 max-w-2xl">Everything around your university</h1>
        <p className="page-sub max-w-2xl">
          {uni?.description ||
            "One intelligent operating layer — search, understand, navigate, and act."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="gold">{schools} schools</Badge>
          <Badge tone="neutral">{clubs} clubs</Badge>
          <Badge tone="amber">Leaflet + OpenStreetMap</Badge>
          <Badge tone="green">Knowledge-layer sourced</Badge>
        </div>
        <div className="gold-rule mt-5" />
      </section>

      <section className="card p-5 sm:p-6">
        <HomeSearch />
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Where is my AI class?",
            "Central Library",
            "Robotics club",
            "Who is the Vice Chancellor?",
            "Food Court",
            "Hostel Zone",
          ].map((s) => (
            <Link
              key={s}
              href={`/?q=${encodeURIComponent(s)}`}
              className="rounded-full border border-ink-200 bg-cream/80 px-3 py-1 text-xs text-ink-600 transition hover:border-campus-400 hover:bg-campus-50"
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
            <h2 className="font-display text-lg font-semibold text-ink-950">{student.name}</h2>
            <p className="text-sm text-ink-500">
              {student.programme.name} · Year {student.year} · Sem {student.semester}
            </p>
            <p className="mt-1 text-[11px] text-amber-800">
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
            <Link href="/aura" className="btn-ghost text-xs">
              <Sparkles className="h-3.5 w-3.5" /> Ask AURA
            </Link>
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/map", icon: Map, title: "Campus Map", desc: "OSM + topology routing" },
          { href: "/academics", icon: GraduationCap, title: "Academic OS", desc: "Timetable & courses" },
          { href: "/pulse", icon: Activity, title: "Campus Pulse", desc: "Live area status" },
          { href: "/notices", icon: Bell, title: "Notices", desc: "What changed?" },
          { href: "/people", icon: Users, title: "People OS", desc: "Leadership & faculty" },
          { href: "/library", icon: Library, title: "Library", desc: "In-app resources" },
          { href: "/food", icon: Utensils, title: "Food", desc: "Dining & hours" },
          { href: "/aura", icon: Sparkles, title: "AURA", desc: "Campus assistant" },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="card group p-4 transition hover:shadow-lift hover:shadow-gold">
            <c.icon className="h-5 w-5 text-campus-600 group-hover:text-campus-700" />
            <div className="mt-3 text-sm font-semibold text-ink-950">{c.title}</div>
            <div className="text-xs text-ink-500">{c.desc}</div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Campus Pulse</h2>
            <Link href="/pulse" className="text-xs font-medium text-campus-800 hover:underline">
              All
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {pulse.map((p) => (
              <li key={p.id} className="rounded-lg border border-ink-100 bg-cream/50 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-ink-900">{p.area}</span>
                  <Badge
                    tone={
                      p.status === "OPEN"
                        ? "green"
                        : p.status === "LIMITED"
                          ? "amber"
                          : p.status === "CLOSED"
                            ? "red"
                            : "neutral"
                    }
                  >
                    {p.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-ink-500">{p.message}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Notices</h2>
            <Link href="/notices" className="text-xs font-medium text-campus-800 hover:underline">
              All
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-ink-100">
            {notices.map((n) => (
              <li key={n.id} className="py-3">
                <Link href={`/notices/${n.slug}`} className="block hover:opacity-90">
                  <div className="text-sm font-medium text-ink-950">{n.title}</div>
                  {n.changeSummary && (
                    <p className="mt-0.5 text-xs text-campus-800">What changed: {n.changeSummary}</p>
                  )}
                  <div className="mt-1">
                    <SourceBadge sourceType={n.sourceType} status={n.status} compact />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Upcoming</h2>
            <Link href="/events" className="text-xs font-medium text-campus-800 hover:underline">
              All
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {events.map((e) => (
              <li key={e.id}>
                <Link href={`/events/${e.slug}`} className="block rounded-lg border border-ink-100 px-3 py-2 hover:bg-campus-50/50">
                  <div className="text-sm font-medium text-ink-950">{e.title}</div>
                  <div className="mt-0.5 text-xs text-ink-500">
                    {e.startAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                    {e.location ? ` · ${e.location}` : ""}
                  </div>
                  {e.title.startsWith("DEMO") && (
                    <Badge tone="amber" className="mt-1">
                      Demo-labelled
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {uni && (
        <section className="card p-5">
          <h2 className="section-title">Institution</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">{uni.address}</p>
          <div className="mt-3">
            <SourceBadge
              sourceType={uni.sourceType}
              sourceTitle={uni.sourceTitle}
              sourceURL={uni.sourceURL}
              confidence={uni.confidence}
              status={uni.status}
            />
          </div>
        </section>
      )}
    </div>
  );
}
