"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { submitChapterExam } from "@/app/actions/study";
import { EXAM_DURATION_SECONDS } from "@/lib/curriculum";
import type { ChapterExam } from "@/lib/exams";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

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
}: {
  locale: Locale;
  exam: ChapterExam;
  nextHref?: string;
  nextLabel?: string;
}) {
  const [phase, setPhase] = useState<"ready" | "run" | "done">("ready");
  const [seconds, setSeconds] = useState(EXAM_DURATION_SECONDS);
  const [objective, setObjective] = useState<Record<string, number>>({});
  const [essays, setEssays] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ objectiveScore: number; objectiveTotal: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const submitted = useRef(false);

  const low = seconds <= 60;

  useEffect(() => {
    if (phase !== "run") return;
    const end = Date.now() + EXAM_DURATION_SECONDS * 1000;
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
        <button
          type="button"
          onClick={() => setPhase("run")}
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
        </p>
        <p className="mt-3 text-sm text-accent">{t(locale, "pendingReview")}</p>
        {nextHref ? (
          <Link
            href={nextHref}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
          >
            {nextLabel ?? t(locale, "nextChapter")}
          </Link>
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
          {exam.objectives.map((question, index) => {
            const prompt = locale === "ar" ? question.promptAr : question.promptEn;
            const options =
              question.kind === "tf"
                ? locale === "ar"
                  ? [t(locale, "trueLabel"), t(locale, "falseLabel")]
                  : [t(locale, "trueLabel"), t(locale, "falseLabel")]
                : locale === "ar"
                  ? question.optionsAr ?? []
                  : question.optionsEn ?? [];
            return (
              <li key={question.id}>
                <p className="text-sm font-medium">
                  {index + 1}. {prompt}
                  <span className="ms-2 text-xs text-foreground/45">
                    {question.kind === "tf" ? t(locale, "trueFalse") : t(locale, "mcq")}
                  </span>
                </p>
                <div className="mt-2 grid gap-2">
                  {options.filter(Boolean).map((option, optionIndex) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 ${
                        objective[question.id] === optionIndex
                          ? "bg-primary/10 ring-primary"
                          : "ring-primary/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={objective[question.id] === optionIndex}
                        onChange={() =>
                          setObjective((current) => ({ ...current, [question.id]: optionIndex }))
                        }
                      />
                      {option}
                    </label>
                  ))}
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
