import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import type { ReviewItem } from "@/lib/review";

export function AnswerReview({
  locale,
  items,
  takeaway,
}: {
  locale: Locale;
  items: ReviewItem[];
  takeaway?: string;
}) {
  const answered = items.filter((item) => item.answered);
  const blank = items.filter((item) => !item.answered);

  if (items.length > 0 && answered.length > 0 && answered.every((item) => item.ok) && blank.length === 0) {
    return <p className="mt-4 text-sm text-emerald-700">{t(locale, "reviewAllCorrect")}</p>;
  }

  return (
    <section className="mt-5 space-y-3">
      <h3 className="text-sm font-semibold">{t(locale, "reviewTitle")}</h3>
      {answered.map((item) => (
        <article key={item.id} className="rounded-2xl bg-primary/4 p-3 text-sm">
          <p className="font-medium">{item.prompt}</p>
          <p className={`mt-2 ${item.ok ? "text-emerald-700" : "text-red-700"}`}>
            {t(locale, "reviewYours")}:
            <span className="mt-1 block font-medium leading-6">{item.chosen}</span>
          </p>
          {!item.ok ? (
            <p className="mt-2 text-emerald-700">
              {t(locale, "reviewCorrect")}:
              <span className="mt-1 block font-medium leading-6">{item.correct}</span>
            </p>
          ) : null}
          {item.hint ? (
            <p className="mt-2 text-xs text-foreground/65">
              {t(locale, "reviewHint")}: {item.hint}
            </p>
          ) : null}
        </article>
      ))}
      {blank.map((item) => (
        <article key={item.id} className="rounded-2xl bg-primary/4 p-3 text-sm">
          <p className="font-medium">{item.prompt}</p>
          <p className="mt-2 text-red-700">
            {t(locale, "reviewYours")}:
            <span className="mt-1 block font-medium">{t(locale, "reviewBlank")}</span>
          </p>
          <p className="mt-2 text-emerald-700">
            {t(locale, "reviewCorrect")}:
            <span className="mt-1 block font-medium leading-6">{item.correct}</span>
          </p>
          {item.hint ? (
            <p className="mt-2 text-xs text-foreground/65">
              {t(locale, "reviewHint")}: {item.hint}
            </p>
          ) : null}
        </article>
      ))}
      {takeaway ? (
        <p className="text-xs text-foreground/55">
          {t(locale, "reviewTakeaway")}: {takeaway}
        </p>
      ) : null}
    </section>
  );
}
