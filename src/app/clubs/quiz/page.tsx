"use client";

import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  {
    q: "What energises you most?",
    options: [
      { label: "Building tech & robots", tags: ["tech", "robotics", "ai", "coding"] },
      { label: "Performance & arts", tags: ["music", "dance", "film", "art", "drama"] },
      { label: "Ideas, writing & debate", tags: ["literature", "storytelling", "debate"] },
      { label: "Community & outdoors", tags: ["social-work", "environment", "health", "fitness"] },
    ],
  },
  {
    q: "Pick a weekend vibe",
    options: [
      { label: "Hackathon or workshop", tags: ["tech", "coding", "innovation", "startup"] },
      { label: "Stage or studio", tags: ["music", "dance", "film", "art", "performance"] },
      { label: "Reading circle", tags: ["literature", "storytelling", "debate"] },
      { label: "Campus clean-up or volunteering", tags: ["environment", "social-work", "civic"] },
    ],
  },
  {
    q: "You want to grow…",
    options: [
      { label: "Technical depth", tags: ["tech", "ai", "robotics", "coding", "science", "biotech"] },
      { label: "Creative voice", tags: ["music", "dance", "art", "film", "literature"] },
      { label: "Leadership & ventures", tags: ["startup", "business", "innovation"] },
      { label: "Civic awareness", tags: ["civic", "democracy", "social-work"] },
    ],
  },
];

const CLUB_TAGS: Record<string, string[]> = {
  musicorum: ["music", "performance"],
  "robotics-ai": ["robotics", "ai", "tech"],
  jhankar: ["dance", "performance"],
  "crossfit-health": ["fitness", "health"],
  kissewala: ["film", "drama"],
  "biotech-club": ["biotech", "science"],
  "katha-kalaaj": ["literature", "storytelling"],
  "nature-nurturers": ["environment", "sustainability"],
  entrepreneurship: ["startup", "business"],
  litwiz: ["literature", "debate"],
  empathy: ["social-work", "community"],
  artsym: ["art", "design"],
  "cy-coders": ["coding", "tech"],
  "junk-innovation": ["innovation", "upcycling"],
  "electoral-literacy": ["civic", "democracy"],
};

const NAMES: Record<string, string> = {
  musicorum: "Musicorum",
  "robotics-ai": "Robotics and AI Club",
  jhankar: "Jhankar",
  "crossfit-health": "CrossFit–Health",
  kissewala: "Kissewala Film & Drama",
  "biotech-club": "Biotechnology Club",
  "katha-kalaaj": "Katha Kalaaj",
  "nature-nurturers": "Nature Nurturers",
  entrepreneurship: "Entrepreneurship Club",
  litwiz: "Litwiz",
  empathy: "Empathy",
  artsym: "Artsym",
  "cy-coders": "Cy-Coder’s",
  "junk-innovation": "Junk Innovation",
  "electoral-literacy": "Electoral Literacy",
};

export default function ClubQuizPage() {
  const [step, setStep] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  function pick(optionTags: string[]) {
    const next = [...tags, ...optionTags];
    if (step + 1 >= QUESTIONS.length) {
      setTags(next);
      setDone(true);
    } else {
      setTags(next);
      setStep(step + 1);
    }
  }

  const scores = Object.entries(CLUB_TAGS).map(([slug, ct]) => {
    const score = ct.reduce((a, t) => a + tags.filter((x) => x === t).length, 0);
    return { slug, score };
  });
  scores.sort((a, b) => b.score - a.score);
  const top = scores.filter((s) => s.score > 0).slice(0, 3);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="page-title">Find your club</h1>
        <p className="page-sub">Three quick questions · matched to CampusOS club tags.</p>
      </div>
      {!done ? (
        <div className="card p-5">
          <p className="label-muted">Question {step + 1} of {QUESTIONS.length}</p>
          <h2 className="mt-2 text-lg font-semibold text-ink-950">{QUESTIONS[step].q}</h2>
          <ul className="mt-4 space-y-2">
            {QUESTIONS[step].options.map((o) => (
              <li key={o.label}>
                <button type="button" className="btn-secondary w-full justify-start text-left" onClick={() => pick(o.tags)}>
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="card space-y-4 p-5">
          <h2 className="text-lg font-semibold">Your matches</h2>
          {top.length === 0 && <p className="text-sm text-ink-500">Browse all clubs to explore.</p>}
          <ul className="space-y-2">
            {top.map((t) => (
              <li key={t.slug}>
                <Link href={`/clubs/${t.slug}`} className="btn-secondary w-full justify-between">
                  <span>{NAMES[t.slug]}</span>
                  <span className="text-xs text-ink-400">score {t.score}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/clubs" className="btn-primary">See all clubs</Link>
          <button type="button" className="btn-ghost text-xs" onClick={() => { setStep(0); setTags([]); setDone(false); }}>
            Retake quiz
          </button>
        </div>
      )}
    </div>
  );
}
