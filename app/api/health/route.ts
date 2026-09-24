import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A host health check runs every few seconds, so keep it off the database. */
export function GET() {
  return NextResponse.json(
    { ok: true, at: new Date().toISOString() },
    { headers: { "cache-control": "no-store" } },
  );
}
