/**
 * Official Egyptian Baccalaureate textbooks published by the Ministry of
 * Education (وزارة التربية والتعليم والتعليم الفني).
 *
 * The PDFs live in `public/books/` and are fetched with `npm run books:fetch`.
 * `sourceUrl` keeps the ministry's original link for attribution and as a
 * fallback if a local copy is missing.
 */

export type BookLanguage = "ar" | "en";

export type BookKind = "ministry" | "workbook" | "assessments";

export type Book = {
  slug: string;
  /** Title as printed on the ministry page. */
  title: string;
  titleEn: string;
  language: BookLanguage;
  part: 1 | 2;
  kind?: BookKind;
  /** Path served by Next from `public/`. */
  file: string;
  sourceUrl: string;
  sizeMb: number;
};

export const LIBRARY_SOURCE_PAGE =
  "https://ellibrary.moe.gov.eg/EgyptianBaccalaureate/SpecializedSubjects/Engineering-ComputerScience/Programming-ArtificialIntelligence/";

export const SUBJECT = {
  title: "البرمجة والذكاء الاصطناعي",
  titleEn: "Programming and Artificial Intelligence",
  track: "الهندسة وعلوم الحاسب",
  trackEn: "Engineering and Computer Science",
  grade: "الصف الثاني",
  gradeEn: "Second year",
  year: "2026–2027",
};

const BLOB_BASE =
  "https://egyptianbaccalaureate.blob.core.windows.net/egyptianbaccalaureate";

export const BOOKS: Book[] = [
  {
    slug: "programming-ai-ar-part1",
    title: "كتاب الطالب - الجزء الأول (عربي)",
    titleEn: "Student book — part 1 (Arabic)",
    language: "ar",
    part: 1,
    file: "/books/programming-ai-ar-part1.pdf",
    sourceUrl: `${BLOB_BASE}/Programming-ArtificialIntelligence-Ar-EB-part1.pdf`,
    sizeMb: 31.4,
  },
  {
    slug: "programming-ai-en-part1",
    title: "كتاب الطالب - الجزء الأول (إنجليزي)",
    titleEn: "Student book — part 1 (English)",
    language: "en",
    part: 1,
    file: "/books/programming-ai-en-part1.pdf",
    sourceUrl: `${BLOB_BASE}/Programming-ArtificialIntelligence-En-EB-part1.pdf`,
    sizeMb: 24.5,
  },
  {
    slug: "programming-ai-ar-part2",
    title: "كتاب الطالب - الجزء الثاني (عربي)",
    titleEn: "Student book — part 2 (Arabic)",
    language: "ar",
    part: 2,
    file: "/books/programming-ai-ar-part2.pdf",
    sourceUrl: `${BLOB_BASE}/Programming-ArtificialIntelligence-Ar-EB-part2.pdf`,
    sizeMb: 19.5,
  },
  {
    slug: "programming-ai-en-part2",
    title: "كتاب الطالب - الجزء الثاني (إنجليزي)",
    titleEn: "Student book — part 2 (English)",
    language: "en",
    part: 2,
    file: "/books/programming-ai-en-part2.pdf",
    sourceUrl: `${BLOB_BASE}/Programming-ArtificialIntelligence-En-EB-part2.pdf`,
    sizeMb: 17.8,
  },
];

export const FAIZ_BOOK: Book = {
  slug: "faiz-programming-ar-part1",
  title: "الفائز — برمجة 2 بكالوريا الجزء الأول 2027",
  titleEn: "Al-Faiz — Programming, 2nd Baccalaureate, Part 1 (2027)",
  language: "ar",
  part: 1,
  kind: "workbook",
  file: "/books/faiz-programming-ar-part1.pdf",
  sourceUrl: "/books/faiz-programming-ar-part1.pdf",
  sizeMb: 60.4,
};

export const ASSESS_BOOK: Book = {
  slug: "programming-ai-ar-assessments-1",
  title: "الأداءات والتقييمات — الجزء الأول (عربي)",
  titleEn: "Performances and assessments — part 1 (Arabic)",
  language: "ar",
  part: 1,
  kind: "assessments",
  file: "/books/programming-ai-ar-assessments-1.pdf",
  sourceUrl: `${BLOB_BASE}/Programming-ArtificialIntelligence-Ar-EB-Assessments-1.pdf`,
  sizeMb: 1.0,
};

export const ASSESS_BOOK_EN: Book = {
  slug: "programming-ai-en-assessments-1",
  title: "Performances and assessments — part 1 (English)",
  titleEn: "Performances and assessments — part 1 (English)",
  language: "en",
  part: 1,
  kind: "assessments",
  file: "/books/programming-ai-en-assessments-1.pdf",
  sourceUrl: `${BLOB_BASE}/Programming-ArtificialIntelligence-En-EB-Assessments-1.pdf`,
  sizeMb: 1.0,
};

export function bookSrc(book: Book): string {
  return book.kind === "workbook" || book.kind === "assessments" ? book.file : book.sourceUrl;
}

export function getBook(slug: string): Book | undefined {
  return allBooks().find((book) => book.slug === slug);
}

export function allBooks(): Book[] {
  return [...BOOKS, FAIZ_BOOK, ASSESS_BOOK, ASSESS_BOOK_EN];
}

export function booksForTrack(track: BookLanguage): Book[] {
  return BOOKS.filter((book) => book.language === track);
}

export function assessBookForTrack(track: BookLanguage): Book {
  return track === "en" ? ASSESS_BOOK_EN : ASSESS_BOOK;
}

export function extraBooksForTrack(track: BookLanguage): Book[] {
  return track === "en" ? [ASSESS_BOOK_EN] : [FAIZ_BOOK, ASSESS_BOOK];
}

export function bookAllowedForTrack(book: Book, track: BookLanguage): boolean {
  if (book.kind === "workbook") return track === "ar";
  if (book.kind === "assessments") return book.language === track;
  return book.language === track;
}
