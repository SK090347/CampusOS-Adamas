import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  if (!title || !description) {
    return NextResponse.json({ error: "Title and description required" }, { status: 400 });
  }
  const idea = await prisma.ideaSubmission.create({
    data: {
      title,
      description,
      category: body.category || "General",
      submitterName: body.submitterName || "Anonymous",
    },
  });
  return NextResponse.json({ idea });
}

export async function GET() {
  const ideas = await prisma.ideaSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ ideas });
}
