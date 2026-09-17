import Link from "next/link";
import { BookOpen, ClipboardCheck, Lock } from "lucide-react";
import { getExamWindow } from "@/lib/access-store";
import { examWindowOpen } from "@/lib/class-clock";
import { FAIZ_BOOK, FAIZ_PAPER_ID, FAIZ_UNITS } from "@/lib/faiz";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function FaizTrackPage() {
  const locale = await getLocale();
  const examWindow = await getExamWindow();
  const open = examWindowOpen(examWindow, FAIZ_PAPER_ID);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-serif text-3xl">{t(locale, "faizTitle")}</h1>
      <p className="mt-2 text-sm text-foreground/65">{t(locale, "faizLead")}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href={`/dashboard/courses/${FAIZ_BOOK.slug}`}
          className="rounded-3xl bg-white p-5 ring-1 ring-primary/10"
        >
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
            <BookOpen className="size-4" />
            {t(locale, "booksWorkbook")}
          </p>
          <h2 className="mt-2 text-lg font-semibold">{t(locale, "openFaizBook")}</h2>
          <p className="mt-1 text-xs text-foreground/50">
            {locale === "ar" ? FAIZ_BOOK.title : FAIZ_BOOK.titleEn} · {FAIZ_BOOK.sizeMb} MB
          </p>
        </Link>
        {open ? (
          <Link
            href={`/dashboard/exam/${FAIZ_PAPER_ID}`}
            className="rounded-3xl bg-accent/20 p-5 ring-1 ring-accent"
          >
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
              <ClipboardCheck className="size-4" />
              {t(locale, "faizExam")}
            </p>
            <h2 className="mt-2 text-lg font-semibold">{t(locale, "startExam")}</h2>
            <p className="mt-1 text-xs text-foreground/55">{t(locale, "faizExamHint")}</p>
          </Link>
        ) : (
          <div className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/50">
              <Lock className="size-4" />
              {t(locale, "faizExam")}
            </p>
            <h2 className="mt-2 text-lg font-semibold">{t(locale, "examWindowClosed")}</h2>
            <p className="mt-1 text-xs text-foreground/55">{t(locale, "faizExamHint")}</p>
          </div>
        )}
      </div>

      <section className="mt-8 rounded-3xl bg-white p-5 ring-1 ring-primary/10">
        <h2 className="text-lg font-semibold">{t(locale, "faizUnits")}</h2>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {FAIZ_UNITS.map((unit, index) => (
            <li key={unit.id} className="rounded-2xl bg-primary/5 px-3 py-2 text-sm">
              <span className="font-semibold text-primary">{index + 1}.</span>{" "}
              {locale === "ar" ? unit.titleAr : unit.titleEn}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
