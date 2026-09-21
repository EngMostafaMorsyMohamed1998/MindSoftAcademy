"use server";

import { assessmentsForLesson } from "@/lib/assessments-bank";
import { assessOptions, assessPrompt } from "@/lib/assessments-helpers";
import { getLocale } from "@/lib/locale";

export type AssessGrade = {
  score: number;
  total: number;
  mcq: { id: string; correctIndex: number; choiceAr: string; choiceEn: string; prompt: string }[];
  essays: { id: string; guideAr: string; guideEn: string; ok: boolean }[];
};

const STOP = new Set([
  "the", "and", "for", "from", "that", "this", "with", "was", "were", "are", "not", "its", "into", "than", "then", "them", "they", "your", "about", "which", "when", "what", "have", "has", "had", "been", "being", "also", "such", "each", "every", "over", "under", "after", "before", "there", "their", "these", "those", "will", "would", "could", "should",
  "من", "الي", "في", "على", "عن", "مع", "كان", "هذا", "هذه", "التي", "الذي", "او", "كل", "بعد", "قبل", "هو", "هي", "ان", "لا", "لم", "لن", "قد", "ما", "ثم", "حتى", "بين", "عند", "اليها", "فيها", "عليه", "عليها",
]);

function fold(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywords(text: string): string[] {
  return fold(text)
    .split(" ")
    .filter((word) => word.length >= 4 && !STOP.has(word));
}

function essayOk(answer: string, guides: string[]): boolean {
  const blob = fold(answer);
  if (blob.length < 12) return false;
  const keys = new Set<string>();
  for (const guide of guides) {
    for (const word of keywords(guide)) keys.add(word);
  }
  if (!keys.size) return false;
  let hits = 0;
  for (const word of keys) {
    if (blob.includes(word)) hits += 1;
  }
  return hits >= 2;
}

export async function gradeAssessLesson(input: {
  lessonId: string;
  answers: Record<string, number>;
  essays?: Record<string, string>;
}): Promise<AssessGrade | { error: string }> {
  const locale = await getLocale();
  const rows = assessmentsForLesson(input.lessonId);
  if (!rows.length) return { error: "EMPTY" };
  const mcq = rows.filter((row) => row.kind === "mcq");
  const essays = rows.filter((row) => row.kind === "essay");
  let score = 0;
  const marked = mcq.map((row) => {
    const picked = input.answers[row.id];
    if (picked === row.correctIndex) score += 1;
    const optionsAr = assessOptions(row, "ar");
    const optionsEn = assessOptions(row, "en");
    return {
      id: row.id,
      correctIndex: row.correctIndex ?? 0,
      choiceAr: optionsAr[row.correctIndex ?? 0] ?? "",
      choiceEn: optionsEn[row.correctIndex ?? 0] ?? "",
      prompt: assessPrompt(row, locale),
    };
  });
  const written = input.essays ?? {};
  const essayMarks = essays.map((row) => {
    const guideAr = row.guideAr ?? "";
    const guideEn = row.guideEn ?? "";
    const ok = essayOk(written[row.id] ?? "", [guideAr, guideEn]);
    if (ok) score += 1;
    return { id: row.id, guideAr, guideEn, ok };
  });
  return {
    score,
    total: mcq.length + essays.length,
    mcq: marked,
    essays: essayMarks,
  };
}
