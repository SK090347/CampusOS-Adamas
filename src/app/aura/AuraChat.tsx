"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";

type Msg = {
  role: "user" | "aura";
  text: string;
  citations?: { title: string; href?: string; sourceType?: string }[];
  unverifiable?: boolean;
};

export function AuraChat() {
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "aura",
      text: "Ask about classes, leadership, schools, clubs, safety, or places. I only use CampusOS records.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    const question = q.trim();
    setQ("");
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setLoading(true);
    try {
      const res = await fetch("/api/aura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMsgs((m) => [
        ...m,
        {
          role: "aura",
          text: data.answer,
          citations: data.citations,
          unverifiable: data.unverifiable,
        },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "aura", text: "Could not reach AURA. Try again.", unverifiable: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex min-h-[420px] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-8 rounded-xl bg-ink-950 px-3 py-2 text-sm text-white"
                : "mr-8 rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-800"
            }
          >
            {m.role === "aura" && (
              <div className="mb-1 flex items-center gap-1 text-[11px] font-medium text-ink-400">
                <Sparkles className="h-3 w-3" /> AURA
              </div>
            )}
            <div className="whitespace-pre-wrap">{m.text}</div>
            {m.unverifiable && (
              <div className="mt-2 text-[11px] text-amber-700">Marked unverifiable / incomplete.</div>
            )}
            {m.citations && m.citations.length > 0 && (
              <ul className="mt-2 space-y-1">
                {m.citations.map((c, j) => (
                  <li key={j} className="text-[11px]">
                    {c.href ? (
                      <Link href={c.href} className="text-campus-700 hover:underline">
                        {c.title}
                      </Link>
                    ) : (
                      c.title
                    )}
                    {c.sourceType ? ` · ${c.sourceType}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-ink-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking over CampusOS data…
          </div>
        )}
      </div>
      <form onSubmit={ask} className="flex gap-2 border-t border-ink-100 p-3">
        <input
          className="input py-2"
          placeholder="e.g. Where is my AI class?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0" disabled={loading}>
          Ask
        </button>
      </form>
      <div className="flex flex-wrap gap-2 border-t border-ink-50 px-3 pb-3">
        {["Where is my AI class?", "Who is the Founder Chancellor?", "How many schools?", "Emergency contacts"].map(
          (s) => (
            <button
              key={s}
              type="button"
              className="rounded-full border border-ink-200 px-2.5 py-1 text-[11px] text-ink-600 hover:bg-ink-50"
              onClick={() => setQ(s)}
            >
              {s}
            </button>
          )
        )}
      </div>
    </div>
  );
}
