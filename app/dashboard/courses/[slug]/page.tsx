import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BOOKS, getBook } from "@/lib/library";
import { BookViewer } from "../../library/book-viewer";

export function generateStaticParams() {
  return BOOKS.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/courses/[slug]">): Promise<Metadata> {
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

export default async function CourseBookPage({
  params,
}: PageProps<"/dashboard/courses/[slug]">) {
  const { slug } = await params;
  const book = getBook(slug);

  if (!book) {
    notFound();
  }

  return (
    <BookViewer book={book} backHref="/dashboard/courses" backLabel="Courses" />
  );
}
