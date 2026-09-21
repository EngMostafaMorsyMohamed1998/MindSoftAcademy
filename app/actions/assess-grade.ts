"use server";

import { assessmentsForLesson } from "@/lib/assessments-bank";
import { assessGuide, assessOptions, assessPrompt } from "@/lib/assessments-helpers";
import { getLocale } from "@/lib/locale";

export type AssessGrade = {
  score: number;
  total: number;
  mcq: { id: string; correctIndex: number; choice: string; prompt: string }[];
  essays: { id: string; guide: string }[];
};

export async function gradeAssessLesson(input: {
  lessonId: string;
  answers: Record<string, number>;
}): Promise<AssessGrade | { error: string }> {
  const locale = await getLocale();
  const rows = assessmentsForLesson(input.lessonId);
  if (!rows.length) return { error: "EMPTY" };
  const mcq = rows.filter((row) => row.kind === "mcq");
  let score = 0;
  const marked = mcq.map((row) => {
    const picked = input.answers[row.id];
    if (picked === row.correctIndex) score += 1;
    const options = assessOptions(row, locale);
    return {
      id: row.id,
      correctIndex: row.correctIndex ?? 0,
      choice: options[row.correctIndex ?? 0] ?? "",
      prompt: assessPrompt(row, locale),
    };
  });
  return {
    score,
    total: mcq.length,
    mcq: marked,
    essays: rows
      .filter((row) => row.kind === "essay")
      .map((row) => ({ id: row.id, guide: assessGuide(row, locale) })),
  };
}
