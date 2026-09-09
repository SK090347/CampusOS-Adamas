"use client";

import { useEffect, useState } from "react";

type Pref = { key: string; label: string; enabled: boolean };

export function PrefsClient() {
  const [prefs, setPrefs] = useState<Pref[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setPrefs(d.prefs || []))
      .catch(() => setError("Could not load preferences"))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(key: string, enabled: boolean) {
    setPrefs((p) => p.map((x) => (x.key === key ? { ...x, enabled } : x)));
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, enabled }),
    });
    if (!res.ok) setError("Failed to save");
  }

  if (loading) return <div className="card px-4 py-8 text-center text-sm text-ink-400">Loading…</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>;

  return (
    <ul className="card divide-y divide-ink-100">
      {prefs.map((p) => (
        <li key={p.key} className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-ink-800">{p.label}</span>
          <button
            type="button"
            role="switch"
            aria-checked={p.enabled}
            onClick={() => toggle(p.key, !p.enabled)}
            className={`relative h-6 w-11 rounded-full transition ${p.enabled ? "bg-ink-950" : "bg-ink-200"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${p.enabled ? "left-5" : "left-0.5"}`} />
          </button>
        </li>
      ))}
    </ul>
  );
}
