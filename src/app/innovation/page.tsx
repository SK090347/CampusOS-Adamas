import { IdeaForm } from "./IdeaForm";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InnovationPage() {
  const ideas = await prisma.ideaSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Innovation</h1>
        <p className="page-sub">Submit campus ideas · browse recent submissions.</p>
      </div>
      <Link href="/map?to=innovation-hub&from=main-gate" className="btn-secondary text-xs">Walk to Innovation Hub</Link>
      <IdeaForm />
      <section>
        <h2 className="mb-2 text-sm font-semibold">Recent ideas</h2>
        <ul className="card divide-y divide-ink-100">
          {ideas.map((i) => (
            <li key={i.id} className="px-4 py-3">
              <div className="text-sm font-medium">{i.title}</div>
              <div className="text-xs text-ink-500">{i.category} · {i.status} · {i.submitterName}</div>
              <p className="mt-1 text-sm text-ink-600">{i.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
