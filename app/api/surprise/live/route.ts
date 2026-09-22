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
  const rows = answers.map((hit) => {
    const code = codes.find((item) => item.id === hit.studentId);
    return {
      id: hit.studentId,
      name: code?.name ?? hit.studentId,
      answered: true,
      correct: hit.correct,
      seconds: Math.max(0, Math.round((Date.parse(hit.answeredAt) - Date.parse(question.opensAt)) / 1000)),
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
