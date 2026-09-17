import { CHAPTERS, type Chapter, type ChapterId } from "@/lib/curriculum";
import { FAIZ_UNITS } from "@/lib/faiz";
import { FAIZ_ESSAYS, FAIZ_OBJECTIVES } from "@/lib/faiz-exam";
import { FAIZ_NOTES, type FaizUnitNote } from "@/lib/faiz-notes";
import { questionsForChapter, type HomeworkQuestion } from "@/lib/homework-bank";
import { analysisForChapter, BANK_FACTS } from "@/lib/question-bank";
import type { AnalysisPrompt, BankFact } from "@/lib/question-bank/types";
import { shuffled } from "@/lib/shuffle";
import type { EssayQuestion, ObjectiveQuestion } from "@/lib/exams";

export const BOOKLET_PRACTICE = 36;
export const BOOKLET_CHAPTER_ESSAYS = 6;
export const BOOKLET_SCENES = 4;
export const BOOKLET_HOMEWORK_PER_CHAPTER = 12;
export const BOOKLET_HOMEWORK_ESSAYS = 3;

export type BookletMcq = {
  id: string;
  promptAr: string;
  promptEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
};

export type BookletEssay = {
  id: string;
  promptAr: string;
  promptEn: string;
};

export type BookletChapterPack = {
  chapter: Chapter;
  practice: BookletMcq[];
  essays: BookletEssay[];
  scenes: BankFact[];
  answers: { id: string; letter: string }[];
};

export type BookletHomeworkPack = {
  id: string;
  titleAr: string;
  titleEn: string;
  mcq: BookletMcq[];
  essays: BookletEssay[];
  answers: { id: string; letter: string }[];
};

export type BookletFaizPack = {
  note: FaizUnitNote;
  practice: BookletMcq[];
  answers: { id: string; letter: string }[];
};

function asMcq(question: HomeworkQuestion): BookletMcq {
  return {
    id: question.id,
    promptAr: question.promptAr,
    promptEn: question.promptEn,
    optionsAr: question.optionsAr,
    optionsEn: question.optionsEn,
    correctIndex: question.correctIndex,
  };
}

function objectiveAsMcq(question: ObjectiveQuestion): BookletMcq {
  return {
    id: question.id,
    promptAr: question.promptAr,
    promptEn: question.promptEn,
    optionsAr: [...(question.optionsAr ?? [])],
    optionsEn: [...(question.optionsEn ?? [])],
    correctIndex: question.correctIndex,
  };
}

function analysisAsEssay(row: AnalysisPrompt): BookletEssay {
  return { id: row.id, promptAr: row.promptAr, promptEn: row.promptEn };
}

function essayAsEssay(row: EssayQuestion): BookletEssay {
  return { id: row.id, promptAr: row.promptAr, promptEn: row.promptEn };
}

function answerLetter(index: number): string {
  return ["أ", "ب", "ج", "د", "هـ"][index] ?? String(index + 1);
}

function withAnswers(rows: BookletMcq[]): { id: string; letter: string }[] {
  return rows.map((row) => ({ id: row.id, letter: answerLetter(row.correctIndex) }));
}

function chapterMcqPool(chapterId: ChapterId): BookletMcq[] {
  return shuffled(
    questionsForChapter(chapterId).filter((row) => row.kind === "mcq"),
    2027 + Number(chapterId) * 31,
  ).map(asMcq);
}

export function bookletChapterPack(chapter: Chapter): BookletChapterPack {
  const pool = chapterMcqPool(chapter.id);
  const practice = pool.slice(0, BOOKLET_PRACTICE);
  const essays = analysisForChapter(chapter.id).slice(0, BOOKLET_CHAPTER_ESSAYS).map(analysisAsEssay);
  const scenes = shuffled(
    BANK_FACTS.filter((row) => row.chapterId === chapter.id),
    440 + Number(chapter.id),
  ).slice(0, BOOKLET_SCENES);
  return {
    chapter,
    practice,
    essays,
    scenes,
    answers: withAnswers(practice),
  };
}

export function bookletHomeworkForPart(part: 1 | 2): BookletHomeworkPack {
  const chapters = CHAPTERS.filter((chapter) => chapter.part === part);
  const mcq = chapters.flatMap((chapter) => {
    const pool = chapterMcqPool(chapter.id);
    const next = pool.slice(BOOKLET_PRACTICE, BOOKLET_PRACTICE + BOOKLET_HOMEWORK_PER_CHAPTER);
    return next.length ? next : pool.slice(0, BOOKLET_HOMEWORK_PER_CHAPTER);
  });
  const essays = chapters.flatMap((chapter) =>
    analysisForChapter(chapter.id)
      .slice(BOOKLET_CHAPTER_ESSAYS, BOOKLET_CHAPTER_ESSAYS + BOOKLET_HOMEWORK_ESSAYS)
      .map(analysisAsEssay),
  );
  return {
    id: `part-${part}`,
    titleAr: part === 1 ? "واجب الجزء الأول" : "واجب الجزء الثاني",
    titleEn: part === 1 ? "Part 1 homework" : "Part 2 homework",
    mcq,
    essays,
    answers: withAnswers(mcq),
  };
}

const FAIZ_RANGES: { id: FaizUnitNote["id"]; match: (id: string) => boolean }[] = [
  { id: "f1", match: (id) => /faiz-(1|2|3|4|5|6|7|8|9|10|11|12|43|44|51)$/.test(id) },
  { id: "f2", match: (id) => /faiz-(13|14|15|16|17|18|19|20|21|22|45|46)$/.test(id) },
  { id: "f3", match: (id) => /faiz-(23|24|25|26|27|28|29|30|31|32|47|48)$/.test(id) },
  { id: "f4", match: (id) => /faiz-(33|34|35|36|37|38|39|40|41|42|49|50)$/.test(id) },
];

export function bookletFaizPacks(): BookletFaizPack[] {
  return FAIZ_UNITS.map((unit) => {
    const note = FAIZ_NOTES.find((row) => row.id === unit.id)!;
    const range = FAIZ_RANGES.find((row) => row.id === unit.id);
    const practice = FAIZ_OBJECTIVES.filter((row) => range?.match(row.id)).map(objectiveAsMcq);
    return { note, practice, answers: withAnswers(practice) };
  });
}

export function bookletFaizHomework(): BookletHomeworkPack {
  const used = new Set(bookletFaizPacks().flatMap((pack) => pack.practice.map((row) => row.id)));
  const leftover = FAIZ_OBJECTIVES.filter((row) => !used.has(row.id)).map(objectiveAsMcq);
  const extra = FAIZ_OBJECTIVES.filter((row) => used.has(row.id)).slice(0, 8).map(objectiveAsMcq);
  const mcq = leftover.length ? leftover : extra;
  return {
    id: "faiz",
    titleAr: "واجب كتاب الفائز",
    titleEn: "Al-Faiz homework",
    mcq,
    essays: FAIZ_ESSAYS.map(essayAsEssay),
    answers: withAnswers(mcq),
  };
}

export function bookletParts() {
  return [
    { part: 1 as const, chapters: CHAPTERS.filter((chapter) => chapter.part === 1) },
    { part: 2 as const, chapters: CHAPTERS.filter((chapter) => chapter.part === 2) },
  ];
}
