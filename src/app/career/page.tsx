import { CareerClient } from "./CareerClient";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const service = await prisma.service.findFirst({ where: { slug: "career-services" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Career</h1>
        <p className="page-sub">
          Heuristic readiness score for reflection only — labelled non-official. Not a placement guarantee.
        </p>
      </div>
      {service && (
        <div className="card p-4 text-sm">
          <div className="font-semibold">{service.name}</div>
          <p className="text-ink-600">{service.description}</p>
          <p className="mt-1 text-xs text-ink-500">{service.howToAccess}</p>
        </div>
      )}
      <CareerClient />
      <Link href="/events/career-workshop" className="btn-secondary text-xs">Career workshop event</Link>
    </div>
  );
}
