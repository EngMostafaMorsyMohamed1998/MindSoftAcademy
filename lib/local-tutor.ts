import { CHAPTERS, getLesson, type Chapter } from "@/lib/curriculum";
import { getBook, type Book } from "@/lib/library";
import { LESSON_NOTES, type LessonNote } from "@/lib/lessons";
import { BANK_FACTS } from "@/lib/question-bank";
import type { BankFact } from "@/lib/question-bank/types";

const STOP = new Set([
  "هذا",
  "هذه",
  "ذلك",
  "على",
  "من",
  "في",
  "الى",
  "إلى",
  "عن",
  "او",
  "أو",
  "ما",
  "هو",
  "هي",
  "لي",
  "يا",
  "هل",
  "اشرح",
  "اشرحي",
  "لخص",
  "لخصي",
  "اختبرني",
  "اختبر",
  "سؤال",
  "سؤالين",
  "اسال",
  "كتاب",
  "الدرس",
  "درس",
  "الجزء",
  "الاول",
  "الثاني",
  "عربي",
  "معنى",
  "تعريف",
  "بسيط",
  "سريعا",
  "نقاط",
  "قصيرة",
  "الفكره",
  "الفكرة",
  "الاساسيه",
  "الاساسية",
  "the",
  "and",
  "for",
  "this",
  "that",
  "from",
  "with",
  "about",
  "what",
  "how",
  "explain",
  "summarize",
  "quiz",
  "lesson",
  "book",
  "part",
]);

type ScoredNote = {
  note: LessonNote;
  chapter: Chapter;
  score: number;
};

function arabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 2 && !STOP.has(token));
}

function haystack(note: LessonNote, chapter: Chapter): string {
  const lesson = getLesson(note.id);
  return normalize(
    [
      chapter.titleAr,
      chapter.titleEn,
      chapter.blurbAr,
      chapter.blurbEn,
      lesson?.titleAr ?? "",
      lesson?.titleEn ?? "",
      note.takeawayAr,
      note.takeawayEn,
      ...note.bodyAr,
      ...note.bodyEn,
      ...note.termsAr.flatMap((term) => [term.term, term.meaning]),
      ...note.termsEn.flatMap((term) => [term.term, term.meaning]),
    ].join(" "),
  );
}

function bookChapters(book?: Book): Chapter[] {
  if (!book) return CHAPTERS;
  if (book.kind === "workbook" || book.part === 1) {
    return CHAPTERS.filter((chapter) => chapter.part === 1);
  }
  return CHAPTERS.filter((chapter) => chapter.part === 2);
}

function scoreNotes(query: string, book?: Book): ScoredNote[] {
  const words = tokens(query);
  const chapters = bookChapters(book);
  return LESSON_NOTES.flatMap((note) => {
    const chapter = chapters.find((item) => item.id === note.chapterId);
    if (!chapter) return [];
    const hay = haystack(note, chapter);
    let score = 0;
    for (const word of words) {
      if (hay.includes(word)) score += word.length > 6 ? 3 : 2;
    }
    const chapterHit = query.match(/(?:فصل|chapter|وحده|وحدة)\s*([1-7])/i);
    if (chapterHit?.[1] === chapter.id) score += 8;
    return score > 0 ? [{ note, chapter, score }] : [];
  }).sort((a, b) => b.score - a.score);
}

function pickNotes(query: string, book?: Book): ScoredNote[] {
  const scored = scoreNotes(query, book);
  if (scored.length) return scored.slice(0, 2);
  const fallback = bookChapters(book)[0];
  const note = fallback ? LESSON_NOTES.find((row) => row.chapterId === fallback.id) : undefined;
  return fallback && note ? [{ note, chapter: fallback, score: 0 }] : [];
}

function intent(query: string): "quiz" | "summary" | "explain" {
  const n = normalize(query);
  if (/(اختبر|سؤال|كويز|quiz)/.test(n)) return "quiz";
  if (/(لخص|ملخص|نقاط|summar)/.test(n)) return "summary";
  return "explain";
}

function factsFor(note: LessonNote): BankFact[] {
  return BANK_FACTS.filter((row) => row.lessonId === note.id);
}

function explain(note: LessonNote, ar: boolean): string {
  const lesson = getLesson(note.id);
  const title = ar ? (lesson?.titleAr ?? note.id) : (lesson?.titleEn ?? note.id);
  const body = ar ? note.bodyAr : note.bodyEn;
  const terms = ar ? note.termsAr : note.termsEn;
  const takeaway = ar ? note.takeawayAr : note.takeawayEn;
  const termLines = terms.slice(0, 4).map((term) => `• ${term.term}: ${term.meaning}`);
  return [`${title}`, "", ...body.slice(0, 3), "", ...termLines, "", ar ? `الخلاصة: ${takeaway}` : `Takeaway: ${takeaway}`]
    .filter((line, index, rows) => line !== "" || rows[index - 1] !== "")
    .join("\n");
}

function summary(note: LessonNote, ar: boolean): string {
  const lesson = getLesson(note.id);
  const title = ar ? (lesson?.titleAr ?? note.id) : (lesson?.titleEn ?? note.id);
  const body = ar ? note.bodyAr : note.bodyEn;
  const takeaway = ar ? note.takeawayAr : note.takeawayEn;
  return [title, ...body.slice(0, 3).map((line) => `• ${line}`), ar ? `الخلاصة: ${takeaway}` : `Takeaway: ${takeaway}`].join(
    "\n",
  );
}

function quiz(note: LessonNote, ar: boolean): string {
  const rows = factsFor(note).slice(0, 2);
  if (!rows.length) {
    const terms = ar ? note.termsAr : note.termsEn;
    return terms
      .slice(0, 2)
      .map((term, index) =>
        ar
          ? `${index + 1}) ما معنى «${term.term}»؟\nالإجابة: ${term.meaning}`
          : `${index + 1}) What does “${term.term}” mean?\nAnswer: ${term.meaning}`,
      )
      .join("\n\n");
  }
  return rows
    .map((row, index) =>
      ar
        ? `${index + 1}) ${row.claimAr}\nالإجابة: ${row.termAr} — ${row.whyAr}`
        : `${index + 1}) ${row.claimEn}\nAnswer: ${row.termEn} — ${row.whyEn}`,
    )
    .join("\n\n");
}

function mapReply(picked: ScoredNote[], query: string, ar: boolean): string {
  const kind = intent(query);
  const chunks = picked.map((row) => {
    if (kind === "quiz") return quiz(row.note, ar);
    if (kind === "summary") return summary(row.note, ar);
    return explain(row.note, ar);
  });
  const prefix = ar
    ? "من منهج الكتاب جوّه المنصة:"
    : "From the syllabus on this platform:";
  return [prefix, "", ...chunks].join("\n");
}

export function askLocalTutor(input: {
  message: string;
  bookSlug?: string;
  currentTopic?: string;
}): string {
  const book = input.bookSlug ? getBook(input.bookSlug) : undefined;
  const query = [input.message, input.currentTopic ?? ""].join(" ");
  const ar = arabic(input.message) || book?.language === "ar";
  const picked = pickNotes(query, book);
  if (!picked.length) {
    return ar
      ? "اسأل عن درس من المنهج: قانون مور، التشفير، تصميم الويب، أو الذكاء الاصطناعي."
      : "Ask about a syllabus lesson: Moore’s Law, encryption, web design, or AI.";
  }
  return mapReply(picked, query, ar);
}
