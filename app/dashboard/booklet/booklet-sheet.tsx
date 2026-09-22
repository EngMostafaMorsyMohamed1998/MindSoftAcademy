import { PrintButton } from "@/components/print-button";
import { BRAND } from "@/lib/brand";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import { LESSON_NOTES } from "@/lib/lessons";
import type { Locale } from "@/lib/locale";

export function BookletSheet({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">{t(locale, "bookletTitle")}</h1>
          <p className="mt-2 text-sm text-foreground/65">{t(locale, "bookletLead")}</p>
        </div>
        <PrintButton label={t(locale, "printNow")} />
      </div>
      <div className="print-sheet space-y-8 rounded-3xl bg-white p-6 text-foreground ring-1 ring-primary/10 sm:p-8">
        <header className="border-b border-primary/15 pb-4">
          <p className="text-xs font-semibold tracking-wide text-primary/60">{ar ? BRAND.nameAr : BRAND.nameEn}</p>
          <h2 className="mt-1 font-serif text-2xl">
            {ar ? "ملزمة الطالب — البرمجة والذكاء الاصطناعي" : "Student booklet — Programming & AI"}
          </h2>
          <p className="mt-1 text-sm text-foreground/65">
            {ar ? BRAND.teacherAr : BRAND.teacherEn} · {BRAND.year} · 2Bac
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {(ar ? ["الاسم", "الرقم", "الحصة"] : ["Name", "Phone", "Class"]).map((label) => (
              <p key={label} className="text-sm">
                <span className="font-semibold">{label}</span>
                <span className="mt-2 block h-7 border-b border-primary/30" />
              </p>
            ))}
          </div>
        </header>

        {CHAPTERS.map((chapter) => {
          const notes = LESSON_NOTES.filter((note) => note.chapterId === chapter.id);
          return (
            <section key={chapter.id} className="print-break border-t border-primary/10 pt-6">
              <h3 className="text-xl font-semibold">
                {chapter.id}. {ar ? chapter.titleAr : chapter.titleEn}
              </h3>
              <p className="mt-1 text-sm text-foreground/65">{ar ? chapter.blurbAr : chapter.blurbEn}</p>
              {notes.map((note) => {
                const lesson = chapter.lessons.find((item) => item.id === note.id);
                const body = ar ? note.bodyAr : note.bodyEn;
                const terms = ar ? note.termsAr : note.termsEn;
                return (
                  <article key={note.id} className="mt-5">
                    <h4 className="font-semibold leading-8">
                      <span dir="ltr" className="me-1 inline-block">{note.id}</span>
                      {ar ? lesson?.titleAr : lesson?.titleEn}
                    </h4>
                    <ul className="mt-2 list-disc space-y-2 ps-5 text-sm leading-7">
                      {body.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary/60">
                      {ar ? "مصطلحات" : "Key terms"}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm leading-7">
                      {terms.map((term) => (
                        <li key={term.term}>
                          <strong>{term.term}:</strong> {term.meaning}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm leading-7">
                      <strong>{ar ? "الخلاصة:" : "Takeaway:"}</strong> {ar ? note.takeawayAr : note.takeawayEn}
                    </p>
                  </article>
                );
              })}
              <div className="mt-5 rounded-xl border border-dashed border-primary/25 p-4">
                <p className="text-sm font-semibold">{ar ? "مساحة حل الحصة / الواجب" : "Class / homework space"}</p>
                <div className="mt-3 space-y-5 text-foreground/25">
                  <p>________________________________________________________________</p>
                  <p>________________________________________________________________</p>
                  <p>________________________________________________________________</p>
                  <p>________________________________________________________________</p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
