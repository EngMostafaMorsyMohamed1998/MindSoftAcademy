import { BookletAnswersPane, BookletAssessPane, BookletFaizPane, BookletPartPane } from "./booklet-doc";
import { BookletViewer } from "./booklet-viewer";
import { assessLessonIds } from "@/lib/assessments-bank";
import { BRAND } from "@/lib/brand";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function BookletCatalog({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <div className="booklet-paper mx-auto w-full max-w-5xl" lang={locale} dir={ar ? "rtl" : "ltr"}>
      <div className="no-print mb-5">
        <h1 className="font-serif text-3xl">{t(locale, "bookletTitle")}</h1>
        <p className="mt-2 text-sm text-foreground/65">{t(locale, "bookletLead")}</p>
      </div>

      <header className="print-keep mb-6 rounded-2xl bg-white p-6 ring-1 ring-primary/10 sm:p-8">
        <p className="text-xs font-semibold tracking-wide text-primary/60">{ar ? BRAND.nameAr : BRAND.nameEn}</p>
        <h2 className="mt-1 font-serif text-3xl">{ar ? "ملزمة الطالب" : "Student booklet"}</h2>
        <p className="mt-1 text-sm text-foreground/65">
          {ar ? BRAND.teacherAr : BRAND.teacherEn} · {BRAND.year} · 2Bac
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {(ar ? ["الاسم", "رقم التليفون", "المجموعة"] : ["Name", "Phone", "Group"]).map((label) => (
            <p key={label} className="text-sm">
              <span className="font-semibold">{label}</span>
              <span className="mt-2 block h-8 border-b border-primary/30" />
            </p>
          ))}
        </div>
        <ol className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
          {CHAPTERS.map((chapter) => (
            <li
              key={chapter.id}
              className="rounded-xl px-3 py-2 font-semibold text-white"
              style={{ background: chapter.color }}
            >
              <span dir="ltr" className="me-1 inline-block">{chapter.id}.</span>
              {ar ? chapter.titleAr : chapter.titleEn}
            </li>
          ))}
          {ar ? <li className="rounded-xl bg-primary px-3 py-2 font-semibold text-white">كتاب الفائز + واجبه</li> : null}
        </ol>
      </header>

      <BookletViewer
        locale={locale}
        printLabel={t(locale, "printNow")}
        tabs={[
          {
            id: "p1",
            labelAr: "الجزء الأول",
            labelEn: "Part 1",
            body: <BookletPartPane locale={locale} part={1} />,
          },
          {
            id: "p2",
            labelAr: "الجزء الثاني",
            labelEn: "Part 2",
            body: <BookletPartPane locale={locale} part={2} />,
          },
          ...(ar
            ? [
                {
                  id: "faiz",
                  labelAr: "الفائز",
                  labelEn: "Al-Faiz",
                  body: <BookletFaizPane locale={locale} />,
                },
              ]
            : []),
          {
            id: "assess",
            labelAr: "الأداءات",
            labelEn: "Assessments",
            body: (
              <>
                {assessLessonIds().map((lessonId) => (
                  <BookletAssessPane key={lessonId} locale={locale} lessonId={lessonId} />
                ))}
              </>
            ),
          },
          {
            id: "key",
            labelAr: "الإجابات",
            labelEn: "Answers",
            body: <BookletAnswersPane locale={locale} />,
          },
        ]}
      />
    </div>
  );
}
