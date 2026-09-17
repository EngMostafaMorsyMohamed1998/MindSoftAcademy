import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allBooks, getBook } from "@/lib/library";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { BookViewer } from "../../library/book-viewer";

export function generateStaticParams() {
  return allBooks().map((book) => ({ slug: book.slug }));
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
  searchParams,
}: PageProps<"/dashboard/courses/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;
  const book = getBook(slug);
  const page = Number(query.page);

  if (!book) {
    notFound();
  }
  const locale = await getLocale();
  const workbook = book.kind === "workbook";

  return (
    <BookViewer
      book={book}
      backHref={workbook ? "/dashboard/faiz" : "/dashboard/courses"}
      backLabel={workbook ? t(locale, "navFaiz") : t(locale, "navBook")}
      page={Number.isFinite(page) && page > 0 ? page : undefined}
    />
  );
}
