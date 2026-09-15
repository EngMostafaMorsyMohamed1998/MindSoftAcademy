import Link from "next/link";
import { Lock } from "lucide-react";
import { isChapterUnlocked } from "@/lib/chapter-progress";
import { studentProgress } from "@/lib/student-progress";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function GamesPage() {
  const locale = await getLocale();
  const { completed, unlocks } = await studentProgress();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-serif text-3xl">{t(locale, "navGames")}</h1>
      <p className="mt-2 text-sm text-foreground/65">{t(locale, "featGameD")}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {CHAPTERS.map((chapter) => {
          const unlocked = isChapterUnlocked(completed, chapter.id, unlocks);
          if (!unlocked) {
            return (
              <li key={chapter.id}>
                <div
                  className="block rounded-3xl p-5 text-white opacity-70"
                  style={{ background: chapter.color }}
                >
                  <p className="text-xs text-white/60">{chapter.id}</p>
                  <h2 className="mt-1 flex items-center gap-2 text-lg font-semibold">
                    <Lock className="size-4" />
                    {locale === "ar" ? chapter.gameAr : chapter.gameEn}
                  </h2>
                  <p className="mt-2 text-sm text-white/70">{t(locale, "chapterLockedHint")}</p>
                </div>
              </li>
            );
          }
          return (
            <li key={chapter.id}>
              <Link
                href={`/dashboard/games/${chapter.id}`}
                className="block rounded-3xl p-5 text-white"
                style={{ background: chapter.color }}
              >
                <p className="text-xs text-white/60">{chapter.id}</p>
                <h2 className="mt-1 text-lg font-semibold">
                  {locale === "ar" ? chapter.gameAr : chapter.gameEn}
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
