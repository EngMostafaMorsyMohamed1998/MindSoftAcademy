import Link from "next/link";
import { Lock } from "lucide-react";
import { getExamWindow } from "@/lib/access-store";
import { chapterHomeworkDone, isChapterUnlocked } from "@/lib/chapter-progress";
import { examWindowOpen } from "@/lib/class-clock";
import { studentProgress } from "@/lib/student-progress";
import { CHAPTERS } from "@/lib/curriculum";
import { FAIZ_PAPER_ID } from "@/lib/faiz";
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
      <p className="mt-2 text-sm text-foreground/65">{t(locale, "examStudentLead")}</p>
      <ul className="mt-6 space-y-3">
        {locale === "ar" && examWindowOpen(examWindow, FAIZ_PAPER_ID) ? (
          <li>
            <Link
              href={`/dashboard/exam/${FAIZ_PAPER_ID}`}
              className="flex items-center justify-between rounded-2xl bg-white p-4 ring-2 ring-primary"
            >
              <span>
                <span className="block font-semibold">{t(locale, "faizExam")}</span>
                <span className="text-xs text-foreground/55">{t(locale, "faizExamHint")}</span>
              </span>
              <span className="text-sm font-semibold text-primary">{t(locale, "startExam")}</span>
            </Link>
          </li>
        ) : null}
        {examWindowOpen(examWindow, "mix") ? (
          <li>
            <Link
              href="/dashboard/exam/mix"
              className="flex items-center justify-between rounded-2xl bg-accent/20 p-4 ring-1 ring-accent"
            >
              <span>
                <span className="block font-semibold">{t(locale, "mixedMock")}</span>
                <span className="text-xs text-foreground/55">{t(locale, "mixedMockHint")}</span>
              </span>
              <span className="text-sm font-semibold text-primary">{t(locale, "startExam")}</span>
            </Link>
          </li>
        ) : null}
        {CHAPTERS.map((chapter) => {
          const open = examWindowOpen(examWindow, chapter.id);
          const unlocked = isChapterUnlocked(completed, chapter.id, unlocks);
          const homeworkDone = chapterHomeworkDone(chapter.id, homework);
          const lockHint = !unlocked
            ? t(locale, "chapterLockedHint")
            : !homeworkDone
              ? t(locale, "homeworkLockedExam")
              : t(locale, "examWindowClosed");
          return (
            <li key={chapter.id}>
              {open ? (
                <Link
                  href={`/dashboard/exam/${chapter.id}`}
                  className="flex items-center justify-between rounded-2xl bg-surface p-4 ring-1 ring-primary/15"
                >
                  <span>
                    <span className="block font-semibold">
                      {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                    </span>
                    <span className="text-xs text-foreground/55">
                      {examWindow?.mode === "ministry"
                        ? t(locale, "ministryExamHint")
                        : `${t(locale, "examSize")} · ${t(locale, "examObjectiveCount")} · ${t(locale, "examEssayCount")}`}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-primary">{t(locale, "startExam")}</span>
                </Link>
              ) : (
                <div className="flex items-center justify-between rounded-2xl bg-surface/70 p-4 ring-1 ring-primary/10">
                  <span>
                    <span className="block font-semibold text-foreground/80">
                      {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                    </span>
                    <span className="text-xs text-foreground/50">
                      {lockHint}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground/45">
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
