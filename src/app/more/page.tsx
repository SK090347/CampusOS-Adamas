import Link from "next/link";
import { moreLinks } from "@/lib/nav";

export default function MorePage() {
  const groups = Array.from(new Set(moreLinks.map((l) => l.group)));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">More</h1>
        <p className="page-sub">All CampusOS modules.</p>
      </div>
      {groups.map((g) => (
        <section key={g}>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">{g}</h2>
          <ul className="card divide-y divide-ink-100">
            {moreLinks
              .filter((l) => l.group === g)
              .map((l) => {
                const Icon = l.icon;
                return (
                  <li key={l.href}>
                    <Link href={l.href} className="flex items-center gap-3 px-4 py-3 hover:bg-ink-50">
                      <Icon className="h-4 w-4 text-ink-400" />
                      <span className="text-sm font-medium text-ink-900">{l.label}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </div>
  );
}
