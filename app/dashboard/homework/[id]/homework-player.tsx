"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnswerReview } from "@/components/answer-review";
import { submitLessonHomework } from "@/app/actions/study";
import {
  pickLessonHomework,
  withShuffledOptions,
  type HomeworkQuestion,
} from "@/lib/homework-bank";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { reviewHomework } from "@/lib/review";
import { newAttemptSeed } from "@/lib/shuffle";

export function HomeworkPlayer({
  locale,
  lessonId,
  chapterId,
  lessonHint,
}: {
  locale: Locale;
  lessonId: string;
  chapterId: string;
  lessonHint: string;
}) {
  const [seed, setSeed] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(
    null,
  );

  const paper = useMemo(
    () =>
      seed
        ? pickLessonHomework(lessonId, seed).map((question, index) =>
            withShuffledOptions(question, seed + index * 17),
          )
        : [],
    [lessonId, seed],
  );

  async function finish() {
    setSaving(true);
    const response = await submitLessonHomework({ lessonId, answers, seed });
    setSaving(false);
    if ("error" in response) return;
    setResult(response);
  }

  if (result) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-primary/10">
        <p className="font-serif text-4xl">
          {result.score} / {result.total} ({Math.round((result.score / result.total) * 100)}%)
        </p>
        <p className={`mt-3 text-sm font-medium ${result.passed ? "text-emerald-700" : "text-red-700"}`}>
          {result.passed ? t(locale, "homeworkPassed") : t(locale, "homeworkFailed")}
        </p>
        <AnswerReview
          locale={locale}
          items={reviewHomework(paper, answers, locale, lessonHint)}
        />
        {result.passed ? (
          <Link
            href={`/dashboard/chapters/${chapterId}`}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
          >
            {t(locale, "back")}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setAnswers({});
              setSeed(0);
            }}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
          >
            {t(locale, "retryExam")}
          </button>
        )}
      </div>
    );
  }

  if (!seed) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-primary/10">
        <p className="text-sm text-foreground/65">{t(locale, "homeworkHint")}</p>
        <p className="mt-2 text-xs text-foreground/55">{t(locale, "bankHint")}</p>
        <button
          type="button"
          onClick={() => setSeed(newAttemptSeed())}
          className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-white"
        >
          {t(locale, "startHomework")}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {paper.map((question: HomeworkQuestion, index) => {
        const prompt = locale === "ar" ? question.promptAr : question.promptEn;
        const options = locale === "ar" ? question.optionsAr : question.optionsEn;
        return (
          <article key={question.id} className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <p className="text-sm font-medium">
              {index + 1}. {prompt}
            </p>
            <div className="mt-3 grid gap-2">
              {options.map((option, optionIndex) => (
                <label
                  key={`${question.id}-${optionIndex}`}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 ${
                    answers[question.id] === optionIndex
                      ? "bg-primary/10 ring-primary"
                      : "ring-primary/10"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === optionIndex}
                    onChange={() =>
                      setAnswers((current) => ({ ...current, [question.id]: optionIndex }))
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          </article>
        );
      })}
      <button
        type="button"
        disabled={saving}
        onClick={() => void finish()}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white disabled:opacity-70"
      >
        {t(locale, "submitExam")}
      </button>
    </div>
  );
}
