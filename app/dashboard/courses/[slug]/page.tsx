import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allBooks, bookAllowedForTrack, getBook } from "@/lib/library";
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
  if (!bookAllowedForTrack(book, locale)) {
    notFound();
  }
  const workbook = book.kind === "workbook";

  return (
    <BookViewer
      book={book}
      locale={locale}
      backHref={workbook ? "/dashboard/faiz" : "/dashboard/courses"}
      backLabel={workbook ? t(locale, "navFaiz") : t(locale, "libraryBack")}
      page={Number.isFinite(page) && page > 0 ? page : undefined}
    />
  );
}
