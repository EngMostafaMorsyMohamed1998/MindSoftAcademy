import { NextResponse } from "next/server";
import { answerSurprise, getSurprise, listSurpriseAnswers } from "@/lib/access-store";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { publicSurprise, surpriseOpen } from "@/lib/surprise";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const locale = await getLocale();
  const question = await getSurprise();
  if (!question || !surpriseOpen(question)) {
    return NextResponse.json({ open: false });
  }
  const mine = (await listSurpriseAnswers(question.id)).find((row) => row.studentId === user.id);
  return NextResponse.json({
    open: true,
    ...publicSurprise(question, locale),
    answered: Boolean(mine),
    choice: mine?.choice,
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID" }, { status: 400 });
  }
  const choice = typeof body === "object" && body ? Number((body as { choice?: unknown }).choice) : NaN;
  const row = await answerSurprise({ studentId: user.id, choice });
  if (!row) return NextResponse.json({ error: "CLOSED" }, { status: 409 });
  return NextResponse.json({ ok: true, answered: true, choice: row.choice });
}
