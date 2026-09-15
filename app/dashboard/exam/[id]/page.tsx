import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { nextChapterId, isChapterUnlocked, studentCompletedChapters } from "@/lib/chapter-progress";
import { getChapter, isChapterId } from "@/lib/curriculum";
import { examForChapter } from "@/lib/exams";
import { t } from "@/lib/i18n";
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
  const completed = await studentCompletedChapters();
  if (!isChapterUnlocked(completed, id)) {
    redirect("/dashboard/exams");
  }
  const locale = await getLocale();
  const nextId = nextChapterId(id);

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
      />
    </div>
  );
}
