import Link from "next/link";
import { Lock } from "lucide-react";
import { isChapterUnlocked } from "@/lib/chapter-progress";
import { studentProgress } from "@/lib/student-progress";
import { getChapter } from "@/lib/curriculum";
import { CHAPTER_GAMES } from "@/lib/games";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function GamesPage() {
  const locale = await getLocale();
  const { completed, unlocks } = await studentProgress();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-serif text-3xl">{t(locale, "navGames")}</h1>
      <p className="mt-2 text-sm text-foreground/65">{t(locale, "featGameD")}</p>
      <Link
        href="/dashboard/arena"
        className="mt-6 block overflow-hidden rounded-3xl bg-primary-dark p-6 text-white"
      >
        <p className="text-xs font-semibold tracking-wide text-accent">3D</p>
        <h2 className="mt-1 font-serif text-2xl">{t(locale, "arenaTitle")}</h2>
        <p className="mt-2 text-sm text-white/70">{t(locale, "arenaLead")}</p>
        <p className="mt-4 text-sm font-semibold text-accent">{t(locale, "arenaStart")}</p>
      </Link>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {[...CHAPTER_GAMES]
          .sort((a, b) => a.chapterId.localeCompare(b.chapterId) || a.id.localeCompare(b.id))
          .map((game) => {
          const chapter = getChapter(game.chapterId);
          const unlocked = isChapterUnlocked(completed, game.chapterId, unlocks);
          const color = chapter?.color ?? "#0c2d6b";
          if (!unlocked) {
            return (
              <li key={game.id}>
                <div
                  className="block rounded-3xl p-5 text-white opacity-70"
                  style={{ background: color }}
                >
                  <p className="text-xs text-white/60">{game.chapterId}</p>
                  <h2 className="mt-1 flex items-center gap-2 text-lg font-semibold">
                    <Lock className="size-4" />
                    {locale === "ar" ? game.titleAr : game.titleEn}
                  </h2>
                  <p className="mt-2 text-sm text-white/70">{t(locale, "chapterLockedHint")}</p>
                </div>
              </li>
            );
          }
          return (
            <li key={game.id}>
              <Link
                href={`/dashboard/games/${game.id}`}
                className="block rounded-3xl p-5 text-white"
                style={{ background: color }}
              >
                <p className="text-xs text-white/60">{game.chapterId}</p>
                <h2 className="mt-1 text-lg font-semibold">
                  {locale === "ar" ? game.titleAr : game.titleEn}
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  {chapter
                    ? locale === "ar"
                      ? chapter.titleAr
                      : chapter.titleEn
                    : ""}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
