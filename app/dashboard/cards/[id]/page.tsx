import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isChapterUnlocked } from "@/lib/chapter-progress";
import { getLesson, isChapterId } from "@/lib/curriculum";
import { bookletSafe } from "@/lib/booklet-lang";
import { t } from "@/lib/i18n";
import { notesForLesson } from "@/lib/lessons";
import { getLocale } from "@/lib/locale";
import { studentProgress } from "@/lib/student-progress";
import { FlashCards } from "./flash-cards";

export default async function CardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson || !isChapterId(lesson.chapterId)) notFound();
  const { completed, unlocks } = await studentProgress();
  if (!isChapterUnlocked(completed, lesson.chapterId, unlocks)) {
    redirect("/dashboard/chapters");
  }
  const locale = await getLocale();
  const note = notesForLesson(lesson.id);
  const cards = note
    ? (locale === "ar" ? note.termsAr : note.termsEn).map((term) => ({
        term: bookletSafe(locale, term.term),
        meaning: bookletSafe(locale, term.meaning),
      }))
    : [];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href={`/dashboard/chapters/${lesson.chapterId}`} className="text-sm font-medium text-primary">
        {t(locale, "back")}
      </Link>
      <h1 className="mt-3 font-serif text-3xl">{t(locale, "flashcards")}</h1>
      <p className="mt-1 text-sm text-foreground/65">
        {lesson.id} · {locale === "ar" ? lesson.titleAr : lesson.titleEn}
      </p>
      <FlashCards locale={locale} cards={cards} />
    </div>
  );
}
