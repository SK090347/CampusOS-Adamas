"use client";

import { useA11y } from "@/components/AccessibilityProvider";

export default function AccessibilityPage() {
  const { modes, setModes } = useA11y();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Accessibility</h1>
        <p className="page-sub">Display modes stored locally in your browser.</p>
      </div>
      <ul className="card divide-y divide-ink-100">
        {[
          { key: "contrast" as const, label: "High contrast", desc: "Stronger foreground/background contrast" },
          { key: "large" as const, label: "Larger text", desc: "Increase base font size" },
          { key: "reducedMotion" as const, label: "Reduce motion", desc: "Minimise animations (including map route)" },
        ].map((item) => (
          <li key={item.key} className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <div className="text-sm font-medium text-ink-900">{item.label}</div>
              <div className="text-xs text-ink-500">{item.desc}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={modes[item.key]}
              className={`relative h-6 w-11 rounded-full transition ${modes[item.key] ? "bg-ink-950" : "bg-ink-200"}`}
              onClick={() => setModes({ [item.key]: !modes[item.key] })}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${modes[item.key] ? "left-5" : "left-0.5"}`} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
