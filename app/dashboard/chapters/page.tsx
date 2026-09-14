import Link from "next/link";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function ChaptersPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-serif text-3xl">{t(locale, "navChapters")}</h1>
      <p className="mt-2 text-sm text-foreground/65">{t(locale, "dashboardHint")}</p>
      <div className="mt-6 grid gap-4">
        {CHAPTERS.map((chapter) => (
          <article
            key={chapter.id}
            className="rounded-3xl border border-primary/8 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-primary/60">
                  {chapter.part === 1 ? t(locale, "part1") : t(locale, "part2")}
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-foreground/65">
                  {locale === "ar" ? chapter.blurbAr : chapter.blurbEn}
                </p>
              </div>
              <Link
                href={`/dashboard/chapters/${chapter.id}`}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                {t(locale, "continueStudy")}
              </Link>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {chapter.lessons.map((lesson) => (
                <li key={lesson.id} className="rounded-xl bg-primary/4 px-3 py-2 text-sm">
                  {lesson.id} · {locale === "ar" ? lesson.titleAr : lesson.titleEn}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
