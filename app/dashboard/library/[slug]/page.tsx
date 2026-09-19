import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BOOKS, bookAllowedForTrack, getBook } from "@/lib/library";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { BookViewer } from "../book-viewer";

export function generateStaticParams() {
  return BOOKS.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/library/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  const locale = await getLocale();

  if (!book) {
    return { title: "MindSoft Academy" };
  }

  const title = locale === "ar" ? book.title : book.titleEn;
  return {
    title: `${title} — MindSoft Academy`,
    description: `${book.title} · ${book.titleEn}`,
  };
}

export default async function LibraryBookPage({
  params,
}: PageProps<"/dashboard/library/[slug]">) {
  const { slug } = await params;
  const book = getBook(slug);

  if (!book) {
    notFound();
  }
  const locale = await getLocale();
  if (!bookAllowedForTrack(book, locale)) {
    notFound();
  }

  return (
    <BookViewer
      book={book}
      locale={locale}
      backHref="/dashboard/courses"
      backLabel={t(locale, "libraryBack")}
    />
  );
}
