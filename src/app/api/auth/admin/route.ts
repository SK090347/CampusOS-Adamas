import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = String(body.password || "");
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
  }
  const session = { role: "admin" as const, name: "Campus Admin" };
  await createSession(session);
  return NextResponse.json({ session });
}
