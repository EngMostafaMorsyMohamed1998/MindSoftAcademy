import { bookletSafe } from "@/lib/booklet-lang";
import type { ObjectiveQuestion } from "@/lib/exams";
import type { HomeworkQuestion } from "@/lib/homework-bank";
import type { Locale } from "@/lib/locale";

export type ReviewItem = {
  id: string;
  prompt: string;
  chosen: string;
  correct: string;
  hint: string;
  ok: boolean;
  answered: boolean;
};

function optionLabel(
  options: string[] | undefined,
  index: number | undefined,
  kind: "mcq" | "tf",
  locale: Locale,
): string {
  if (index === undefined) return "—";
  const label = options?.[index]?.trim();
  if (label) return label;
  if (kind === "tf") {
    if (locale === "ar") return index === 0 ? "صح" : "غلط";
    return index === 0 ? "True" : "False";
  }
  return "—";
}

export function reviewObjectives(
  questions: Array<
    Pick<
      ObjectiveQuestion,
      "id" | "kind" | "promptAr" | "promptEn" | "optionsAr" | "optionsEn" | "correctIndex"
    >
  >,
  answers: Record<string, number>,
  locale: Locale,
  hint: string,
): ReviewItem[] {
  return questions.map((question) => {
    const options = (locale === "ar" ? question.optionsAr : question.optionsEn)?.map((option) =>
      bookletSafe(locale, option),
    );
    const chosenIndex = answers[question.id];
    const answered = chosenIndex !== undefined;
    const ok = answered && chosenIndex === question.correctIndex;
    return {
      id: question.id,
      prompt: bookletSafe(locale, locale === "ar" ? question.promptAr : question.promptEn),
      chosen: optionLabel(options, chosenIndex, question.kind, locale),
      correct: optionLabel(options, question.correctIndex, question.kind, locale),
      hint,
      ok,
      answered,
    };
  });
}

export function reviewHomework(
  questions: HomeworkQuestion[],
  answers: Record<string, number>,
  locale: Locale,
  hint: string,
): ReviewItem[] {
  return questions.map((question) => {
    const options = (locale === "ar" ? question.optionsAr : question.optionsEn)?.map((option) =>
      bookletSafe(locale, option),
    );
    const chosenIndex = answers[question.id];
    const answered = chosenIndex !== undefined;
    const ok = answered && chosenIndex === question.correctIndex;
    return {
      id: question.id,
      prompt: bookletSafe(locale, locale === "ar" ? question.promptAr : question.promptEn),
      chosen: optionLabel(options, chosenIndex, question.kind, locale),
      correct: optionLabel(options, question.correctIndex, question.kind, locale),
      hint,
      ok,
      answered,
    };
  });
}
