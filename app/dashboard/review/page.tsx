import { getStudentSession } from "@/lib/student-session";
import { listDueMisses, listWaitingMisses } from "@/lib/access-store";
import { daysUntilReview, REVIEW_AFTER_MS } from "@/lib/class-clock";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { redirect } from "next/navigation";
import { ReviewPlayer } from "./review-player";

export default async function ReviewPage() {
  const student = await getStudentSession();
  if (!student) redirect("/activate");
  const locale = await getLocale();
  const [due, waiting] = await Promise.all([
    listDueMisses(student.id, REVIEW_AFTER_MS),
    listWaitingMisses(student.id),
  ]);
  const pending = waiting.filter((item) => !due.some((row) => row.questionKey === item.questionKey));

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="font-serif text-3xl">{t(locale, "reviewMistakes")}</h1>
      <p className="mt-2 text-sm text-foreground/65">{t(locale, "reviewMistakesLead")}</p>
      {pending.length > 0 ? (
        <p className="mt-4 text-sm text-foreground/60">
          {t(locale, "reviewWait")}: {pending.length} · {daysUntilReview(pending[0]!.missedAt)}{" "}
          {t(locale, "reviewDaysLeft")}
        </p>
      ) : null}
      {due.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/55">{t(locale, "reviewNone")}</p>
      ) : (
        <ReviewPlayer
          locale={locale}
          questions={due.map((item) => ({
            questionKey: item.questionKey,
            prompt: locale === "ar" ? item.promptAr : item.promptEn,
            options: locale === "ar" ? item.optionsAr : item.optionsEn,
          }))}
        />
      )}
    </div>
  );
}
