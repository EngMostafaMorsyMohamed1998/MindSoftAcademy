import type { MissedQuestion } from "@/lib/access-store";

export type MissBoardRow = {
  questionKey: string;
  chapterId: string;
  lessonId: string;
  prompt: string;
  count: number;
};

export function buildMissBoard(misses: MissedQuestion[], locale: "ar" | "en", limit = 12): MissBoardRow[] {
  const map = new Map<string, MissBoardRow>();
  for (const row of misses) {
    if (row.clearedAt) continue;
    const existing = map.get(row.questionKey);
    if (existing) {
      existing.count += 1;
      continue;
    }
    map.set(row.questionKey, {
      questionKey: row.questionKey,
      chapterId: row.chapterId,
      lessonId: row.lessonId,
      prompt: (locale === "en" ? row.promptEn : row.promptAr).trim() || row.promptAr || row.promptEn,
      count: 1,
    });
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.prompt.localeCompare(b.prompt, "ar")).slice(0, limit);
}
