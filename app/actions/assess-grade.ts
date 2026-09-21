"use server";

import { assessmentsForLesson } from "@/lib/assessments-bank";
import { assessOptions, assessPrompt } from "@/lib/assessments-helpers";
import { getLocale } from "@/lib/locale";

export type AssessGrade = {
  score: number;
  total: number;
  mcq: { id: string; correctIndex: number; choiceAr: string; choiceEn: string; prompt: string; answered: boolean }[];
  essays: { id: string; guideAr: string; guideEn: string; ok: boolean | null }[];
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

const SAME: string[][] = [
  ["eniac", "اينياك", "انياك"],
  ["military", "army", "عسكر", "جيش", "حرب"],
  ["science", "scientific", "علم"],
  ["vacuum", "tube", "صمام", "مفرغ"],
  ["computer", "حاسوب", "حواس", "الكترون"],
  ["transistor", "ترانزستور", "شريحه"],
  ["moore", "مور"],
  ["cloud", "سحاب"],
  ["edge", "طرف", "مركبه"],
  ["quantum", "كموم", "كيوبت", "qubit", "تراكب"],
  ["augment", "معزز"],
  ["virtual", "افتراض"],
  ["encrypt", "تشفير", "مفتاح"],
  ["handshake", "مصافح", "tls"],
  ["factor", "مصادق", "عامل"],
  ["password", "مرور"],
];

function stem(word: string): string {
  const bare = word
    .replace(/^(ال|وال|بال|كال|فال|لل)/, "")
    .replace(/(?:ing|tion|ness|ment)$/g, "")
    .replace(/(?:ies|es|ed|s)$/g, "");
  return bare.slice(0, 5);
}

function concepts(text: string): Set<string> {
  const found = new Set<string>();
  for (const word of fold(text).split(" ")) {
    if (word.length < 3 || STOP.has(word)) continue;
    const token = stem(word);
    if (token.length < 3) continue;
    const group = SAME.find((row) =>
      row.some((item) => {
        const root = stem(fold(item));
        if (root.length < 3) return false;
        if (token === root) return true;
        return root.length >= 4 && token.startsWith(root) && token.length - root.length <= 2;
      }),
    );
    found.add(group ? group[0] : token);
  }
  return found;
}

function cover(answer: string, guides: string[]): number {
  const mine = concepts(answer);
  const keys = new Set<string>();
  for (const guide of guides) {
    for (const item of concepts(guide)) keys.add(item);
  }
  if (!keys.size || !mine.size) return 0;
  let hits = 0;
  for (const key of keys) {
    if (mine.has(key)) hits += 1;
  }
  return hits;
}

function bestCover(answer: string, guides: string[]): { hits: number; size: number } {
  let hits = 0;
  let size = 0;
  for (const guide of guides) {
    if (!guide.trim()) continue;
    const nextHits = cover(answer, [guide]);
    const nextSize = concepts(guide).size;
    if (!nextSize) continue;
    if (nextHits > hits || (nextHits === hits && nextHits / nextSize > (size ? hits / size : 0))) {
      hits = nextHits;
      size = nextSize;
    }
  }
  return { hits, size };
}

function essayOk(answer: string, guides: string[], others: string[][]): boolean {
  const mine = bestCover(answer, guides);
  if (!mine.size) return false;
  const bestOther = others.reduce((best, guide) => Math.max(best, bestCover(answer, guide).hits), 0);
  if (bestOther > mine.hits) return false;
  return mine.hits >= 3 && mine.hits / mine.size >= 0.18;
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
    const answered = typeof picked === "number";
    if (answered && picked === row.correctIndex) score += 1;
    const optionsAr = assessOptions(row, "ar");
    const optionsEn = assessOptions(row, "en");
    return {
      id: row.id,
      correctIndex: row.correctIndex ?? 0,
      choiceAr: optionsAr[row.correctIndex ?? 0] ?? "",
      choiceEn: optionsEn[row.correctIndex ?? 0] ?? "",
      prompt: assessPrompt(row, locale),
      answered,
    };
  });
  const written = input.essays ?? {};
  const essayMarks = essays.map((row) => {
    const guideAr = row.guideAr ?? "";
    const guideEn = row.guideEn ?? "";
    const text = written[row.id] ?? "";
    const others = essays
      .filter((item) => item.id !== row.id)
      .map((item) => [item.guideAr ?? "", item.guideEn ?? ""]);
    const ok = fold(text).length < 2 ? null : essayOk(text, [guideAr, guideEn], others);
    if (ok) score += 1;
    return { id: row.id, guideAr, guideEn, ok };
  });
  const attempted = essayMarks.filter((row) => row.ok !== null).length;
  return {
    score,
    total: marked.filter((row) => row.answered).length + attempted,
    mcq: marked,
    essays: essayMarks,
  };
}
