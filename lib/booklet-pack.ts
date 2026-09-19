import { bookletSafe, hasArabic } from "@/lib/booklet-lang";
import { CHAPTERS, getChapter, getLesson, type Chapter, type ChapterId } from "@/lib/curriculum";
import { FAIZ_UNITS } from "@/lib/faiz";
import { FAIZ_ESSAYS, FAIZ_OBJECTIVES } from "@/lib/faiz-exam";
import { FAIZ_NOTES, type FaizUnitNote } from "@/lib/faiz-notes";
import { questionsForChapter, questionsForLesson, withShuffledOptions, type HomeworkQuestion } from "@/lib/homework-bank";
import { LESSON_NOTES } from "@/lib/lessons";
import { analysisForChapter, BANK_FACTS } from "@/lib/question-bank";
import type { AnalysisPrompt, BankFact } from "@/lib/question-bank/types";
import type { Locale } from "@/lib/locale";
import { shuffled } from "@/lib/shuffle";
import type { EssayQuestion, ObjectiveQuestion } from "@/lib/exams";

export const BOOKLET_PRACTICE = 24;
export const BOOKLET_CHAPTER_ESSAYS = 3;
export const BOOKLET_SCENES = 6;
export const BOOKLET_LESSON_SCENES = 4;
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
  promptAr: string;
  promptEn: string;
  choiceAr: string;
  choiceEn: string;
};

export type BookletAnswerGroup = {
  titleAr: string;
  titleEn: string;
  answers: BookletAnswer[];
};

export type BookletChapterPack = {
  chapter: Chapter;
  practice: BookletMcq[];
  essays: BookletEssay[];
  scenes: BankFact[];
  answers: BookletAnswer[];
  answerGroups: BookletAnswerGroup[];
};

export type BookletLessonPack = {
  lessonId: string;
  chapter: Chapter;
  titleAr: string;
  titleEn: string;
  practice: BookletMcq[];
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

function mixMcq(row: BookletMcq): BookletMcq {
  const count = Math.min(row.optionsAr.length, row.optionsEn.length);
  if (count < 2) return row;
  let seed = 4401;
  for (const ch of row.id) seed = (seed * 33 + ch.charCodeAt(0)) >>> 0;
  const order = shuffled(
    Array.from({ length: count }, (_, index) => index),
    seed,
  );
  return {
    ...row,
    optionsAr: order.map((index) => row.optionsAr[index]!),
    optionsEn: order.map((index) => row.optionsEn[index]!),
    correctIndex: order.indexOf(row.correctIndex),
  };
}

function asMcq(question: HomeworkQuestion): BookletMcq {
  const next = withShuffledOptions(question, 811);
  return mixMcq({
    id: next.id,
    promptAr: next.promptAr,
    promptEn: next.promptEn,
    optionsAr: next.optionsAr,
    optionsEn: next.optionsEn,
    correctIndex: next.correctIndex,
  });
}

function objectiveAsMcq(question: ObjectiveQuestion): BookletMcq {
  return mixMcq({
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
  return rows.map((row) => ({
    id: row.id,
    index: row.correctIndex,
    promptAr: row.promptAr,
    promptEn: row.promptEn,
    choiceAr: row.optionsAr[row.correctIndex] ?? "",
    choiceEn: row.optionsEn[row.correctIndex] ?? "",
  }));
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

export const BOOKLET_LESSON_DRILLS = 30;

function parkAnswer(row: BookletMcq, dest: number): BookletMcq {
  const count = Math.min(row.optionsAr.length, row.optionsEn.length);
  if (count < 2) return row;
  const target = dest % count;
  const shift = (row.correctIndex - target + count) % count;
  if (shift === 0) return row;
  return {
    ...row,
    optionsAr: row.optionsAr.map((_, index) => row.optionsAr[(index + shift) % count]!),
    optionsEn: row.optionsEn.map((_, index) => row.optionsEn[(index + shift) % count]!),
    correctIndex: target,
  };
}

export function bookletLessonPractice(lessonId: string): BookletMcq[] {
  const chapterSeed = Number(lessonId.split("-")[0] ?? "1") * 31;
  const own = shuffled(questionsForLesson(lessonId).filter(usableMcq), 2027 + chapterSeed + lessonId.length);
  const seen = new Set(own.map((row) => row.id));
  const chapterId = own[0]?.chapterId ?? getLesson(lessonId)?.chapterId;
  const extra = chapterId
    ? shuffled(
        questionsForChapter(chapterId).filter((row) => usableMcq(row) && !seen.has(row.id)),
        4401 + chapterSeed,
      )
    : [];
  return [...own, ...extra].slice(0, BOOKLET_LESSON_DRILLS).map((row, index) => parkAnswer(asMcq(row), index % 4));
}

function chapterLessonIds(chapterId: ChapterId): string[] {
  return LESSON_NOTES.filter((note) => note.chapterId === chapterId).map((note) => note.id);
}

function uniqueTermScenes(facts: BankFact[], take: number, seed: number): BankFact[] {
  const seen = new Set<string>();
  const picked: BankFact[] = [];
  for (const fact of shuffled(facts, seed)) {
    const key = fact.termEn.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(fact);
    if (picked.length >= take) break;
  }
  return picked;
}

export function bookletChapterPack(chapter: Chapter): BookletChapterPack {
  const lessonDrills = chapterLessonIds(chapter.id).map((id) => ({
    id,
    practice: bookletLessonPractice(id),
  }));
  const practice = lessonDrills.flatMap((row) => row.practice);
  const essays = analysisForChapter(chapter.id).slice(0, BOOKLET_CHAPTER_ESSAYS).map(analysisAsEssay);
  const scenes = uniqueTermScenes(
    BANK_FACTS.filter((row) => row.chapterId === chapter.id),
    BOOKLET_SCENES,
    440 + Number(chapter.id),
  );
  return {
    chapter,
    practice,
    essays,
    scenes,
    answers: withAnswers(practice),
    answerGroups: lessonDrills.map((row) => ({
      titleAr: `تدريبات الدرس ${row.id}`,
      titleEn: `Lesson ${row.id} practice`,
      answers: withAnswers(row.practice),
    })),
  };
}

export type BookletScope = string;

export function homeworkChapterId(value: string): ChapterId | null {
  const match = /^hw-([1-7])$/.exec(value);
  return match ? (match[1] as ChapterId) : null;
}

export function faizUnitId(value: string): "f1" | "f2" | "f3" | "f4" | null {
  return /^f[1-4]$/.test(value) ? (value as "f1" | "f2" | "f3" | "f4") : null;
}

export function isBookletScope(value: string | null | undefined): value is BookletScope {
  if (!value) return false;
  if (value === "faiz" || value === "faiz-hw") return true;
  if (homeworkChapterId(value) || faizUnitId(value)) return true;
  return Boolean(getLesson(value));
}

function termNamesMatch(left: string, right: string): boolean {
  const a = left.trim().toLowerCase();
  const b = right.trim().toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length < 3 || b.length < 3) return false;
  if (a.startsWith(`${b} `) || b.startsWith(`${a} `)) return true;
  if ((a === "hash" && b === "hashing") || (b === "hash" && a === "hashing")) return true;
  if ((a === "mfa" && b.includes("factor")) || (b === "mfa" && a.includes("factor"))) return true;
  return false;
}

export function bookletLessonScenes(lessonId: string, take = BOOKLET_LESSON_SCENES): BankFact[] {
  const note = LESSON_NOTES.find((row) => row.id === lessonId);
  if (!note) return [];
  const terms = note.termsEn.map((term) => term.term.trim());
  const matched = BANK_FACTS.filter(
    (row) =>
      row.chapterId === note.chapterId &&
      terms.some((term) => termNamesMatch(term, row.termEn) || termNamesMatch(term, row.termAr)),
  );
  return uniqueTermScenes(matched, take, 440 + lessonId.length * 17);
}

export function bookletFaizPack(unitId: string): BookletFaizPack | undefined {
  return bookletFaizPacks().find((pack) => pack.note.id === unitId);
}

export function bookletLessonPack(lessonId: string): BookletLessonPack | null {
  const note = LESSON_NOTES.find((row) => row.id === lessonId);
  const lesson = getLesson(lessonId);
  const chapter = note ? getChapter(note.chapterId) : undefined;
  if (!note || !lesson || !chapter) return null;
  const practice = bookletLessonPractice(lessonId);
  return {
    lessonId,
    chapter,
    titleAr: lesson.titleAr,
    titleEn: lesson.titleEn,
    practice,
    scenes: bookletLessonScenes(lessonId),
    answers: withAnswers(practice),
  };
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
