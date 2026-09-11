import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Download, ExternalLink, FileText, Languages } from "lucide-react";
import { BOOKS, LIBRARY_SOURCE_PAGE, SUBJECT } from "@/lib/library";

export const metadata: Metadata = {
  title: "Courses — Lumina",
  description:
    "Egyptian Baccalaureate course textbooks for Programming and Artificial Intelligence.",
};

export default function CoursesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-serif text-3xl tracking-tight">Courses</h1>
      <p className="mt-2 text-sm text-foreground/65">
        Official textbooks for your Baccalaureate track, from the Ministry
        of Education.
      </p>

      <article className="mt-8 overflow-hidden rounded-3xl border border-primary/8 bg-white shadow-sm shadow-primary/5">
        <div className="bg-primary-dark p-6 text-white sm:p-8">
          <p className="text-xs font-semibold tracking-wide text-white/55 uppercase">
            {SUBJECT.trackEn} · {SUBJECT.gradeEn} · {SUBJECT.year}
          </p>
          <h2 className="mt-2 font-serif text-2xl tracking-tight sm:text-3xl" dir="rtl">
            {SUBJECT.title}
          </h2>
          <p className="mt-2 text-sm text-white/70">{SUBJECT.titleEn}</p>
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-white/60">
            <BookOpen className="size-3.5" aria-hidden="true" />
            {BOOKS.length} official textbooks
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          {BOOKS.map((book) => (
            <article
              key={book.slug}
              className="flex flex-col rounded-2xl border border-primary/8 bg-background p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/8 text-primary ring-1 ring-primary/10">
                  <FileText className="size-5" aria-hidden="true" />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary">
                  <Languages className="size-3.5" aria-hidden="true" />
                  {book.language === "ar" ? "العربية" : "English"} · Part{" "}
                  {book.part}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight" dir="rtl">
                {book.title}
              </h3>
              <p className="mt-1 text-sm text-foreground/60">
                {book.titleEn} · {book.sizeMb} MB
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link
                  href={`/dashboard/courses/${book.slug}`}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-muted"
                >
                  Read
                </Link>
                <a
                  href={book.file}
                  download
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-primary/15 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download
                </a>
              </div>
            </article>
          ))}
        </div>
      </article>

      <p className="mt-6 text-xs leading-relaxed text-foreground/50">
        Published by وزارة التربية والتعليم والتعليم الفني. Source:{" "}
        <a
          href={LIBRARY_SOURCE_PAGE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          ellibrary.moe.gov.eg
          <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
