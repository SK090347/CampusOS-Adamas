import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Notices</h1>
        <p className="page-sub">Official-style campus updates · see what changed.</p>
      </div>
      <ul className="card divide-y divide-ink-100">
        {notices.map((n) => (
          <li key={n.id}>
            <Link href={`/notices/${n.slug}`} className="block px-4 py-4 hover:bg-ink-50">
              <div className="text-[11px] uppercase tracking-wide text-ink-400">{n.category}</div>
              <div className="text-sm font-semibold text-ink-950">{n.title}</div>
              {n.changeSummary && (
                <div className="mt-1 text-xs text-campus-700">What changed: {n.changeSummary}</div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
