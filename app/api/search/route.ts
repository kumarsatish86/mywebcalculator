import { NextRequest, NextResponse } from "next/server";
import { matchIntent } from "@/lib/search/matchIntent";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limitRaw = req.nextUrl.searchParams.get("limit");
  const limit = limitRaw ? Math.min(24, Math.max(1, Number(limitRaw) || 12)) : 12;
  const results = matchIntent(q, limit);
  return NextResponse.json({ q, results });
}
