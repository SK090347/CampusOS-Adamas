import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { layoutToLatLng } from "@/lib/geo";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin required" }, { status: 401 });
  }
  const body = await req.json();
  if (!body.name || body.x == null || body.y == null) {
    return NextResponse.json({ error: "name, x, y required" }, { status: 400 });
  }
  const x = Number(body.x);
  const y = Number(body.y);
  const approx = layoutToLatLng(x, y);
  const lat = body.lat != null && body.lat !== "" ? Number(body.lat) : approx.lat;
  const lng = body.lng != null && body.lng !== "" ? Number(body.lng) : approx.lng;
  const node = await prisma.campusNode.create({
    data: {
      name: body.name,
      slug: body.slug || slugify(body.name),
      kind: body.kind || "LANDMARK",
      x,
      y,
      lat,
      lng,
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
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (body.name != null) data.name = body.name;
  if (body.slug != null) data.slug = body.slug;
  if (body.x != null) data.x = Number(body.x);
  if (body.y != null) data.y = Number(body.y);
  if (body.lat !== undefined) data.lat = body.lat === null || body.lat === "" ? null : Number(body.lat);
  if (body.lng !== undefined) data.lng = body.lng === null || body.lng === "" ? null : Number(body.lng);
  if (body.label != null) data.label = body.label;
  if (body.kind != null) data.kind = body.kind;
  if (body.description !== undefined) data.description = body.description;
  const node = await prisma.campusNode.update({ where: { id: body.id }, data });
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
  await prisma.building.updateMany({ where: { nodeId: id }, data: { nodeId: null } });
  await prisma.facility.updateMany({ where: { nodeId: id }, data: { nodeId: null } });
  await prisma.event.updateMany({ where: { venueNodeId: id }, data: { venueNodeId: null } });
  await prisma.campusNode.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
