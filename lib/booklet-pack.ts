import { bookletSafe, hasArabic } from "@/lib/booklet-lang";
import { CHAPTERS, isChapterId, type Chapter, type ChapterId } from "@/lib/curriculum";
import { FAIZ_UNITS } from "@/lib/faiz";
import { FAIZ_ESSAYS, FAIZ_OBJECTIVES } from "@/lib/faiz-exam";
import { FAIZ_NOTES, type FaizUnitNote } from "@/lib/faiz-notes";
import { questionsForChapter, questionsForLesson, type HomeworkQuestion } from "@/lib/homework-bank";
import { LESSON_NOTES } from "@/lib/lessons";
import { analysisForChapter, BANK_FACTS } from "@/lib/question-bank";
import type { AnalysisPrompt, BankFact } from "@/lib/question-bank/types";
import type { Locale } from "@/lib/locale";
import { shuffled } from "@/lib/shuffle";
import type { EssayQuestion, ObjectiveQuestion } from "@/lib/exams";

export const BOOKLET_PRACTICE = 24;
export const BOOKLET_CHAPTER_ESSAYS = 3;
export const BOOKLET_SCENES = 6;
export const BOOKLET_HOMEWORK_PER_CHAPTER = 8;
export const BOOKLET_HOMEWORK_ESSAYS = 2;

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
  guideAr: string;
  guideEn: string;
};

export type BookletAnswer = {
  id: string;
  index: number;
};

export type BookletChapterPack = {
  chapter: Chapter;
  practice: BookletMcq[];
  essays: BookletEssay[];
  scenes: BankFact[];
  answers: BookletAnswer[];
};

export type BookletHomeworkPack = {
  id: string;
  titleAr: string;
  titleEn: string;
  mcq: BookletMcq[];
  essays: BookletEssay[];
  answers: BookletAnswer[];
};

export type BookletFaizPack = {
  note: FaizUnitNote;
  practice: BookletMcq[];
  answers: BookletAnswer[];
};

export function bookletLetters(locale: Locale): string[] {
  return locale === "ar" ? ["أ", "ب", "ج", "د"] : ["A", "B", "C", "D"];
}

export function bookletPrompt(locale: Locale, promptAr: string, promptEn: string): string {
  return bookletSafe(locale, locale === "ar" ? promptAr : promptEn);
}

export function bookletOptions(locale: Locale, optionsAr: string[], optionsEn: string[]): string[] {
  const count = Math.min(4, Math.max(optionsAr.length, optionsEn.length));
  const rows: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const ar = optionsAr[index]?.trim() ?? "";
    const en = optionsEn[index]?.trim() ?? "";
    if (locale === "ar") {
      const pick = hasArabic(ar) ? ar : hasArabic(en) ? en : ar || en;
      rows.push(bookletSafe("ar", pick));
    } else {
      const pick = en && !hasArabic(en) ? en : ar && !hasArabic(ar) ? ar : en || ar;
      rows.push(bookletSafe("en", pick));
    }
  }
  return rows;
}

function shuffleBookletMcq(question: BookletMcq): BookletMcq {
  const count = Math.min(4, Math.max(question.optionsAr.length, question.optionsEn.length));
  if (count < 2) return question;
  let seed = 2027;
  for (let i = 0; i < question.id.length; i += 1) {
    seed = (seed + question.id.charCodeAt(i) * (i + 3)) >>> 0;
  }
  const order = shuffled(
    Array.from({ length: count }, (_, index) => index),
    seed,
  );
  const next = order.indexOf(question.correctIndex);
  return {
    ...question,
    optionsAr: order.map((index) => question.optionsAr[index] ?? ""),
    optionsEn: order.map((index) => question.optionsEn[index] ?? ""),
    correctIndex: next >= 0 ? next : 0,
  };
}

function asMcq(question: HomeworkQuestion): BookletMcq {
  return shuffleBookletMcq({
    id: question.id,
    promptAr: question.promptAr,
    promptEn: question.promptEn,
    optionsAr: question.optionsAr,
    optionsEn: question.optionsEn,
    correctIndex: question.correctIndex,
  });
}

function objectiveAsMcq(question: ObjectiveQuestion): BookletMcq {
  return shuffleBookletMcq({
    id: question.id,
    promptAr: question.promptAr,
    promptEn: question.promptEn,
    optionsAr: [...(question.optionsAr ?? [])],
    optionsEn: [...(question.optionsEn ?? [])],
    correctIndex: question.correctIndex,
  });
}

export function bookletAnswerMark(locale: Locale, index: number): string {
  return bookletLetters(locale)[index] ?? String(index + 1);
}

function analysisAsEssay(row: AnalysisPrompt): BookletEssay {
  return {
    id: row.id,
    promptAr: row.promptAr,
    promptEn: row.promptEn,
    guideAr: row.guideAr,
    guideEn: row.guideEn,
  };
}

function essayAsEssay(row: EssayQuestion): BookletEssay {
  return {
    id: row.id,
    promptAr: row.promptAr,
    promptEn: row.promptEn,
    guideAr: row.guideAr,
    guideEn: row.guideEn,
  };
}

function withAnswers(rows: BookletMcq[]): BookletAnswer[] {
  return rows.map((row) => ({ id: row.id, index: row.correctIndex }));
}

function usableMcq(row: HomeworkQuestion): boolean {
  return row.kind === "mcq" && row.optionsAr.length >= 2 && Boolean(row.promptAr.trim() || row.promptEn.trim());
}

function chapterMcqPool(chapterId: ChapterId): BookletMcq[] {
  return shuffled(
    questionsForChapter(chapterId).filter(usableMcq),
    2027 + Number(chapterId) * 31,
  ).map(asMcq);
}

export const BOOKLET_LESSON_DRILLS = 6;

export function bookletLessonPractice(lessonId: string): BookletMcq[] {
  const chapterSeed = Number(lessonId.split("-")[0] ?? "1") * 31;
  return shuffled(questionsForLesson(lessonId).filter(usableMcq), 2027 + chapterSeed + lessonId.length).slice(0, BOOKLET_LESSON_DRILLS).map(asMcq);
}

function chapterLessonIds(chapterId: ChapterId): string[] {
  return LESSON_NOTES.filter((note) => note.chapterId === chapterId).map((note) => note.id);
}

export function bookletChapterPack(chapter: Chapter): BookletChapterPack {
  const practice = chapterLessonIds(chapter.id).flatMap((id) => bookletLessonPractice(id));
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

export type BookletScope = ChapterId | "faiz";

export function isBookletScope(value: string | null | undefined): value is BookletScope {
  return value === "faiz" || (typeof value === "string" && isChapterId(value));
}

export function bookletHomeworkForChapter(chapter: Chapter): BookletHomeworkPack {
  const used = new Set(chapterLessonIds(chapter.id).flatMap((id) => bookletLessonPractice(id).map((row) => row.id)));
  const pool = chapterMcqPool(chapter.id).filter((row) => !used.has(row.id));
  const mcq = pool.slice(0, BOOKLET_HOMEWORK_PER_CHAPTER);
  const picked = mcq.length ? mcq : chapterMcqPool(chapter.id).slice(0, BOOKLET_HOMEWORK_PER_CHAPTER);
  const essays = analysisForChapter(chapter.id)
    .slice(BOOKLET_CHAPTER_ESSAYS, BOOKLET_CHAPTER_ESSAYS + BOOKLET_HOMEWORK_ESSAYS)
    .map(analysisAsEssay);
  return {
    id: `ch-${chapter.id}`,
    titleAr: `واجب الفصل ${chapter.id}`,
    titleEn: `Chapter ${chapter.id} homework`,
    mcq: picked,
    essays,
    answers: withAnswers(picked),
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

export function buildBookletDocument() {
  const parts = bookletParts().map(({ part, chapters }) => ({
    part,
    chapters: chapters.map((chapter) => bookletChapterPack(chapter)),
    homework: bookletHomeworkForPart(part),
  }));
  const faiz = bookletFaizPacks();
  const faizHomework = bookletFaizHomework();
  return { parts, faiz, faizHomework };
}
