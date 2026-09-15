import Link from "next/link";
import { Lock } from "lucide-react";
import { StudyProgress } from "@/components/study-progress";
import { isChapterUnlocked, studentProgress } from "@/lib/chapter-progress";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function ChaptersPage() {
  const locale = await getLocale();
  const { completed, unlocks } = await studentProgress();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-serif text-3xl">{t(locale, "navChapters")}</h1>
      <p className="mt-2 text-sm text-foreground/65">{t(locale, "dashboardHint")}</p>
      <div className="mt-5 rounded-3xl border border-primary/8 bg-white p-5">
        <StudyProgress locale={locale} completed={completed} />
      </div>
      <div className="mt-6 grid gap-4">
        {CHAPTERS.map((chapter) => {
          const unlocked = isChapterUnlocked(completed, chapter.id, unlocks);
          return (
            <article
              key={chapter.id}
              className={`rounded-3xl border bg-white p-5 shadow-sm ${
                unlocked ? "border-primary/8" : "border-primary/8 opacity-70"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-primary/60">
                    {chapter.part === 1 ? t(locale, "part1") : t(locale, "part2")}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-foreground/65">
                    {locale === "ar" ? chapter.blurbAr : chapter.blurbEn}
                  </p>
                  {!unlocked ? (
                    <p className="mt-2 text-xs font-medium text-primary/70">
                      {t(locale, "chapterLockedHint")}
                    </p>
                  ) : null}
                </div>
                {unlocked ? (
                  <Link
                    href={`/dashboard/chapters/${chapter.id}`}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    {t(locale, "continueStudy")}
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-4 py-2 text-sm font-semibold text-primary/70">
                    <Lock className="size-3.5" />
                    {t(locale, "chapterLocked")}
                  </span>
                )}
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {chapter.lessons.map((lesson) => (
                  <li key={lesson.id} className="rounded-xl bg-primary/4 px-3 py-2 text-sm">
                    {lesson.id} · {locale === "ar" ? lesson.titleAr : lesson.titleEn}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
