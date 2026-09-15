import Link from "next/link";
import { Lock } from "lucide-react";
import { getExamWindow } from "@/lib/access-store";
import { chapterHomeworkDone, isChapterUnlocked } from "@/lib/chapter-progress";
import { examWindowOpen } from "@/lib/class-clock";
import { studentProgress } from "@/lib/student-progress";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function ExamsIndexPage() {
  const locale = await getLocale();
  const [{ completed, unlocks, homework }, examWindow] = await Promise.all([
    studentProgress(),
    getExamWindow(),
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-serif text-3xl">{t(locale, "navExams")}</h1>
      <p className="mt-2 text-sm text-foreground/65">{t(locale, "examWindowHint")}</p>
      <ul className="mt-6 space-y-3">
        {CHAPTERS.map((chapter) => {
          const open = examWindowOpen(examWindow, chapter.id);
          const ready =
            isChapterUnlocked(completed, chapter.id, unlocks) &&
            chapterHomeworkDone(chapter.id, homework);
          return (
            <li key={chapter.id}>
              {open ? (
                <Link
                  href={`/dashboard/exam/${chapter.id}`}
                  className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-primary/10"
                >
                  <span>
                    <span className="block font-semibold">
                      {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                    </span>
                    <span className="text-xs text-foreground/55">
                      {t(locale, "minutes30")} · 50% {t(locale, "objective")} · 50% {t(locale, "essay")}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-primary">{t(locale, "startExam")}</span>
                </Link>
              ) : (
                <div className="flex items-center justify-between rounded-2xl bg-white/80 p-4 ring-1 ring-primary/10 opacity-70">
                  <span>
                    <span className="block font-semibold">
                      {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                    </span>
                    <span className="text-xs text-foreground/55">
                      {ready ? t(locale, "examWindowClosed") : t(locale, "chapterLockedHint")}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary/60">
                    <Lock className="size-3.5" />
                    {t(locale, "chapterLocked")}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
