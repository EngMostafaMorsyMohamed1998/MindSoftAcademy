import { CHAPTERS } from "@/lib/curriculum";
import { FAIZ_OBJECTIVES } from "@/lib/faiz-exam";
import { questionsForChapter, withShuffledOptions } from "@/lib/homework-bank";
import { shuffled } from "@/lib/shuffle";

export const ARENA_ID = "arena3d";
export const ARENA_XP = 50;
export const ARENA_LIVES = 3;
export const ARENA_ROUNDS = 12;
export const ARENA_SECONDS = 14;

export type ArenaTheme = "cars" | "dolls";

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

function seedFrom(id: string, extra: number) {
  let value = extra;
  for (let i = 0; i < id.length; i += 1) value = (value + id.charCodeAt(i) * (i + 2)) >>> 0;
  return value;
}

export function buildArenaRounds(seed: number, includeFaiz = true): ArenaRound[] {
  const rooms: ArenaRound[] = [];

  CHAPTERS.forEach((chapter, index) => {
    const all = questionsForChapter(chapter.id).filter(
      (row) =>
        row.kind === "mcq" &&
        row.optionsAr.length >= 4 &&
        row.optionsEn.length >= 4 &&
        row.promptAr.trim(),
    );
    const short = all.filter((row) => row.promptAr.length < 140);
    const picked = shuffled(short.length ? short : all, seed + Number(chapter.id) * 97).slice(0, 2);
    picked.forEach((row, pickIndex) => {
      const question = withShuffledOptions(row, seed + index * 13 + pickIndex);
      rooms.push({
        id: `${question.id}-${pickIndex}`,
        color: chapter.color,
        accent: chapter.accent,
        titleAr: `${chapter.id} · ${chapter.titleAr}`,
        titleEn: `${chapter.id} · ${chapter.titleEn}`,
        promptAr: question.promptAr,
        promptEn: question.promptEn,
        optionsAr: question.optionsAr.slice(0, 4),
        optionsEn: question.optionsEn.slice(0, 4),
        correctIndex: question.correctIndex,
      });
    });
  });

  const faiz = includeFaiz ? shuffled(FAIZ_OBJECTIVES, seed + 700)[0] : undefined;
  const faizAr = faiz?.optionsAr ?? [];
  const faizEn = faiz?.optionsEn ?? [];
  if (faiz && faizAr.length >= 4 && faizEn.length >= 4) {
    const order = shuffled(
      faizAr.map((_, index) => index),
      seedFrom(faiz.id, seed + 701),
    );
    rooms.push({
      id: faiz.id,
      color: "#4a1942",
      accent: "#e879f9",
      titleAr: "الفائز",
      titleEn: "Al-Faiz",
      promptAr: faiz.promptAr,
      promptEn: faiz.promptEn,
      optionsAr: order.map((index) => faizAr[index] ?? ""),
      optionsEn: order.map((index) => faizEn[index] ?? ""),
      correctIndex: order.indexOf(faiz.correctIndex),
    });
  }

  return shuffled(rooms, seed + 11).slice(0, ARENA_ROUNDS);
}

export function arenaSeconds(combo: number): number {
  return Math.max(5, 13.5 - combo * 0.75);
}

export function arenaKmh(combo: number): number {
  return 90 + combo * 22;
}

export function arenaScore(combo: number, secondsLeft: number): number {
  return 90 + combo * 35 + Math.round(secondsLeft * 10);
}
