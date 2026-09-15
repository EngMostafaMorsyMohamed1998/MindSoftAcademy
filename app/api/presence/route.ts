import { NextResponse } from "next/server";
import { pingPresence } from "@/lib/access-store";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID" }, { status: 400 });
  }
  const path =
    typeof body === "object" && body && typeof (body as { path?: unknown }).path === "string"
      ? (body as { path: string }).path
      : "";
  if (!path.startsWith("/dashboard")) {
    return NextResponse.json({ error: "INVALID" }, { status: 400 });
  }
  await pingPresence({ studentId: user.id, name: user.name, path });
  return NextResponse.json({ ok: true });
}
