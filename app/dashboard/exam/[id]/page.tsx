import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  chapterHomeworkDone,
  isChapterUnlocked,
  nextChapterId,
} from "@/lib/chapter-progress";
import { studentProgress } from "@/lib/student-progress";
import { getChapter, isChapterId } from "@/lib/curriculum";
import { getExamWindow } from "@/lib/access-store";
import { examWindowOpen, remainingExamSeconds } from "@/lib/class-clock";
import { examForChapter, examPaperSeed } from "@/lib/exams";
import { t } from "@/lib/i18n";
import { notesForChapter } from "@/lib/lessons";
import { getLocale } from "@/lib/locale";
import { ChapterExamPlayer } from "./exam-player";

export default async function ChapterExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mixed = id === "mix";
  if (!mixed && !isChapterId(id)) notFound();
  const chapter = mixed ? null : getChapter(id);
  const examWindow = await getExamWindow();
  const exam = examForChapter(id, examPaperSeed(id, examWindow?.opensAt));
  if (!exam || (!mixed && !chapter)) notFound();
  const locale = await getLocale();
  const nextId = mixed || !isChapterId(id) ? null : nextChapterId(id);
  const note = mixed || !isChapterId(id) ? undefined : notesForChapter(id)[0];
  const lessonHint = note ? (locale === "ar" ? note.takeawayAr : note.takeawayEn) : "";
  const windowOpen = examWindowOpen(examWindow, id);
  const durationSeconds = remainingExamSeconds(examWindow, id);
  if (!windowOpen) {
    if (mixed) redirect("/dashboard/exams");
    if (!isChapterId(id)) redirect("/dashboard/exams");
    const { completed, unlocks, homework } = await studentProgress();
    if (!isChapterUnlocked(completed, id, unlocks) || !chapterHomeworkDone(id, homework)) {
      redirect("/dashboard/exams");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href="/dashboard/exams" className="text-sm font-medium text-primary">
        {t(locale, "back")}
      </Link>
      <h1 className="mt-3 font-serif text-3xl">{mixed ? t(locale, "mixedMock") : t(locale, "chapterExam")}</h1>
      <p className="mt-1 text-sm text-foreground/65">
        {mixed
          ? t(locale, "mixedMockHint")
          : `${chapter?.id}. ${locale === "ar" ? chapter?.titleAr : chapter?.titleEn}`}
      </p>
      {windowOpen ? (
        <ChapterExamPlayer
          locale={locale}
          exam={exam}
          nextHref={mixed ? "/dashboard" : nextId ? `/dashboard/chapters/${nextId}` : "/dashboard/chapters"}
          nextLabel={mixed ? t(locale, "navHome") : nextId ? t(locale, "nextChapter") : t(locale, "navChapters")}
          lessonHint={lessonHint}
          durationSeconds={durationSeconds}
          closesAt={examWindow?.closesAt}
          mode={mixed ? "ministry" : (examWindow?.mode ?? "class")}
        />
      ) : (
        <p className="mt-6 rounded-3xl bg-white p-5 text-sm text-foreground/70 ring-1 ring-primary/10">
          {t(locale, "examWindowClosed")}
        </p>
      )}
    </div>
  );
}
