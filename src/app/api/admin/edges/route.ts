import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin required" }, { status: 401 });
  }
  const body = await req.json();
  const edge = await prisma.campusEdge.create({
    data: {
      fromNodeId: body.fromNodeId,
      toNodeId: body.toNodeId,
      weight: Number(body.weight ?? 1),
      bidirectional: body.bidirectional !== false,
      label: body.label || null,
    },
  });
  return NextResponse.json({ edge });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin required" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.campusEdge.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
