import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import type { Book } from "@/lib/library";
import { bookSrc } from "@/lib/library";
import { AiTutorChat } from "./ai-tutor-chat";

export function BookViewer({
  book,
  backHref,
  backLabel,
  page,
}: {
  book: Book;
  backHref: string;
  backLabel: string;
  page?: number;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {backLabel}
        </Link>
        <span className="inline-flex items-center rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary">
          {book.kind === "workbook" ? "Al-Faiz" : "Official copy"} ·{" "}
          {book.language === "ar" ? "العربية" : "English"} · Part {book.part}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1
            className="font-serif text-2xl tracking-tight sm:text-3xl"
            dir="rtl"
          >
            {book.title}
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            {book.titleEn} · {book.sizeMb} MB
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={bookSrc(book)}
            download
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-muted"
          >
            <Download className="size-4" aria-hidden="true" />
            Download PDF
          </a>
          {book.kind === "workbook" ? null : (
            <a
              href={book.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-primary/15 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Official copy
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(19rem,3fr)]">
        <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm shadow-primary/5" dir="ltr">
          <iframe
            src={page ? `${bookSrc(book)}#page=${page}` : bookSrc(book)}
            title={book.titleEn}
            className="h-[75vh] w-full min-h-125 bg-white"
          />
        </div>
        <AiTutorChat book={book} />
      </div>

      <p className="mt-4 text-xs text-foreground/50">
        If the viewer stays blank, your browser may block inline PDFs — use
        Download or the official copy instead.
      </p>
    </div>
  );
}
