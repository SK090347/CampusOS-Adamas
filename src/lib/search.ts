import prisma from "@/lib/prisma";

export type SearchHit = {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  href: string;
  score: number;
  meta?: Record<string, string>;
};

function scoreText(q: string, ...fields: (string | null | undefined)[]) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hay = fields.filter(Boolean).join(" ").toLowerCase();
  let score = 0;
  for (const t of terms) {
    if (!t) continue;
    if (hay.includes(t)) score += 2;
    if (hay.startsWith(t)) score += 1;
    if (hay.split(/\s+/).some((w) => w.startsWith(t))) score += 1;
  }
  return score;
}

/** Natural-language oriented search over structured CampusOS data. */
export async function campusSearch(query: string): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  const lower = q.toLowerCase();

  const hits: SearchHit[] = [];

  const wantsClass =
    /class|lecture|ai|machine learning|ml|timetable|where is my|schedule|semester/i.test(q);
  const wantsPeople = /who is|vice chancellor|chancellor|dean|faculty|professor|dr\.|prof/i.test(q);
  const wantsNav = /where|navigate|map|go to|walk|find|locate|gate|hostel|library|food|sports/i.test(q);
  const wantsClub = /club|society|robotics|music|dance|coding/i.test(q);

  const [courses, rooms, nodes, people, clubs, events, notices, schools, facilities, services, hostels] =
    await Promise.all([
      prisma.course.findMany({
        include: { room: { include: { building: { include: { node: true } } } }, faculty: true, programme: true },
      }),
      prisma.room.findMany({ include: { building: { include: { node: true } } } }),
      prisma.campusNode.findMany(),
      prisma.person.findMany({ include: { school: true } }),
      prisma.club.findMany(),
      prisma.event.findMany({ take: 30, orderBy: { startAt: "asc" } }),
      prisma.notice.findMany({ take: 30, orderBy: { publishedAt: "desc" } }),
      prisma.school.findMany({ include: { departments: true, programmes: true } }),
      prisma.facility.findMany({ include: { node: true } }),
      prisma.service.findMany(),
      prisma.hostel.findMany(),
    ]);

  for (const c of courses) {
    let s = scoreText(q, c.name, c.code, c.description, c.programme?.name, c.faculty?.name);
    if (wantsClass && /artificial intelligence|ai\b|machine learning/i.test(`${c.name} ${c.code}`)) {
      s += 10;
    }
    if (s > 0) {
      const mapSlug = c.room?.building?.node?.slug || "";
      hits.push({
        id: c.id,
        type: "course",
        title: `${c.code} · ${c.name}`,
        subtitle: [
          c.room ? `${c.room.code || c.room.name} · ${c.room.building.name}` : null,
          c.faculty?.name,
          c.programme?.name,
        ]
          .filter(Boolean)
          .join(" · "),
        href: `/academics/courses/${c.id}`,
        score: s,
        meta: {
          roomId: c.roomId || "",
          mapSlug,
          navigateTo: mapSlug ? `/map?to=${mapSlug}&from=main-gate` : "",
          actionHint: wantsClass ? "Open course · walk to class" : "Course",
        },
      });
    }
  }

  for (const n of nodes) {
    let s = scoreText(q, n.name, n.label, n.description, n.kind, n.slug.replace(/-/g, " "));
    if (wantsNav) s += 1;
    if (/library/i.test(lower) && /library/i.test(n.slug)) s += 6;
    if (/soet|engineering/i.test(lower) && n.slug.includes("soet")) s += 5;
    if (/hostel/i.test(lower) && /hostel/i.test(n.slug)) s += 5;
    if (/food|mess|canteen|dining/i.test(lower) && /food/i.test(n.slug)) s += 5;
    if (/gate/i.test(lower) && n.kind === "GATE") s += 4;
    if (s > 0) {
      hits.push({
        id: n.id,
        type: "place",
        title: n.name,
        subtitle: [n.kind, n.description?.slice(0, 100)].filter(Boolean).join(" · "),
        href: `/map?to=${n.slug}&from=main-gate`,
        score: s,
        meta: {
          navigateTo: `/map?to=${n.slug}&from=main-gate`,
          actionHint: "Navigate on map",
        },
      });
    }
  }

  for (const p of people) {
    let s = scoreText(q, p.name, p.designation, p.role, p.bio, p.school?.name);
    if (wantsPeople) s += 3;
    if (/vice chancellor|vc\b/i.test(lower) && /vice chancellor/i.test(p.designation || "")) s += 10;
    if (/chancellor/i.test(lower) && /chancellor/i.test(p.designation || "") && !/vice/i.test(lower)) s += 8;
    if (s > 0) {
      hits.push({
        id: p.id,
        type: "person",
        title: p.name,
        subtitle: [p.designation, p.school?.shortName || p.school?.name, p.role].filter(Boolean).join(" · "),
        href: `/people/${p.slug}`,
        score: s,
        meta: { actionHint: "People OS" },
      });
    }
  }

  for (const c of clubs) {
    let s = scoreText(q, c.name, c.category, c.description, c.tags);
    if (wantsClub) s += 2;
    if (s > 0) {
      hits.push({
        id: c.id,
        type: "club",
        title: c.name,
        subtitle: [c.category, c.meetingInfo].filter(Boolean).join(" · "),
        href: `/clubs/${c.slug}`,
        score: s,
        meta: { actionHint: "Club profile" },
      });
    }
  }

  for (const e of events) {
    const s = scoreText(q, e.title, e.description, e.location);
    if (s > 0) {
      hits.push({
        id: e.id,
        type: "event",
        title: e.title,
        subtitle: [e.location, e.startAt.toISOString().slice(0, 10)].filter(Boolean).join(" · "),
        href: `/events/${e.slug}`,
        score: s + (/event|workshop|concert|hack/i.test(lower) ? 2 : 0),
        meta: {
          navigateTo: e.venueNodeId ? "" : "",
          actionHint: e.title.startsWith("DEMO") ? "Demo-labelled event" : "Event",
        },
      });
    }
  }

  for (const n of notices) {
    const s = scoreText(q, n.title, n.body, n.category, n.changeSummary);
    if (s > 0) {
      hits.push({
        id: n.id,
        type: "notice",
        title: n.title,
        subtitle: [n.category, n.changeSummary].filter(Boolean).join(" · "),
        href: `/notices/${n.slug}`,
        score: s + (/notice|what changed|hours|exam/i.test(lower) ? 2 : 0),
        meta: { actionHint: "Notice · what changed?" },
      });
    }
  }

  for (const s of schools) {
    const sc = scoreText(
      q,
      s.name,
      s.shortName,
      s.description,
      ...s.departments.map((d) => d.name),
      ...s.programmes.map((p) => p.name)
    );
    if (sc > 0) {
      hits.push({
        id: s.id,
        type: "school",
        title: s.name,
        subtitle: `${s.shortName || ""} · ${s.departments.length} depts · ${s.programmes.length} programmes`.trim(),
        href: `/schools/${s.slug}`,
        score: sc,
        meta: { actionHint: "Academic Universe" },
      });
    }
  }

  for (const f of facilities) {
    const s = scoreText(q, f.name, f.type, f.description, f.hours);
    if (s > 0) {
      const href =
        f.type === "FOOD"
          ? "/food"
          : f.type === "SPORTS"
            ? "/sports"
            : f.type === "LIBRARY"
              ? "/library"
              : f.node?.slug
                ? `/map?to=${f.node.slug}`
                : "/map";
      hits.push({
        id: f.id,
        type: "facility",
        title: f.name,
        subtitle: [f.type, f.hours].filter(Boolean).join(" · "),
        href,
        score: s,
        meta: {
          navigateTo: f.node?.slug ? `/map?to=${f.node.slug}&from=main-gate` : "",
          actionHint: "Facility",
        },
      });
    }
  }

  for (const s of services) {
    const sc = scoreText(q, s.name, s.category, s.description, s.howToAccess);
    if (sc > 0) {
      hits.push({
        id: s.id,
        type: "service",
        title: s.name,
        subtitle: [s.category, s.hours].filter(Boolean).join(" · "),
        href: `/services#${s.slug}`,
        score: sc,
        meta: { actionHint: "Service Hub" },
      });
    }
  }

  for (const h of hostels) {
    const s = scoreText(q, h.name, h.type, h.description);
    if (s > 0 || /hostel|residence|housing/i.test(lower)) {
      hits.push({
        id: h.id,
        type: "facility",
        title: h.name,
        subtitle: `${h.type} hostel`,
        href: "/hostel",
        score: s + (/hostel/i.test(lower) ? 4 : 0),
        meta: {
          navigateTo: "/map?to=hostel-zone&from=main-gate",
          actionHint: "Hostel",
        },
      });
    }
  }

  for (const r of rooms) {
    const s = scoreText(q, r.name, r.code, r.building.name);
    if (s > 0) {
      const slug = r.building.node?.slug;
      hits.push({
        id: r.id,
        type: "room",
        title: r.code ? `${r.code} · ${r.name}` : r.name,
        subtitle: `${r.building.name}${r.floor ? ` · Floor ${r.floor}` : ""}`,
        href: slug ? `/map?to=${slug}&from=main-gate` : "/map",
        score: s,
        meta: {
          navigateTo: slug ? `/map?to=${slug}&from=main-gate` : "",
          mapSlug: slug || "",
          actionHint: "Room · walk to building",
        },
      });
    }
  }

  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return hits.slice(0, 28);
}
