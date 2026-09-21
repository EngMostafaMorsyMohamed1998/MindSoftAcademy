import { BookletAssessPane, BookletFaizHomeworkPane, BookletFaizUnitPane, BookletHomeworkPane, BookletLessonPane } from "./booklet-doc";
import { BookletViewer } from "./booklet-viewer";
import { assessScope, part1LessonIds } from "@/lib/assessments";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { CHAPTERS } from "@/lib/curriculum";
import { FAIZ_UNITS } from "@/lib/faiz";

export const dynamic = "force-dynamic";

export default async function BookletPage() {
  const locale = await getLocale();

  return (
    <div className="booklet-paper mx-auto w-full max-w-5xl" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="no-print mb-5">
        <h1 className="font-serif text-3xl">{t(locale, "bookletTitle")}</h1>
        <p className="mt-2 text-sm text-foreground/65">{t(locale, "bookletLead")}</p>
      </div>
      <BookletViewer
        locale={locale}
        printLabel={t(locale, "printNow")}
        downloadLabel={t(locale, "downloadBooklet")}
        downloadingLabel={t(locale, "downloadingBooklet")}
        groups={[
          ...CHAPTERS.map((chapter) => ({
            id: chapter.id,
            labelAr: `الفصل ${chapter.id}`,
            labelEn: `Ch. ${chapter.id}`,
            lessons: [
              ...chapter.lessons.map((lesson) => ({
                id: lesson.id,
                labelAr: `الدرس ${lesson.id}`,
                labelEn: `Lesson ${lesson.id}`,
                body: <BookletLessonPane locale={locale} lessonId={lesson.id} />,
              })),
              {
                id: `hw-${chapter.id}`,
                labelAr: "الواجب",
                labelEn: "Homework",
                body: <BookletHomeworkPane locale={locale} chapterId={chapter.id} />,
              },
            ],
          })),
          ...(locale === "ar"
            ? [
                {
                  id: "assess",
                  labelAr: "الأداءات والتقييمات",
                  labelEn: "Assessments",
                  lessons: part1LessonIds().map((lessonId) => ({
                    id: assessScope(lessonId),
                    labelAr: `الدرس ${lessonId}`,
                    labelEn: `Lesson ${lessonId}`,
                    body: <BookletAssessPane lessonId={lessonId} />,
                  })),
                },
                {
                  id: "faiz",
                  labelAr: "الفائز",
                  labelEn: "Al-Faiz",
                  lessons: [
                    ...FAIZ_UNITS.map((unit) => ({
                      id: unit.id,
                      labelAr: unit.titleAr,
                      labelEn: unit.titleEn,
                      body: <BookletFaizUnitPane locale={locale} unitId={unit.id} />,
                    })),
                    {
                      id: "faiz-hw",
                      labelAr: "واجب الفائز",
                      labelEn: "Al-Faiz homework",
                      body: <BookletFaizHomeworkPane locale={locale} />,
                    },
                  ],
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}
