import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session?.studentId) {
    const student = await prisma.demoStudent.findFirst();
    if (!student) return NextResponse.json({ favorites: [] });
    const favorites = await prisma.favorite.findMany({ where: { studentId: student.id } });
    return NextResponse.json({ favorites });
  }
  const favorites = await prisma.favorite.findMany({
    where: { studentId: session.studentId },
  });
  return NextResponse.json({ favorites });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  const student =
    (session?.studentId &&
      (await prisma.demoStudent.findUnique({ where: { id: session.studentId } }))) ||
    (await prisma.demoStudent.findFirst());
  if (!student) return NextResponse.json({ error: "No demo student" }, { status: 400 });
  const body = await req.json();
  const fav = await prisma.favorite.upsert({
    where: {
      studentId_itemType_itemId: {
        studentId: student.id,
        itemType: body.itemType,
        itemId: body.itemId,
      },
    },
    create: {
      studentId: student.id,
      itemType: body.itemType,
      itemId: body.itemId,
      label: body.label,
    },
    update: { label: body.label },
  });
  return NextResponse.json({ favorite: fav });
}
