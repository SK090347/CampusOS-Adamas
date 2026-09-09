import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  const student = await prisma.demoStudent.findFirst({
    where: { name: "Aarav Sen" },
  });
  if (!student) {
    return NextResponse.json({ error: "Demo student not seeded" }, { status: 500 });
  }
  const session = {
    role: "demo" as const,
    name: student.name,
    studentId: student.id,
  };
  await createSession(session);
  return NextResponse.json({ session });
}
