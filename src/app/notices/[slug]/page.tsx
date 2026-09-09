import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { SourceBadge } from "@/components/ui/SourceBadge";

export const dynamic = "force-dynamic";

export default async function NoticePage({ params }: { params: { slug: string } }) {
  const notice = await prisma.notice.findUnique({ where: { slug: params.slug } });
  if (!notice) notFound();
  return (
    <div className="space-y-6">
      <div>
        <p className="label-muted">{notice.category}</p>
        <h1 className="page-title">{notice.title}</h1>
      </div>
      <div className="card space-y-4 p-5">
        <SourceBadge {...notice} />
        {notice.changeSummary && (
          <div className="rounded-lg border border-campus-200 bg-campus-50 px-3 py-2 text-sm text-campus-900">
            <strong>What changed?</strong> {notice.changeSummary}
          </div>
        )}
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink-800">{notice.body}</div>
        {notice.previousBody && (
          <details className="text-sm">
            <summary className="cursor-pointer text-ink-500">Previous version</summary>
            <p className="mt-2 whitespace-pre-wrap text-ink-600">{notice.previousBody}</p>
          </details>
        )}
      </div>
    </div>
  );
}
