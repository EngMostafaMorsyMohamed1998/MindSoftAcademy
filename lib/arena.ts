import { CHAPTERS } from "@/lib/curriculum";
import { FAIZ_OBJECTIVES } from "@/lib/faiz-exam";
import { questionsForChapter, withShuffledOptions } from "@/lib/homework-bank";
import { shuffled } from "@/lib/shuffle";

export const ARENA_ID = "arena3d";
export const ARENA_XP = 40;
export const ARENA_LIVES = 3;

export type ArenaRound = {
  id: string;
  color: string;
  accent: string;
  titleAr: string;
  titleEn: string;
  promptAr: string;
  promptEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
};

export function buildArenaRounds(seed: number): ArenaRound[] {
  const rooms: ArenaRound[] = [];

  CHAPTERS.forEach((chapter, index) => {
    const pool = questionsForChapter(chapter.id).filter(
      (row) =>
        row.kind === "mcq" &&
        row.optionsAr.length >= 4 &&
        row.optionsEn.length >= 4 &&
        row.promptAr.trim(),
    );
    const picked = shuffled(pool, seed + Number(chapter.id) * 97 + index)[0];
    if (!picked) return;
    const question = withShuffledOptions(picked, seed + index * 13);
    rooms.push({
      id: question.id,
      color: chapter.color,
      accent: chapter.accent,
      titleAr: `قاعة ${chapter.id} — ${chapter.titleAr}`,
      titleEn: `Hall ${chapter.id} — ${chapter.titleEn}`,
      promptAr: question.promptAr,
      promptEn: question.promptEn,
      optionsAr: question.optionsAr.slice(0, 4),
      optionsEn: question.optionsEn.slice(0, 4),
      correctIndex: question.correctIndex,
    });
  });

  const faiz = shuffled(FAIZ_OBJECTIVES, seed + 700)[0];
  const faizAr = faiz?.optionsAr ?? [];
  const faizEn = faiz?.optionsEn ?? [];
  if (faiz && faizAr.length >= 4 && faizEn.length >= 4) {
    const order = shuffled(
      faizAr.map((_, index) => index),
      seed + 701,
    );
    rooms.push({
      id: faiz.id,
      color: "#4a1942",
      accent: "#e879f9",
      titleAr: "قاعة الفائز",
      titleEn: "Al-Faiz hall",
      promptAr: faiz.promptAr,
      promptEn: faiz.promptEn,
      optionsAr: order.map((index) => faizAr[index] ?? ""),
      optionsEn: order.map((index) => faizEn[index] ?? ""),
      correctIndex: order.indexOf(faiz.correctIndex),
    });
  }

  return rooms;
}
