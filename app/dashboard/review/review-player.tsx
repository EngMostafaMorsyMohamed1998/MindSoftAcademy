"use client";

import { useState } from "react";
import { TrueFalsePick } from "@/components/true-false-pick";
import { submitMistakeReview } from "@/app/actions/study";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

type ReviewQuestion = {
  questionKey: string;
  prompt: string;
  options: string[];
};

export function ReviewPlayer({
  locale,
  questions,
}: {
  locale: Locale;
  questions: ReviewQuestion[];
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  if (result) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-primary/10">
        <p className="font-serif text-4xl" dir="ltr">
          {result.score}/{result.total}
        </p>
        <p className="mt-2 text-sm text-foreground/65">{t(locale, "reviewMistakesLead")}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {questions.map((question, index) => (
        <article key={question.questionKey} className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
          <div className="flex items-start gap-2 text-sm font-medium">
            <span className="tabular-nums leading-6">{index + 1}.</span>
            <span className="min-w-0 flex-1 leading-6" lang={locale}>
              {question.prompt}
            </span>
          </div>
          {question.options.filter(Boolean).length === 2 &&
          ["صح", "True"].includes(question.options[0] ?? "") ? (
            <TrueFalsePick
              locale={locale}
              value={answers[question.questionKey]}
              onChange={(choice) =>
                setAnswers((current) => ({ ...current, [question.questionKey]: choice }))
              }
            />
          ) : (
            <div className="mt-3 grid gap-2">
              {question.options.filter(Boolean).map((option, optionIndex) => (
                <label
                  key={`${question.questionKey}-${optionIndex}`}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 ${
                    answers[question.questionKey] === optionIndex
                      ? "bg-primary/10 ring-primary"
                      : "ring-primary/10"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.questionKey}
                    checked={answers[question.questionKey] === optionIndex}
                    onChange={() =>
                      setAnswers((current) => ({ ...current, [question.questionKey]: optionIndex }))
                    }
                  />
                  <span className="block" lang={locale}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          )}
        </article>
      ))}
      <button
        type="button"
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          const response = await submitMistakeReview({ answers });
          setSaving(false);
          if ("error" in response) return;
          setResult(response);
        }}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white disabled:opacity-70"
      >
        {t(locale, "submitReview")}
      </button>
    </div>
  );
}
