import { NextRequest, NextResponse } from "next/server";
import { campusSearch } from "@/lib/search";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  try {
    const hits = await campusSearch(q);
    return NextResponse.json({ hits });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Search failed", hits: [] }, { status: 500 });
  }
}
