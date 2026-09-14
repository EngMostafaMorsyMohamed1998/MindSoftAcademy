import Link from "next/link";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function ExamsIndexPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-serif text-3xl">{t(locale, "navExams")}</h1>
      <p className="mt-2 text-sm text-foreground/65">{t(locale, "examRules")}</p>
      <ul className="mt-6 space-y-3">
        {CHAPTERS.map((chapter) => (
          <li key={chapter.id}>
            <Link
              href={`/dashboard/exam/${chapter.id}`}
              className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-primary/10"
            >
              <span>
                <span className="block font-semibold">
                  {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                </span>
                <span className="text-xs text-foreground/55">
                  {t(locale, "minutes30")} · 50% {t(locale, "objective")} · 50% {t(locale, "essay")}
                </span>
              </span>
              <span className="text-sm font-semibold text-primary">{t(locale, "startExam")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
