import Link from "next/link";
import { Lock } from "lucide-react";
import type { Chapter, ChapterId } from "@/lib/curriculum";
import { isChapterUnlocked } from "@/lib/chapter-progress";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function QuestMap({
  locale,
  chapters,
  completed,
  unlocks = [],
}: {
  locale: Locale;
  chapters: Chapter[];
  completed: ChapterId[];
  unlocks?: string[];
}) {
  return (
    <ol className="mt-6 grid gap-3 sm:grid-cols-2">
      {chapters.map((chapter, index) => {
        const unlocked = isChapterUnlocked(completed, chapter.id, unlocks);
        const inner = (
          <>
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: chapter.accent, color: chapter.color }}
            >
              {unlocked ? index + 1 : <Lock className="size-3.5" />}
            </span>
            <span>
              <span className="block font-semibold">
                {locale === "ar" ? chapter.titleAr : chapter.titleEn}
              </span>
              <span className="mt-1 block text-xs text-white/75">
                {unlocked
                  ? locale === "ar"
                    ? chapter.gameAr
                    : chapter.gameEn
                  : t(locale, "chapterLockedHint")}
              </span>
            </span>
          </>
        );
        return (
          <li key={chapter.id}>
            {unlocked ? (
              <Link
                href={`/dashboard/chapters/${chapter.id}`}
                className="flex gap-3 rounded-2xl p-4 text-white transition hover:scale-[1.01]"
                style={{ background: chapter.color }}
              >
                {inner}
              </Link>
            ) : (
              <div
                className="flex gap-3 rounded-2xl p-4 text-white opacity-70"
                style={{ background: chapter.color }}
              >
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
