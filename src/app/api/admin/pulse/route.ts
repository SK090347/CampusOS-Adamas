import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin required" }, { status: 401 });
  }
  const body = await req.json();
  const { id, status, message } = body;
  const updated = await prisma.pulseStatus.update({
    where: { id },
    data: {
      status: status || undefined,
      message: message || undefined,
      updatedBy: session.name,
    },
  });
  return NextResponse.json({ pulse: updated });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin required" }, { status: 401 });
  }
  const body = await req.json();
  const uni = await prisma.university.findFirst();
  if (!uni) return NextResponse.json({ error: "No university" }, { status: 500 });
  const pulse = await prisma.pulseStatus.create({
    data: {
      area: body.area,
      status: body.status || "INFO",
      message: body.message || "",
      universityId: uni.id,
      updatedBy: session.name,
    },
  });
  return NextResponse.json({ pulse });
}
