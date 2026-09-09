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
    if (hay.includes(t)) score += 2;
    if (hay.startsWith(t)) score += 1;
  }
  return score;
}

/** Natural-language oriented search over structured CampusOS data. */
export async function campusSearch(query: string): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  const lower = q.toLowerCase();

  const hits: SearchHit[] = [];

  // Intent: AI / class / timetable
  const wantsClass =
    /class|lecture|ai|machine learning|ml|timetable|where is my|schedule/i.test(q);

  const [courses, rooms, nodes, people, clubs, events, notices, schools, facilities, services] =
    await Promise.all([
      prisma.course.findMany({
        include: { room: { include: { building: true } }, faculty: true, programme: true },
      }),
      prisma.room.findMany({ include: { building: true } }),
      prisma.campusNode.findMany(),
      prisma.person.findMany({ include: { school: true } }),
      prisma.club.findMany(),
      prisma.event.findMany({ take: 20, orderBy: { startAt: "asc" } }),
      prisma.notice.findMany({ take: 20, orderBy: { publishedAt: "desc" } }),
      prisma.school.findMany(),
      prisma.facility.findMany(),
      prisma.service.findMany(),
    ]);

  for (const c of courses) {
    let s = scoreText(q, c.name, c.code, c.description, c.programme?.name);
    if (wantsClass && /artificial intelligence|ai\b|machine learning/i.test(c.name + c.code)) {
      s += 8;
    }
    if (s > 0) {
      hits.push({
        id: c.id,
        type: "course",
        title: `${c.code} · ${c.name}`,
        subtitle: c.room
          ? `${c.room.code || c.room.name} · ${c.room.building.name}`
          : c.faculty?.name,
        href: `/academics/courses/${c.id}`,
        score: s,
        meta: {
          roomId: c.roomId || "",
          buildingNode:
            c.room?.building?.nodeId || "",
          roomCode: c.room?.code || c.room?.name || "",
        },
      });
    }
  }

  for (const n of nodes) {
    const s = scoreText(q, n.name, n.label, n.description, n.kind);
    if (s > 0 || /where|navigate|map|go to|walk/i.test(lower)) {
      const boost = /gate|soet|library|food|hostel/i.test(n.slug) && lower.includes(n.slug.split("-")[0]) ? 3 : 0;
      if (s + boost > 0) {
        hits.push({
          id: n.id,
          type: "place",
          title: n.name,
          subtitle: n.kind,
          href: `/map?to=${n.slug}`,
          score: s + boost + (lower.includes("where") ? 1 : 0),
        });
      }
    }
  }

  for (const p of people) {
    const s = scoreText(q, p.name, p.designation, p.role, p.bio, p.school?.name);
    if (s > 0) {
      hits.push({
        id: p.id,
        type: "person",
        title: p.name,
        subtitle: [p.designation, p.school?.shortName || p.school?.name].filter(Boolean).join(" · "),
        href: `/people/${p.slug}`,
        score: s,
      });
    }
  }

  for (const c of clubs) {
    const s = scoreText(q, c.name, c.category, c.description, c.tags);
    if (s > 0) {
      hits.push({
        id: c.id,
        type: "club",
        title: c.name,
        subtitle: c.category,
        href: `/clubs/${c.slug}`,
        score: s,
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
        subtitle: e.location || undefined,
        href: `/events/${e.slug}`,
        score: s,
      });
    }
  }

  for (const n of notices) {
    const s = scoreText(q, n.title, n.body, n.category);
    if (s > 0) {
      hits.push({
        id: n.id,
        type: "notice",
        title: n.title,
        subtitle: n.category,
        href: `/notices/${n.slug}`,
        score: s,
      });
    }
  }

  for (const s of schools) {
    const sc = scoreText(q, s.name, s.shortName, s.description);
    if (sc > 0) {
      hits.push({
        id: s.id,
        type: "school",
        title: s.name,
        subtitle: s.shortName || undefined,
        href: `/schools/${s.slug}`,
        score: sc,
      });
    }
  }

  for (const f of facilities) {
    const s = scoreText(q, f.name, f.type, f.description);
    if (s > 0) {
      hits.push({
        id: f.id,
        type: "facility",
        title: f.name,
        subtitle: f.type,
        href: f.type === "FOOD" ? "/food" : f.type === "SPORTS" ? "/sports" : f.type === "LIBRARY" ? "/library" : "/map",
        score: s,
      });
    }
  }

  for (const s of services) {
    const sc = scoreText(q, s.name, s.category, s.description);
    if (sc > 0) {
      hits.push({
        id: s.id,
        type: "service",
        title: s.name,
        subtitle: s.category,
        href: `/services#${s.slug}`,
        score: sc,
      });
    }
  }

  for (const r of rooms) {
    const s = scoreText(q, r.name, r.code, r.building.name);
    if (s > 0) {
      hits.push({
        id: r.id,
        type: "room",
        title: r.code ? `${r.code} · ${r.name}` : r.name,
        subtitle: r.building.name,
        href: r.building.nodeId ? `/map?to=${r.building.nodeId}` : "/map",
        score: s,
      });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, 24);
}
