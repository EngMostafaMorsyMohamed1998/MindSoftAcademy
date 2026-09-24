import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import type { Book } from "@/lib/library";
import { bookSrc } from "@/lib/library";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { AiTutorChat } from "./ai-tutor-chat";

export function BookViewer({
  book,
  locale,
  backHref,
  backLabel,
  page,
}: {
  book: Book;
  locale: Locale;
  backHref: string;
  backLabel: string;
  page?: number;
}) {
  const ar = locale === "ar";
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
          {book.kind === "workbook" ? t(locale, "navFaiz") : t(locale, "officialCopy")} ·{" "}
          {book.language === "ar" ? "العربية" : "English"} · {t(locale, "bookPart")} {book.part}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1
            className="font-serif text-2xl tracking-tight sm:text-3xl"
            dir={book.language === "ar" ? "rtl" : "ltr"}
          >
            {ar ? book.title : book.titleEn}
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            {book.sizeMb} MB
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={bookSrc(book)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border-2 border-primary/20 bg-white px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 dark:bg-surface"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            {ar ? "فتح في نافذة كاملة" : "Open in full view"}
          </a>
          <a
            href={bookSrc(book)}
            download
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-muted"
          >
            <Download className="size-4" aria-hidden="true" />
            {t(locale, "downloadPdf")}
          </a>
          {book.kind === "workbook" ? null : (
            <a
              href={book.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-primary/15 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              {t(locale, "officialCopy")}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {book.sizeMb > 20 ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-3 text-xs text-foreground/80">
          <span>
            {ar
              ? "ملف الكتاب كبير الحجم (60+ ميجا). لو المتصفح أظهر مساحة بيضاء، اضغط على «فتح في نافذة كاملة» لتصفحه مباشرة بسلاسة."
              : "Large book file (60+ MB). If your browser shows a blank frame, click 'Open in full view' above to view it natively."}
          </span>
          <a
            href={bookSrc(book)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-semibold text-primary underline hover:opacity-80"
          >
            {ar ? "عرض فوري" : "Open now"}
          </a>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(19rem,3fr)]">
        <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm shadow-primary/5" dir="ltr">
          <object
            data={page ? `${bookSrc(book)}#page=${page}` : bookSrc(book)}
            type="application/pdf"
            className="h-[75vh] w-full min-h-125 bg-white"
          >
            <iframe
              src={page ? `${bookSrc(book)}#page=${page}` : bookSrc(book)}
              title={book.titleEn}
              className="h-[75vh] w-full min-h-125 bg-white"
            />
          </object>
        </div>
        <AiTutorChat book={book} locale={locale} />
      </div>

      <p className="mt-4 text-xs text-foreground/50">{t(locale, "bookViewerBlank")}</p>
    </div>
  );
}
