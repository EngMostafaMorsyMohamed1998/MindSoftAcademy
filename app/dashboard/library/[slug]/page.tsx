import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BOOKS, bookAllowedForTrack, getBook } from "@/lib/library";
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

  if (!book) {
    return { title: "Book not found — Lumina" };
  }

  return {
    title: `${book.titleEn} — Lumina`,
    description: `${book.title} · Egyptian Baccalaureate textbook.`,
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
      backHref="/dashboard/courses"
      backLabel="Back to Library"
    />
  );
}
