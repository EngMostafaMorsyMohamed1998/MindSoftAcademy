"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnswerReview } from "@/components/answer-review";
import { HomeworkSlipButton } from "@/components/homework-slip-button";
import { TrueFalsePick } from "@/components/true-false-pick";
import { submitLessonHomework } from "@/app/actions/study";
import {
  LESSON_HOMEWORK_SIZE,
  pickLessonHomework,
  withShuffledOptions,
  type HomeworkQuestion,
} from "@/lib/homework-bank";
import { bookletSafe } from "@/lib/booklet-lang";
import { bookletOptions } from "@/lib/booklet-pack";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { reviewHomework } from "@/lib/review";
import { newAttemptSeed } from "@/lib/shuffle";

export function HomeworkPlayer({
  locale,
  lessonId,
  chapterId,
  lessonHint,
  lessonTitle,
  studentName,
  extras = [],
  size = LESSON_HOMEWORK_SIZE,
  makeupDate,
  dueDate,
}: {
  locale: Locale;
  lessonId: string;
  chapterId: string;
  lessonHint: string;
  lessonTitle: string;
  studentName: string;
  extras?: HomeworkQuestion[];
  size?: number;
  makeupDate?: string;
  dueDate?: string;
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
        ? pickLessonHomework(lessonId, seed, size, extras).map((question, index) =>
            withShuffledOptions(question, seed + index * 17),
          )
        : [],
    [lessonId, seed, size, extras],
  );

  async function finish() {
    setSaving(true);
    const response = await submitLessonHomework({ lessonId, answers, seed, size, makeupDate });
    setSaving(false);
    if ("error" in response) return;
    setResult(response);
  }

  if (result) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-primary/10">
        <p className="font-serif text-4xl" dir="ltr">
          {result.score}/{result.total}
          <span className="ms-2 text-2xl text-foreground/45">
            ({Math.round((result.score / result.total) * 100)}%)
          </span>
        </p>
        <p className={`mt-3 text-sm font-medium ${result.passed ? "text-emerald-700" : "text-red-700"}`}>
          {result.passed ? t(locale, "homeworkPassed") : t(locale, "homeworkFailed")}
        </p>
        <AnswerReview
          locale={locale}
          items={reviewHomework(paper, answers, locale, "")}
          takeaway={lessonHint}
        />
        {result.passed ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <HomeworkSlipButton
              locale={locale}
              label={t(locale, "printHomeworkSlip")}
              slips={[
                {
                  name: studentName,
                  lessonId,
                  lessonTitle,
                  percent: Math.round((result.score / result.total) * 100),
                  score: result.score,
                  total: result.total,
                  date: new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB"),
                },
              ]}
            />
            <Link
              href={makeupDate ? "/dashboard" : `/dashboard/chapters/${chapterId}`}
              className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
            >
              {makeupDate ? t(locale, "makeupDone") : t(locale, "back")}
            </Link>
          </div>
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
        <p className="text-sm text-foreground/65">
          {makeupDate ? t(locale, "makeupHint") : t(locale, "homeworkHint")}
        </p>
        {dueDate ? (
          <p className="mt-2 text-sm font-semibold text-primary">
            {t(locale, "makeupDue")}: {dueDate}
          </p>
        ) : null}
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
        const prompt = bookletSafe(locale, locale === "ar" ? question.promptAr : question.promptEn);
        const options = bookletOptions(locale, question.optionsAr, question.optionsEn);
        return (
          <article key={question.id} className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <div className="flex items-start gap-2 text-sm font-medium">
              <span className="tabular-nums leading-6">{index + 1}.</span>
              <span className="min-w-0 flex-1 leading-6" lang={locale}>
                {prompt}
              </span>
            </div>
            {question.kind === "tf" ? (
              <TrueFalsePick
                locale={locale}
                value={answers[question.id]}
                onChange={(choice) =>
                  setAnswers((current) => ({ ...current, [question.id]: choice }))
                }
              />
            ) : (
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
                    <span className="block" lang={locale}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}
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
