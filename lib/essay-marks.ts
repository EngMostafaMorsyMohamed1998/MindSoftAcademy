import type { MessageKey } from "@/lib/i18n";

export const ESSAY_MARKS: {
  id: "ok" | "term" | "example";
  score: number;
  labelKey: MessageKey;
  noteAr: string;
  noteEn: string;
}[] = [
  {
    id: "ok",
    score: 8,
    labelKey: "essayMarkOk",
    noteAr: "تمام. المصطلح والسبب والمثال موجودين.",
    noteEn: "Complete. The term, the reason, and an example are there.",
  },
  {
    id: "term",
    score: 4,
    labelKey: "essayMarkTerm",
    noteAr: "ناقص المصطلح. اكتب الاسم الصح.",
    noteEn: "The term is missing. Name it clearly.",
  },
  {
    id: "example",
    score: 5,
    labelKey: "essayMarkExample",
    noteAr: "ناقص مثال من الحياة.",
    noteEn: "Add a real-life example.",
  },
] as const;

export type EssayMarkId = (typeof ESSAY_MARKS)[number]["id"];

export function markForGrade(score: number, note: string): EssayMarkId | null {
  const hit = ESSAY_MARKS.find((mark) => mark.score === score && (note === mark.noteAr || note === mark.noteEn));
  if (hit) return hit.id;
  if (score >= 8) return "ok";
  if (score === 4) return "term";
  if (score === 5) return "example";
  return null;
}
