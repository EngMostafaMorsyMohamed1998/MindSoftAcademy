import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  chapterHomeworkDone,
  isChapterUnlocked,
  nextChapterId,
  studentProgress,
} from "@/lib/chapter-progress";
import { getChapter, isChapterId } from "@/lib/curriculum";
import { examForChapter } from "@/lib/exams";
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
  if (!isChapterId(id)) notFound();
  const chapter = getChapter(id);
  const exam = examForChapter(id);
  if (!chapter || !exam) notFound();
  const { completed, unlocks, homework } = await studentProgress();
  if (!isChapterUnlocked(completed, id, unlocks) || !chapterHomeworkDone(id, homework)) {
    redirect("/dashboard/exams");
  }
  const locale = await getLocale();
  const nextId = nextChapterId(id);
  const note = notesForChapter(id)[0];
  const lessonHint = note ? (locale === "ar" ? note.takeawayAr : note.takeawayEn) : "";

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href="/dashboard/exams" className="text-sm font-medium text-primary">
        {t(locale, "back")}
      </Link>
      <h1 className="mt-3 font-serif text-3xl">{t(locale, "chapterExam")}</h1>
      <p className="mt-1 text-sm text-foreground/65">
        {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
      </p>
      <ChapterExamPlayer
        locale={locale}
        exam={exam}
        nextHref={nextId ? `/dashboard/chapters/${nextId}` : "/dashboard/chapters"}
        nextLabel={nextId ? t(locale, "nextChapter") : t(locale, "navChapters")}
        lessonHint={lessonHint}
      />
    </div>
  );
}
