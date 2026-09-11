const LETTERS = ["A", "B", "C", "D"] as const;

/** Completing any attempt always earns this. */
export const COMPLETION_POINTS = 10;
/** Extra points when the percentage is at least `PASS_POINTS_THRESHOLD`. */
export const PASS_BONUS_POINTS = 50;
export const PASS_POINTS_THRESHOLD = 70;

export type AnswerRecord = Record<string, string>;

export type GradedAttempt = {
  /** Number of questions answered correctly. */
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  pointsEarned: number;
};

function normalizeSelection(
  selectedOption: string,
  options: string[],
): string | null {
  const trimmed = selectedOption.trim();
  if (!trimmed) return null;

  const letter = trimmed.toUpperCase();
  if (LETTERS.includes(letter as (typeof LETTERS)[number]) && letter.length === 1) {
    return letter;
  }

  const byText = options.findIndex((option) => option === trimmed);
  if (byText >= 0 && byText < LETTERS.length) {
    return LETTERS[byText];
  }

  const asIndex = Number(trimmed);
  if (
    Number.isInteger(asIndex) &&
    asIndex >= 0 &&
    asIndex < options.length &&
    asIndex < LETTERS.length
  ) {
    return LETTERS[asIndex];
  }

  return null;
}

export function isCorrectAnswer(
  selectedOption: string,
  correctAnswer: string,
  options: string[],
): boolean {
  const selected = normalizeSelection(selectedOption, options);
  if (selected === null) return false;
  return selected === correctAnswer.trim().toUpperCase();
}

export function pointsForAttempt(percentage: number): number {
  return (
    COMPLETION_POINTS +
    (percentage >= PASS_POINTS_THRESHOLD ? PASS_BONUS_POINTS : 0)
  );
}

/**
 * Grade a capsule attempt.
 *
 * `answers` is a map of question id → selected option (`"A"`–`"D"`,
 * the option text, or a 0-based index). Unanswered questions count as wrong.
 */
export function gradeQuiz(
  questions: { id: string; options: string[]; correctAnswer: string }[],
  answers: AnswerRecord,
): GradedAttempt {
  let correct = 0;

  for (const question of questions) {
    const selected = answers[question.id];
    if (typeof selected !== "string") continue;
    if (isCorrectAnswer(selected, question.correctAnswer, question.options)) {
      correct += 1;
    }
  }

  const total = questions.length;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);

  return {
    score: correct,
    total,
    percentage,
    passed: percentage >= PASS_POINTS_THRESHOLD,
    pointsEarned: pointsForAttempt(percentage),
  };
}
