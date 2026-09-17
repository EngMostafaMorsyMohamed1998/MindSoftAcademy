"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnswerReview } from "@/components/answer-review";
import { TrueFalsePick } from "@/components/true-false-pick";
import { submitChapterExam } from "@/app/actions/study";
import { bookletOptions } from "@/lib/booklet-pack";
import type { ChapterExam, ObjectiveQuestion } from "@/lib/exams";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { reviewObjectives } from "@/lib/review";
import { newAttemptSeed, shuffled } from "@/lib/shuffle";

type PaperQuestion = ObjectiveQuestion & { optionOrder: number[] };

function optionCount(question: ObjectiveQuestion) {
  if (question.kind === "tf") return 2;
  return (question.optionsAr ?? []).filter((option) => option.trim()).length;
}

function buildPaper(exam: ChapterExam, seed: number): PaperQuestion[] {
  return shuffled(exam.objectives, seed).map((question, index) => {
    const optionOrder =
      question.kind === "tf"
        ? [0, 1]
        : shuffled(
            Array.from({ length: optionCount(question) }, (_, optionIndex) => optionIndex),
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
  mode = "class",
}: {
  locale: Locale;
  exam: ChapterExam;
  nextHref?: string;
  nextLabel?: string;
  lessonHint: string;
  durationSeconds: number;
  closesAt?: string;
  mode?: "class" | "ministry";
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
    answers?: Record<string, number>;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [seed, setSeed] = useState(0);
  const [step, setStep] = useState(0);
  const submitted = useRef(false);
  const paper = useMemo(() => (seed ? buildPaper(exam, seed) : []), [exam, seed]);
  const ministry = mode === "ministry";
  const ministryTotal = paper.length + exam.essays.length;

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
        <p className="mt-2 text-sm text-foreground/65">
          {ministry ? t(locale, "ministryRules") : t(locale, "examRules")}
        </p>
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
        <p className="font-serif text-4xl" dir="ltr">
          {result.objectiveScore}/{result.objectiveTotal}
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
          items={reviewObjectives(exam.objectives, result.answers ?? objective, locale, "")}
          takeaway={lessonHint}
        />
        {result.passed && nextHref ? (
          <Link
            href={nextHref}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
          >
            {nextLabel ?? t(locale, "nextChapter")}
          </Link>
        ) : null}
        {!result.passed && !ministry ? (
          <button
            type="button"
            onClick={() => {
              submitted.current = false;
              setResult(null);
              setObjective({});
              setEssays({});
              setSeconds(limit);
              setSeed(0);
              setStep(0);
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

  function renderObjective(question: PaperQuestion, index: number, locked: boolean) {
    const prompt = locale === "ar" ? question.promptAr : question.promptEn;
    const optionOrder = question.optionOrder;
    const rawOptions =
      question.kind === "tf"
        ? [t(locale, "trueLabel"), t(locale, "falseLabel")]
        : bookletOptions(locale, question.optionsAr ?? [], question.optionsEn ?? []);
    const visible = (optionOrder.length ? optionOrder : rawOptions.map((_, optionIndex) => optionIndex))
      .map((original) => ({
        original,
        label: (rawOptions[original] ?? "").trim(),
      }))
      .filter((row) => row.label);

    return (
      <div key={question.id}>
        <div className="flex items-start gap-2 text-sm font-medium">
          <span className="tabular-nums leading-6">{index + 1}.</span>
          <span className="min-w-0 flex-1 leading-6" lang={locale}>
            {prompt}
          </span>
        </div>
        {question.kind === "tf" ? (
          <TrueFalsePick
            locale={locale}
            value={objective[question.id]}
            disabled={locked}
            onChange={(choice) =>
              setObjective((current) => ({ ...current, [question.id]: choice }))
            }
          />
        ) : (
          <div className="mt-2 grid gap-2">
            {visible.map((row) => (
              <label
                key={`${question.id}-${row.original}`}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 ${
                  locked ? "cursor-default" : "cursor-pointer"
                } ${
                  objective[question.id] === row.original
                    ? "bg-primary/10 ring-primary"
                    : "ring-primary/10"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  disabled={locked}
                  checked={objective[question.id] === row.original}
                  onChange={() =>
                    setObjective((current) => ({ ...current, [question.id]: row.original }))
                  }
                />
                <span className="block" lang={locale}>
                  {row.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (ministry && paper.length > 0) {
    const onEssay = step >= paper.length;
    const essay = onEssay ? exam.essays[step - paper.length] : null;
    const last = step >= ministryTotal - 1;
    return (
      <div className="mt-6 space-y-6">
        <div className={`sticky top-16 z-20 flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold ${low ? "bg-red-600 text-white" : "bg-primary-dark text-white"}`}>
          <span>
            {t(locale, "timeLeft")}: {formatTime(seconds)}
          </span>
          <span>
            {t(locale, "ministryQuestion")}{" "}
            <span className="tabular-nums" dir="ltr">
              {Math.min(step + 1, ministryTotal)}/{ministryTotal}
            </span>
          </span>
        </div>
        <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
          {!onEssay && paper[step] ? (
            renderObjective(paper[step], step, false)
          ) : essay ? (
            <div>
              <h2 className="font-semibold">{t(locale, "essay")}</h2>
              <p className="mt-3 text-sm font-medium">
                {locale === "ar" ? essay.promptAr : essay.promptEn}
              </p>
              <p className="mt-1 text-xs text-foreground/50">
                {locale === "ar" ? essay.guideAr : essay.guideEn}
              </p>
              <textarea
                value={essays[essay.id] ?? ""}
                onChange={(event) =>
                  setEssays((current) => ({ ...current, [essay.id]: event.target.value }))
                }
                rows={8}
                placeholder={t(locale, "writeAnswer")}
                className="mt-3 w-full rounded-2xl border border-primary/15 p-3 text-sm"
              />
            </div>
          ) : null}
        </section>
        <button
          type="button"
          disabled={saving || (!onEssay && paper[step] && objective[paper[step].id] === undefined)}
          onClick={() => {
            if (last) void finish();
            else setStep((current) => current + 1);
          }}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white disabled:opacity-70"
        >
          {last ? t(locale, "submitExam") : t(locale, "ministryNext")}
        </button>
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
          {t(locale, "objective")}{" "}
          <span className="tabular-nums" dir="ltr">
            {answered}/{exam.objectives.length}
          </span>
        </span>
      </div>

      <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
        <h2 className="font-semibold">
          {t(locale, "objective")} · {t(locale, "examObjectiveCount")}
        </h2>
        <div className="mt-4 space-y-5">
          {paper.map((question, index) => renderObjective(question, index, false))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
        <h2 className="font-semibold">{t(locale, "essay")} · {t(locale, "examEssayCount")}</h2>
        <p className="mt-1 text-xs text-foreground/55">{t(locale, "essayHint")}</p>
        <div className="mt-4 space-y-5">
          {exam.essays.map((question, index) => (
            <div key={question.id}>
              <div className="flex items-start gap-2 text-sm font-medium">
                <span className="tabular-nums leading-6">{index + 1}.</span>
                <span className="min-w-0 flex-1 leading-6" lang={locale}>
                  {locale === "ar" ? question.promptAr : question.promptEn}
                </span>
              </div>
              <p className="mt-1 text-xs text-foreground/50" lang={locale}>
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
            </div>
          ))}
        </div>
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
