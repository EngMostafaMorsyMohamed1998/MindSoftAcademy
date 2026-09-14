import type { Chapter } from "@/lib/curriculum";
import type { LessonNote } from "@/lib/lessons";
import type { Locale } from "@/lib/locale";

export function BookletDoc({
  locale,
  chapters,
  notes,
  teacher,
  brand,
}: {
  locale: Locale;
  chapters: Chapter[];
  notes: LessonNote[];
  teacher: string;
  brand: string;
}) {
  return (
    <div className="print-sheet space-y-8 rounded-3xl bg-white p-6 ring-1 ring-primary/10 sm:p-8">
      <header className="border-b border-primary/15 pb-4">
        <p className="text-xs font-semibold tracking-wide text-primary/60">{brand}</p>
        <h2 className="mt-1 font-serif text-2xl">
          {locale === "ar" ? "ملزمة الطالب — البرمجة والذكاء الاصطناعي" : "Student booklet — Programming & AI"}
        </h2>
        <p className="mt-1 text-sm text-foreground/65">
          {teacher} · 2026–2027 · 2Bac
        </p>
        <p className="mt-3 text-sm">
          {locale === "ar" ? "الاسم: ________________    الرقم: ________________    الحصة: ______" : "Name: ________________    Phone: ________________    Class: ______"}
        </p>
      </header>

      {chapters.map((chapter) => {
        const chapterNotes = notes.filter((note) => note.chapterId === chapter.id);
        return (
          <section key={chapter.id} className="print-break border-t border-primary/10 pt-6">
            <h3 className="text-xl font-semibold">
              {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
            </h3>
            <p className="mt-1 text-sm text-foreground/65">
              {locale === "ar" ? chapter.blurbAr : chapter.blurbEn}
            </p>
            {chapterNotes.map((note) => {
              const lesson = chapter.lessons.find((item) => item.id === note.id);
              const body = locale === "ar" ? note.bodyAr : note.bodyEn;
              const terms = locale === "ar" ? note.termsAr : note.termsEn;
              return (
                <article key={note.id} className="mt-5">
                  <h4 className="font-semibold">
                    {note.id} {locale === "ar" ? lesson?.titleAr : lesson?.titleEn}
                  </h4>
                  <ul className="mt-2 list-disc space-y-1 ps-5 text-sm">
                    {body.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary/60">
                    {locale === "ar" ? "مصطلحات" : "Key terms"}
                  </p>
                  <ul className="mt-1 text-sm">
                    {terms.map((term) => (
                      <li key={term.term}>
                        <strong>{term.term}:</strong> {term.meaning}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm">
                    <strong>{locale === "ar" ? "الخلاصة:" : "Takeaway:"}</strong>{" "}
                    {locale === "ar" ? note.takeawayAr : note.takeawayEn}
                  </p>
                </article>
              );
            })}
            <div className="mt-5 rounded-xl border border-dashed border-primary/25 p-4">
              <p className="text-sm font-semibold">
                {locale === "ar" ? "مساحة حل الحصة / الواجب" : "Class / homework space"}
              </p>
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
  );
}
