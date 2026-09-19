import { CHAPTERS, getLesson } from "@/lib/curriculum";
import { BOOKS, bookSrc } from "@/lib/library";
import type { Locale } from "@/lib/locale";

export function lessonPdfPages(lessonId: string): number[] {
  const lesson = getLesson(lessonId);
  if (!lesson) return [];
  const chapter = CHAPTERS.find((item) => item.id === lesson.chapterId);
  const index = chapter?.lessons.findIndex((item) => item.id === lessonId) ?? -1;
  const next = index >= 0 ? chapter?.lessons[index + 1] : undefined;
  const start = lesson.pdfPage;
  const end = next && next.part === lesson.part ? next.pdfPage - 1 : start + 4;
  const pages: number[] = [];
  for (let page = start; page <= Math.max(start, end); page += 1) pages.push(page);
  return pages;
}

export function lessonBookView(locale: Locale, lessonId: string, offset = 0) {
  const lesson = getLesson(lessonId);
  if (!lesson) return null;
  const book = BOOKS.find((item) => item.language === locale && item.part === lesson.part);
  if (!book) return null;
  const pages = lessonPdfPages(lessonId);
  const page = pages[Math.min(Math.max(0, offset), Math.max(pages.length - 1, 0))] ?? lesson.pdfPage;
  return {
    href: `${bookSrc(book)}#page=${page}`,
    page,
    printed: lesson.bookPage + offset,
    slug: book.slug,
    courseHref: `/dashboard/courses/${book.slug}?page=${page}`,
  };
}
