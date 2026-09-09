"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const STEPS = [
  {
    title: "Welcome to CampusOS",
    body: "Adamas University’s digital operating layer. Philosophy: everything around your university — search, understand, navigate, act.",
  },
  {
    title: "Search first",
    body: "Use “Where do you need to go?” on Home. Try “Where is my AI class?” for the demo flow.",
  },
  {
    title: "Map without GPS myths",
    body: "The campus map is a relative SVG layout. Routes use CampusNode/CampusEdge topology only — no fabricated distances.",
  },
  {
    title: "Trust the sources",
    body: "Institutional facts carry source metadata. Secondary sources are labelled and never presented as official.",
  },
  {
    title: "Demo as Aarav",
    body: "Sign in as fictional student Aarav Sen (B.Tech CSE — AI & ML) to see timetable, exams, clubs, and favourites.",
  },
];

export default function OnboardingPage() {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const done = i >= STEPS.length - 1;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="page-title">Onboarding</h1>
        <p className="page-sub">Step {i + 1} of {STEPS.length}</p>
      </div>
      <div className="card p-6">
        <div className="mb-4 flex gap-1">
          {STEPS.map((_, idx) => (
            <div key={idx} className={`h-1 flex-1 rounded-full ${idx <= i ? "bg-ink-950" : "bg-ink-200"}`} />
          ))}
        </div>
        <h2 className="text-xl font-semibold text-ink-950">{step.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.body}</p>
        <div className="mt-6 flex gap-2">
          {i > 0 && (
            <button type="button" className="btn-secondary" onClick={() => setI(i - 1)}>
              Back
            </button>
          )}
          {!done ? (
            <button type="button" className="btn-primary" onClick={() => setI(i + 1)}>
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link href="/" className="btn-primary">
              <Check className="h-4 w-4" /> Enter CampusOS
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
