import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import type { ReviewItem } from "@/lib/review";

export function AnswerReview({
  locale,
  items,
}: {
  locale: Locale;
  items: ReviewItem[];
}) {
  const missed = items.filter((item) => !item.ok);

  if (missed.length === 0) {
    return <p className="mt-4 text-sm text-emerald-700">{t(locale, "reviewAllCorrect")}</p>;
  }

  return (
    <section className="mt-5 space-y-3">
      <h3 className="text-sm font-semibold">{t(locale, "reviewTitle")}</h3>
      {missed.map((item) => (
        <article key={item.id} className="rounded-2xl bg-primary/4 p-3 text-sm">
          <p className="font-medium">{item.prompt}</p>
          <p className="mt-2 text-red-700">
            {t(locale, "reviewYours")}: {item.chosen}
          </p>
          <p className="mt-1 text-emerald-700">
            {t(locale, "reviewCorrect")}: {item.correct}
          </p>
          {item.hint ? (
            <p className="mt-2 text-xs text-foreground/65">
              {t(locale, "reviewHint")}: {item.hint}
            </p>
          ) : null}
        </article>
      ))}
    </section>
  );
}
