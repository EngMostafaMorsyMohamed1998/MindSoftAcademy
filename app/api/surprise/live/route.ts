import { NextResponse } from "next/server";
import { getSurprise, listSurpriseAnswers } from "@/lib/access-store";
import { listVisibleCodes } from "@/lib/teacher-roster";
import { surpriseOpen, surpriseRemaining } from "@/lib/surprise";
import { isTeacher } from "@/lib/teacher-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isTeacher())) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const question = await getSurprise();
  if (!question) {
    return NextResponse.json({ open: false, rows: [], answered: 0, correct: 0, remaining: 0 });
  }
  const answers = await listSurpriseAnswers(question.id);
  const codes = await listVisibleCodes();
  const byId = new Map(answers.map((row) => [row.studentId, row]));
  const rows = codes.map((code) => {
    const hit = byId.get(code.id);
    const seconds = hit
      ? Math.max(0, Math.round((Date.parse(hit.answeredAt) - Date.parse(question.opensAt)) / 1000))
      : null;
    return {
      id: code.id,
      name: code.name,
      answered: Boolean(hit),
      correct: hit?.correct ?? null,
      seconds,
    };
  });
  return NextResponse.json({
    open: surpriseOpen(question),
    remaining: surpriseRemaining(question),
    chapterId: question.chapterId,
    promptAr: question.promptAr,
    answered: answers.length,
    correct: answers.filter((row) => row.correct).length,
    rows,
  });
}
