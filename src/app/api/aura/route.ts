import { NextRequest, NextResponse } from "next/server";
import { askAura } from "@/lib/aura";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const question = String(body.question || "");
  try {
    const reply = await askAura(question);
    return NextResponse.json(reply);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        answer: "AURA hit an error reading CampusOS data. Try again.",
        citations: [],
        unverifiable: true,
      },
      { status: 500 }
    );
  }
}
