import type { Metadata } from "next";
import Link from "next/link";
import { BOOKS, SUBJECT } from "@/lib/library";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "الكتاب الوزاري",
};

export default async function CoursesPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-serif text-3xl">{t(locale, "booksOfficial")}</h1>
      <p className="mt-2 text-sm text-foreground/65">
        {locale === "ar" ? SUBJECT.title : SUBJECT.titleEn} · {SUBJECT.year}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {BOOKS.map((book) => (
          <Link
            key={book.slug}
            href={`/dashboard/courses/${book.slug}`}
            className="rounded-3xl bg-white p-5 ring-1 ring-primary/10"
          >
            <p className="text-xs font-semibold text-primary/60">
              {book.language === "ar" ? "عربي" : "English"} · {book.part === 1 ? t(locale, "part1") : t(locale, "part2")}
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              {locale === "ar" ? book.title : book.titleEn}
            </h2>
            <p className="mt-1 text-xs text-foreground/50">{book.sizeMb} MB</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
