"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnswerReview } from "@/components/answer-review";
import { submitChapterExam } from "@/app/actions/study";
import type { ChapterExam, ObjectiveQuestion } from "@/lib/exams";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { reviewObjectives } from "@/lib/review";
import { newAttemptSeed, shuffled } from "@/lib/shuffle";

type PaperQuestion = ObjectiveQuestion & { optionOrder: number[] };

function buildPaper(exam: ChapterExam, seed: number): PaperQuestion[] {
  return shuffled(exam.objectives, seed).map((question, index) => {
    const optionOrder = shuffled(
      question.optionsAr
        ? question.optionsAr.map((_, optionIndex) => optionIndex)
        : [0, 1],
      seed + index * 31 + question.id.length,
    );
    return { ...question, optionOrder };
  });
}

function formatTime(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ChapterExamPlayer({
  locale,
  exam,
  nextHref,
  nextLabel,
  lessonHint,
  durationSeconds,
  closesAt,
}: {
  locale: Locale;
  exam: ChapterExam;
  nextHref?: string;
  nextLabel?: string;
  lessonHint: string;
  durationSeconds: number;
  closesAt?: string;
}) {
  const limit = Math.max(60, durationSeconds);
  const [phase, setPhase] = useState<"ready" | "run" | "done">("ready");
  const [seconds, setSeconds] = useState(limit);
  const [objective, setObjective] = useState<Record<string, number>>({});
  const [essays, setEssays] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    objectiveScore: number;
    objectiveTotal: number;
    passed: boolean;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [seed, setSeed] = useState(0);
  const submitted = useRef(false);
  const paper = useMemo(() => (seed ? buildPaper(exam, seed) : []), [exam, seed]);

  const low = seconds <= 60;

  useEffect(() => {
    if (phase !== "run") return;
    const closeAt = closesAt ? new Date(closesAt).getTime() : Date.now() + limit * 1000;
    const end = Math.min(Date.now() + limit * 1000, closeAt);
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setSeconds(left);
      if (left === 0) void finish();
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const answered = useMemo(
    () => exam.objectives.filter((question) => objective[question.id] !== undefined).length,
    [exam.objectives, objective],
  );

  async function finish() {
    if (submitted.current) return;
    submitted.current = true;
    setSaving(true);
    const response = await submitChapterExam({
      chapterId: exam.chapterId,
      objectiveAnswers: objective,
      essayAnswers: essays,
    });
    setSaving(false);
    if ("error" in response) return;
    setResult(response);
    setPhase("done");
  }

  if (phase === "ready") {
    return (
      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-primary/10">
        <h2 className="text-xl font-semibold">{t(locale, "examReady")}</h2>
        <p className="mt-2 text-sm text-foreground/65">{t(locale, "examRules")}</p>
        <p className="mt-2 text-sm font-medium text-primary">{t(locale, "examPassMark")}</p>
        <p className="mt-1 text-xs text-foreground/55">{t(locale, "bankHint")}</p>
        <button
          type="button"
          onClick={() => {
            setSeed(newAttemptSeed());
            setPhase("run");
          }}
          className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-white"
        >
          {t(locale, "startExam")}
        </button>
      </div>
    );
  }

  if (phase === "done" && result) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-primary/10">
        <p className="text-sm text-foreground/55">{t(locale, "objectiveScore")}</p>
        <p className="font-serif text-4xl">
          {result.objectiveScore} / {result.objectiveTotal}
          <span className="ms-2 text-2xl text-foreground/45">
            ({Math.round((result.objectiveScore / Math.max(result.objectiveTotal, 1)) * 100)}%)
          </span>
        </p>
        <p className={`mt-3 text-sm font-medium ${result.passed ? "text-emerald-700" : "text-red-700"}`}>
          {result.passed ? t(locale, "examPassed") : t(locale, "examFailed")}
        </p>
        <p className="mt-2 text-sm text-accent">{t(locale, "pendingReview")}</p>
        <AnswerReview
          locale={locale}
          items={reviewObjectives(exam.objectives, objective, locale, lessonHint)}
        />
        {result.passed && nextHref ? (
          <Link
            href={nextHref}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
          >
            {nextLabel ?? t(locale, "nextChapter")}
          </Link>
        ) : null}
        {!result.passed ? (
          <button
            type="button"
            onClick={() => {
              submitted.current = false;
              setResult(null);
              setObjective({});
              setEssays({});
              setSeconds(limit);
              setSeed(0);
              setPhase("ready");
            }}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
          >
            {t(locale, "retryExam")}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className={`sticky top-16 z-20 flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold ${low ? "bg-red-600 text-white" : "bg-primary-dark text-white"}`}>
        <span>
          {t(locale, "timeLeft")}: {formatTime(seconds)}
        </span>
        <span>
          {answered}/{exam.objectives.length} {t(locale, "objective")}
        </span>
      </div>

      <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
        <h2 className="font-semibold">
          {t(locale, "objective")} · 50%
        </h2>
        <ol className="mt-4 space-y-5">
          {paper.map((question, index) => {
            const prompt = locale === "ar" ? question.promptAr : question.promptEn;
            const optionOrder = question.optionOrder;
            const rawOptions =
              question.kind === "tf"
                ? [t(locale, "trueLabel"), t(locale, "falseLabel")]
                : locale === "ar"
                  ? question.optionsAr ?? []
                  : question.optionsEn ?? [];
            const options = optionOrder
              ? optionOrder.map((original) => rawOptions[original] ?? "")
              : rawOptions;
            return (
              <li key={question.id}>
                <p className="text-sm font-medium">
                  {index + 1}. {prompt}
                  <span className="ms-2 text-xs text-foreground/45">
                    {question.kind === "tf" ? t(locale, "trueFalse") : t(locale, "mcq")}
                  </span>
                </p>
                <div className="mt-2 grid gap-2">
                  {options.filter(Boolean).map((option, optionIndex) => {
                    const originalIndex = optionOrder?.[optionIndex] ?? optionIndex;
                    return (
                    <label
                      key={`${question.id}-${originalIndex}`}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 ${
                        objective[question.id] === originalIndex
                          ? "bg-primary/10 ring-primary"
                          : "ring-primary/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={objective[question.id] === originalIndex}
                        onChange={() =>
                          setObjective((current) => ({ ...current, [question.id]: originalIndex }))
                        }
                      />
                      {option}
                    </label>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
        <h2 className="font-semibold">{t(locale, "essay")} · 50%</h2>
        <p className="mt-1 text-xs text-foreground/55">{t(locale, "essayHint")}</p>
        <ol className="mt-4 space-y-5">
          {exam.essays.map((question, index) => (
            <li key={question.id}>
              <p className="text-sm font-medium">
                {index + 1}. {locale === "ar" ? question.promptAr : question.promptEn}
              </p>
              <p className="mt-1 text-xs text-foreground/50">
                {locale === "ar" ? question.guideAr : question.guideEn}
              </p>
              <textarea
                value={essays[question.id] ?? ""}
                onChange={(event) =>
                  setEssays((current) => ({ ...current, [question.id]: event.target.value }))
                }
                rows={7}
                placeholder={t(locale, "writeAnswer")}
                className="mt-2 w-full rounded-2xl border border-primary/15 p-3 text-sm"
              />
            </li>
          ))}
        </ol>
      </section>

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
