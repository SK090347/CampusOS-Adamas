import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin required" }, { status: 401 });
  }
  const body = await req.json();
  const node = await prisma.campusNode.create({
    data: {
      name: body.name,
      slug: body.slug || slugify(body.name),
      kind: body.kind || "LANDMARK",
      x: Number(body.x),
      y: Number(body.y),
      label: body.label || body.name,
      description: body.description || null,
    },
  });
  return NextResponse.json({ node });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin required" }, { status: 401 });
  }
  const body = await req.json();
  const node = await prisma.campusNode.update({
    where: { id: body.id },
    data: {
      name: body.name,
      x: body.x != null ? Number(body.x) : undefined,
      y: body.y != null ? Number(body.y) : undefined,
      label: body.label,
      kind: body.kind,
      description: body.description,
    },
  });
  return NextResponse.json({ node });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin required" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.campusEdge.deleteMany({
    where: { OR: [{ fromNodeId: id }, { toNodeId: id }] },
  });
  await prisma.campusNode.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
