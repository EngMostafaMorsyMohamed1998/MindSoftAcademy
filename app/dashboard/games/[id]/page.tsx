import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isChapterUnlocked } from "@/lib/chapter-progress";
import { studentProgress } from "@/lib/student-progress";
import { getChapter } from "@/lib/curriculum";
import { getGame } from "@/lib/games";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { GamePlayer } from "./game-player";

export default async function ChapterGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();
  const chapter = getChapter(game.chapterId);
  if (!chapter) notFound();
  const { completed, unlocks } = await studentProgress();
  if (!isChapterUnlocked(completed, game.chapterId, unlocks)) {
    redirect("/dashboard/games");
  }
  const locale = await getLocale();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link href="/dashboard/games" className="text-sm font-medium text-primary">
        {t(locale, "back")}
      </Link>
      <h1 className="mt-3 font-serif text-3xl">
        {locale === "ar" ? game.titleAr : game.titleEn}
      </h1>
      <p className="mt-1 text-sm text-foreground/65">
        {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
      </p>
      <GamePlayer locale={locale} game={game} />
    </div>
  );
}
