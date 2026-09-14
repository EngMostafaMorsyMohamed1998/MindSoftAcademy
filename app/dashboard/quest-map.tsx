import Link from "next/link";
import type { Chapter } from "@/lib/curriculum";
import type { Locale } from "@/lib/locale";

export function QuestMap({
  locale,
  chapters,
}: {
  locale: Locale;
  chapters: Chapter[];
}) {
  return (
    <ol className="mt-6 grid gap-3 sm:grid-cols-2">
      {chapters.map((chapter, index) => (
        <li key={chapter.id}>
          <Link
            href={`/dashboard/chapters/${chapter.id}`}
            className="flex gap-3 rounded-2xl p-4 text-white transition hover:scale-[1.01]"
            style={{ background: chapter.color }}
          >
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: chapter.accent, color: chapter.color }}
            >
              {index + 1}
            </span>
            <span>
              <span className="block font-semibold">
                {locale === "ar" ? chapter.titleAr : chapter.titleEn}
              </span>
              <span className="mt-1 block text-xs text-white/75">
                {locale === "ar" ? chapter.gameAr : chapter.gameEn}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
