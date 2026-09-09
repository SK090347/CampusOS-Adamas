import prisma from "@/lib/prisma";
import { campusSearch } from "@/lib/search";

export type AuraReply = {
  answer: string;
  citations: { title: string; href?: string; sourceType?: string }[];
  unverifiable: boolean;
};

export async function askAura(question: string): Promise<AuraReply> {
  const q = question.trim();
  if (!q) {
    return {
      answer: "Ask about classes, places, people, clubs, notices, or services. I only answer from CampusOS structured data.",
      citations: [],
      unverifiable: false,
    };
  }

  const lower = q.toLowerCase();

  // Leadership facts
  if (/chancellor|vice.?chancellor|leadership|founder/i.test(q)) {
    const leaders = await prisma.person.findMany({
      where: { role: "LEADERSHIP" },
      orderBy: { designation: "asc" },
    });
    if (leaders.length) {
      return {
        answer: leaders
          .map(
            (p) =>
              `${p.name} — ${p.designation || p.role} (source: ${p.sourceTitle || p.sourceType}).`
          )
          .join(" "),
        citations: leaders.map((p) => ({
          title: p.name,
          href: `/people/${p.slug}`,
          sourceType: p.sourceType,
        })),
        unverifiable: false,
      };
    }
  }

  if (/how many schools|list.*schools|schools of adamas/i.test(q)) {
    const schools = await prisma.school.findMany({ orderBy: { name: "asc" } });
    return {
      answer: `Adamas University has ${schools.length} schools in CampusOS: ${schools.map((s) => s.name).join("; ")}.`,
      citations: schools.map((s) => ({ title: s.name, href: `/schools/${s.slug}`, sourceType: s.sourceType })),
      unverifiable: false,
    };
  }

  if (/aarav|demo student|my programme|my program/i.test(q)) {
    const student = await prisma.demoStudent.findFirst({
      include: { programme: true },
    });
    if (student) {
      return {
        answer: `Demo student ${student.name} is enrolled in ${student.programme.name} (Year ${student.year}, Semester ${student.semester}). This is a fictional demo profile — no real student PII.`,
        citations: [{ title: student.programme.name, href: "/academics" }],
        unverifiable: false,
      };
    }
  }

  if (/emergency|safety| helpline|phone number/i.test(q)) {
    const contacts = await prisma.emergencyContact.findMany();
    return {
      answer:
        contacts.map((c) => `${c.label}: ${c.contactHint || c.description}`).join(" ") +
        " CampusOS does not invent campus phone numbers. National emergency number in India is 112 (sourced).",
      citations: contacts.map((c) => ({
        title: c.label,
        href: "/safety",
        sourceType: c.sourceType,
      })),
      unverifiable: contacts.some((c) => c.status === "UNVERIFIED"),
    };
  }

  const hits = await campusSearch(q);
  if (!hits.length) {
    return {
      answer:
        "I could not verify that from CampusOS data. Try rephrasing, or browse Map, Academics, People, or Notices. I will not invent facts.",
      citations: [],
      unverifiable: true,
    };
  }

  const top = hits.slice(0, 5);
  const summary = top
    .map((h, i) => `${i + 1}. [${h.type}] ${h.title}${h.subtitle ? ` — ${h.subtitle}` : ""}`)
    .join("\n");

  // Specific AI class intent
  if (/where.*ai class|ai class|artificial intelligence/i.test(lower)) {
    const ai = hits.find((h) => h.type === "course" && /artificial intelligence/i.test(h.title));
    if (ai) {
      return {
        answer: `Your AI class is ${ai.title}. Location: ${ai.subtitle || "see course card"}. Use Navigate on the course page or Map to walk the topology route to SOET Block.`,
        citations: [{ title: ai.title, href: ai.href }],
        unverifiable: false,
      };
    }
  }

  return {
    answer: `Based on CampusOS records, here is what matches your question:\n${summary}`,
    citations: top.map((h) => ({ title: h.title, href: h.href })),
    unverifiable: false,
  };
}
