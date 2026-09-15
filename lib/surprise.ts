import type { ChapterId } from "@/lib/curriculum";
import { isChapterId } from "@/lib/curriculum";
import { questionsForChapter, withShuffledOptions, type HomeworkKind } from "@/lib/homework-bank";

export const SURPRISE_SECONDS = 30;

export type SurpriseQuestion = {
  id: string;
  chapterId: ChapterId;
  questionId: string;
  kind: HomeworkKind;
  promptAr: string;
  promptEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
  opensAt: string;
  closesAt: string;
};

export type SurpriseAnswer = {
  studentId: string;
  surpriseId: string;
  choice: number;
  correct: boolean;
  answeredAt: string;
};

export function parseSurprise(value: unknown): SurpriseQuestion | null {
  if (!value || typeof value !== "object") return null;
  const row = value as SurpriseQuestion;
  if (!isChapterId(row.chapterId) || typeof row.id !== "string" || typeof row.questionId !== "string") {
    return null;
  }
  if (typeof row.promptAr !== "string" || !Array.isArray(row.optionsAr)) return null;
  return {
    id: row.id,
    chapterId: row.chapterId,
    questionId: row.questionId,
    kind: row.kind === "tf" ? "tf" : "mcq",
    promptAr: row.promptAr,
    promptEn: typeof row.promptEn === "string" ? row.promptEn : row.promptAr,
    optionsAr: row.optionsAr.map(String),
    optionsEn: Array.isArray(row.optionsEn) ? row.optionsEn.map(String) : row.optionsAr.map(String),
    correctIndex: Number(row.correctIndex) || 0,
    opensAt: typeof row.opensAt === "string" ? row.opensAt : new Date().toISOString(),
    closesAt: typeof row.closesAt === "string" ? row.closesAt : new Date().toISOString(),
  };
}

export function parseSurpriseAnswers(value: unknown): SurpriseAnswer[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as SurpriseAnswer;
    if (typeof row.studentId !== "string" || typeof row.surpriseId !== "string") return [];
    return [
      {
        studentId: row.studentId,
        surpriseId: row.surpriseId,
        choice: Number(row.choice),
        correct: Boolean(row.correct),
        answeredAt: typeof row.answeredAt === "string" ? row.answeredAt : new Date().toISOString(),
      },
    ];
  });
}

export function surpriseOpen(question: SurpriseQuestion | null, now = Date.now()): boolean {
  if (!question) return false;
  const closes = Date.parse(question.closesAt);
  return Number.isFinite(closes) && closes > now;
}

export function surpriseRemaining(question: SurpriseQuestion | null, now = Date.now()): number {
  if (!question) return 0;
  const closes = Date.parse(question.closesAt);
  if (!Number.isFinite(closes)) return 0;
  return Math.max(0, Math.ceil((closes - now) / 1000));
}

export function pickSurpriseQuestion(chapterId: ChapterId, now = new Date()): SurpriseQuestion | null {
  const pool = questionsForChapter(chapterId);
  if (!pool.length) return null;
  const seed = now.getTime();
  const raw = pool[seed % pool.length]!;
  const question = withShuffledOptions(raw, seed);
  return {
    id: `s-${seed.toString(36)}`,
    chapterId,
    questionId: question.id,
    kind: question.kind,
    promptAr: question.promptAr,
    promptEn: question.promptEn,
    optionsAr: question.optionsAr,
    optionsEn: question.optionsEn,
    correctIndex: question.correctIndex,
    opensAt: now.toISOString(),
    closesAt: new Date(now.getTime() + SURPRISE_SECONDS * 1000).toISOString(),
  };
}

export function publicSurprise(question: SurpriseQuestion, locale: "ar" | "en") {
  return {
    id: question.id,
    chapterId: question.chapterId,
    kind: question.kind,
    prompt: locale === "ar" ? question.promptAr : question.promptEn,
    options: locale === "ar" ? question.optionsAr : question.optionsEn,
    opensAt: question.opensAt,
    closesAt: question.closesAt,
    remaining: surpriseRemaining(question),
  };
}
