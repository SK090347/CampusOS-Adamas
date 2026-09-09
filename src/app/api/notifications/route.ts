import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const prefs = await prisma.notificationPref.findMany({ orderBy: { label: "asc" } });
  return NextResponse.json({ prefs });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const pref = await prisma.notificationPref.update({
    where: { key: body.key },
    data: { enabled: !!body.enabled },
  });
  return NextResponse.json({ pref });
}
