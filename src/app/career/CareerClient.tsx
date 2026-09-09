"use client";

import { useMemo, useState } from "react";
import { careerReadiness } from "@/lib/career";

export function CareerClient() {
  const [hasResume, setHasResume] = useState(true);
  const [projectsCount, setProjects] = useState(2);
  const [clubsJoined, setClubs] = useState(1);
  const [internships, setInternships] = useState(0);
  const [courseworkDone, setCourses] = useState(4);

  const result = useMemo(
    () => careerReadiness({ hasResume, projectsCount, clubsJoined, internships, courseworkDone }),
    [hasResume, projectsCount, clubsJoined, internships, courseworkDone]
  );

  return (
    <div className="card space-y-4 p-5">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        {result.disclaimer}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasResume} onChange={(e) => setHasResume(e.target.checked)} />
          Have a resume draft
        </label>
        <label className="text-xs">Projects
          <input type="number" min={0} className="input mt-1 py-2" value={projectsCount} onChange={(e) => setProjects(Number(e.target.value))} />
        </label>
        <label className="text-xs">Clubs joined
          <input type="number" min={0} className="input mt-1 py-2" value={clubsJoined} onChange={(e) => setClubs(Number(e.target.value))} />
        </label>
        <label className="text-xs">Internships
          <input type="number" min={0} className="input mt-1 py-2" value={internships} onChange={(e) => setInternships(Number(e.target.value))} />
        </label>
        <label className="text-xs">Relevant courses completed
          <input type="number" min={0} className="input mt-1 py-2" value={courseworkDone} onChange={(e) => setCourses(Number(e.target.value))} />
        </label>
      </div>
      <div>
        <div className="text-3xl font-semibold tabular-nums text-ink-950">{result.score}<span className="text-base font-normal text-ink-400">/100</span></div>
        <div className="text-sm text-ink-600">{result.band}</div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-campus-600 transition-all" style={{ width: `${result.score}%` }} />
        </div>
      </div>
      <ul className="space-y-1 text-sm text-ink-700">
        {result.suggestions.map((s) => (
          <li key={s}>· {s}</li>
        ))}
      </ul>
    </div>
  );
}
