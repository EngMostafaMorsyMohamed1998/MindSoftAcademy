"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flag,
  FlagOff,
  RotateCcw,
  Send,
  Timer,
  XCircle,
} from "lucide-react";
import {
  examDurationSeconds,
  examTitle,
  questionsForAllBooks,
} from "./questions";

const QUESTIONS = questionsForAllBooks();
const EXAM_DURATION_SECONDS = examDurationSeconds(QUESTIONS.length);
const EXAM_TITLE = examTitle("all");

type Phase = "ready" | "in-progress" | "submitted";
type SaveStatus = "idle" | "saving" | "saved" | "error";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function questionLabel(
  index: number,
  answers: (number | null)[],
  flagged: boolean[],
) {
  const parts = [
    answers[index] !== null ? "answered" : "unanswered",
    flagged[index] ? "flagged for review" : null,
  ].filter(Boolean);
  return `Question ${index + 1}, ${parts.join(", ")}`;
}

export function ExamSimulator() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    QUESTIONS.map(() => null),
  );
  const [flagged, setFlagged] = useState<boolean[]>(() =>
    QUESTIONS.map(() => false),
  );
  const [confirming, setConfirming] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const endAtRef = useRef<number | null>(null);
  const submittedRef = useRef(false);
  const answersRef = useRef(answers);

  // The countdown submits from an interval, so keep the latest answers
  // reachable without re-creating the timer on every selection.
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const answeredCount = answers.filter((answer) => answer !== null).length;
  const flaggedCount = flagged.filter(Boolean).length;
  const unansweredCount = QUESTIONS.length - answeredCount;
  const question = QUESTIONS[current];
  const lowTime = secondsLeft <= 5 * 60;

  const score = useMemo(() => {
    const correct = answers.filter(
      (answer, index) => answer === QUESTIONS[index].correctIndex,
    ).length;
    return {
      correct,
      total: QUESTIONS.length,
      percent: Math.round((correct / QUESTIONS.length) * 100),
    };
  }, [answers]);

  const submitExam = useCallback((reason: "manual" | "timeout") => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setTimedOut(reason === "timeout");
    setConfirming(false);
    setPhase("submitted");
    setSaveStatus("saving");

    const submittedAnswers = answersRef.current;
    const correct = submittedAnswers.filter(
      (answer, index) => answer === QUESTIONS[index].correctIndex,
    ).length;
    const totalQuestions = QUESTIONS.length;
    const percentage = Math.round((correct / totalQuestions) * 100);

    void fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: correct,
        totalQuestions,
        percentage,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to save result");
        }
        setSaveStatus("saved");
      })
      .catch(() => {
        setSaveStatus("error");
      });
  }, []);

  useEffect(() => {
    if (phase !== "in-progress") return;

    const tick = () => {
      const endAt = endAtRef.current;
      if (endAt === null) return;
      const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        submitExam("timeout");
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [phase, submitExam]);

  function startExam() {
    submittedRef.current = false;
    setTimedOut(false);
    setConfirming(false);
    setSaveStatus("idle");
    setCurrent(0);
    setAnswers(QUESTIONS.map(() => null));
    setFlagged(QUESTIONS.map(() => false));
    setSecondsLeft(EXAM_DURATION_SECONDS);
    endAtRef.current = Date.now() + EXAM_DURATION_SECONDS * 1000;
    setPhase("in-progress");
  }

  function selectOption(optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optionIndex;
      return next;
    });
  }

  function toggleFlag() {
    setFlagged((prev) => {
      const next = [...prev];
      next[current] = !next[current];
      return next;
    });
  }

  function requestSubmit() {
    if (unansweredCount > 0) {
      setConfirming(true);
      return;
    }
    submitExam("manual");
  }

  if (phase === "ready") {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="font-serif text-3xl tracking-tight">Exam Simulator</h1>
        <p className="mt-2 text-sm text-foreground/65">
          Timed, syllabus-true mocks with the pacing of the real Baccalaureate.
        </p>
        <article className="mt-8 rounded-3xl border border-primary/8 bg-white p-6 shadow-sm shadow-primary/5 sm:p-8">
          <p className="text-xs font-semibold tracking-wide text-primary-muted uppercase">
            Recommended next
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            {EXAM_TITLE}
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/65">
            {QUESTIONS.length} multiple-choice questions · {EXAM_DURATION_SECONDS / 60}{" "}
            minutes. One question at a time. Flag anything you want to revisit
            before you submit.
          </p>
          <ul className="mt-5 space-y-1.5 text-sm text-foreground/70">
            <li>Timer starts when you begin and auto-submits at 00:00.</li>
            <li>Use the grid to jump between questions.</li>
            <li>Gold marks questions flagged for review.</li>
          </ul>
          <button
            type="button"
            onClick={startExam}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-muted"
          >
            Start mock exam
          </button>
        </article>
      </div>
    );
  }

  if (phase === "submitted") {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="font-serif text-3xl tracking-tight">Results</h1>
        <p className="mt-2 text-sm text-foreground/65">
          {timedOut
            ? "Time’s up — your exam was submitted automatically."
            : "Your mock exam has been submitted."}
        </p>
        {saveStatus === "saving" ? (
          <p className="mt-3 text-sm text-primary/70">Saving your result…</p>
        ) : null}
        {saveStatus === "saved" ? (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1.5 text-sm font-medium text-primary">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Result saved successfully.
          </p>
        ) : null}
        {saveStatus === "error" ? (
          <p className="mt-3 text-sm text-red-700">
            Couldn’t save your result. You can still review your score below.
          </p>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-primary/8 bg-white p-5 shadow-sm shadow-primary/5">
            <p className="text-xs font-semibold tracking-wide text-primary-muted uppercase">
              Score
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {score.correct}/{score.total}
            </p>
            <p className="mt-1 text-sm text-foreground/55">{score.percent}%</p>
          </article>
          <article className="rounded-2xl border border-primary/8 bg-white p-5 shadow-sm shadow-primary/5">
            <p className="text-xs font-semibold tracking-wide text-primary-muted uppercase">
              Answered
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {answeredCount}/{QUESTIONS.length}
            </p>
            <p className="mt-1 text-sm text-foreground/55">
              {unansweredCount} left blank
            </p>
          </article>
          <article className="rounded-2xl border border-primary/8 bg-white p-5 shadow-sm shadow-primary/5">
            <p className="text-xs font-semibold tracking-wide text-primary-muted uppercase">
              Time used
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
              {formatTime(EXAM_DURATION_SECONDS - secondsLeft)}
            </p>
            <p className="mt-1 text-sm text-foreground/55">
              {formatTime(secondsLeft)} remaining
            </p>
          </article>
        </section>

        <ol className="mt-6 divide-y divide-primary/8 overflow-hidden rounded-2xl border border-primary/8 bg-white shadow-sm shadow-primary/5">
          {QUESTIONS.map((item, index) => {
            const selected = answers[index];
            const isCorrect = selected === item.correctIndex;
            return (
              <li key={item.id} className="flex items-start gap-3 px-5 py-4">
                {selected === null ? (
                  <XCircle className="mt-0.5 size-5 shrink-0 text-foreground/30" />
                ) : isCorrect ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                ) : (
                  <XCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    Q{index + 1}. {item.prompt}
                  </p>
                  <p className="mt-1 text-xs text-foreground/55">
                    {selected === null
                      ? "Unanswered"
                      : isCorrect
                        ? `Correct — ${item.options[item.correctIndex]}`
                        : `Your answer: ${item.options[selected]} · Correct: ${item.options[item.correctIndex]}`}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={startExam}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-muted"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Retake exam
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div
        className={`sticky top-14 z-30 -mx-4 mb-6 border-b px-4 py-3 sm:-mx-6 sm:px-6 md:top-0 md:-mx-6 lg:-mx-8 lg:px-8 ${
          lowTime
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-primary/10 bg-white/95 text-primary"
        } backdrop-blur-md`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {lowTime ? (
              <Timer className="size-5" aria-hidden="true" />
            ) : (
              <Clock className="size-5" aria-hidden="true" />
            )}
            <p className="text-sm font-medium">{EXAM_TITLE}</p>
            <p
              className="font-mono text-2xl font-semibold tabular-nums tracking-tight"
              aria-live={lowTime ? "polite" : "off"}
              aria-label={`${Math.floor(secondsLeft / 60)} minutes ${secondsLeft % 60} seconds remaining`}
            >
              {formatTime(secondsLeft)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm">
              {answeredCount}/{QUESTIONS.length} answered
            </p>
            <button
              type="button"
              onClick={requestSubmit}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-muted"
            >
              <Send className="size-4" aria-hidden="true" />
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        <section className="rounded-3xl border border-primary/8 bg-white p-6 shadow-sm shadow-primary/5 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold tracking-wide text-primary-muted uppercase">
              Question {current + 1} of {QUESTIONS.length}
            </p>
            <span className="rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary">
              {question.topic}
            </span>
          </div>
          <h2
            id="exam-question-prompt"
            className="mt-4 font-serif text-2xl tracking-tight text-balance"
          >
            {question.prompt}
          </h2>

          <div
            role="radiogroup"
            aria-labelledby="exam-question-prompt"
            className="mt-6 grid gap-3"
          >
            {question.options.map((option, optionIndex) => {
              const selected = answers[current] === optionIndex;
              const letter = String.fromCharCode(65 + optionIndex);
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => selectOption(optionIndex)}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                    selected
                      ? "border-primary bg-primary/6 text-primary"
                      : "border-primary/10 hover:border-primary/25 hover:bg-primary/4"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      selected
                        ? "bg-primary text-white"
                        : "bg-primary/8 text-primary"
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="leading-relaxed text-foreground">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrent((index) => Math.max(0, index - 1))}
              disabled={current === 0}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-primary/15 px-4 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Previous
            </button>
            <button
              type="button"
              onClick={toggleFlag}
              aria-pressed={flagged[current]}
              className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${
                flagged[current]
                  ? "border-accent bg-accent/15 text-primary"
                  : "border-primary/15 text-primary"
              }`}
            >
              {flagged[current] ? (
                <FlagOff className="size-4" aria-hidden="true" />
              ) : (
                <Flag className="size-4" aria-hidden="true" />
              )}
              {flagged[current] ? "Remove flag" : "Flag for review"}
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrent((index) => Math.min(QUESTIONS.length - 1, index + 1))
              }
              disabled={current === QUESTIONS.length - 1}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-primary/8 bg-white p-5 shadow-sm shadow-primary/5 lg:sticky lg:top-24 lg:self-start">
          <h3 className="text-sm font-semibold">Questions</h3>
          <p className="mt-1 text-xs text-foreground/55">
            {flaggedCount} flagged for review
          </p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {QUESTIONS.map((item, index) => {
              const isCurrent = index === current;
              const isAnswered = answers[index] !== null;
              const isFlagged = flagged[index];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={questionLabel(index, answers, flagged)}
                  className={`relative flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                    isAnswered
                      ? "bg-primary text-white"
                      : isFlagged
                        ? "bg-accent/20 text-primary"
                        : "bg-primary/8 text-primary/70"
                  } ${isFlagged ? "ring-2 ring-accent" : ""} ${
                    isCurrent ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                >
                  {index + 1}
                  {isFlagged ? (
                    <Flag
                      className="absolute top-0.5 right-0.5 size-2.5 fill-current text-accent"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
          <ul className="mt-5 space-y-2 text-xs text-foreground/60">
            <li className="flex items-center gap-2">
              <span className="size-3 rounded bg-primary" />
              Answered
            </li>
            <li className="flex items-center gap-2">
              <span className="size-3 rounded bg-primary/15" />
              Unanswered
            </li>
            <li className="flex items-center gap-2">
              <span className="size-3 rounded bg-accent/40 ring-1 ring-accent" />
              Flagged for review
            </li>
          </ul>
        </aside>
      </div>

      {confirming ? (
        <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-primary-dark/40 p-4 sm:items-center">
          <div
            role="dialog"
            aria-labelledby="submit-confirm-title"
            aria-modal="true"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
          >
            <h3 id="submit-confirm-title" className="text-lg font-semibold">
              Submit exam?
            </h3>
            <p className="mt-2 text-sm text-foreground/65">
              You still have {unansweredCount} unanswered{" "}
              {unansweredCount === 1 ? "question" : "questions"}. You can go back
              and finish them, or submit now.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-primary/15 px-4 text-sm font-semibold text-primary"
              >
                Continue exam
              </button>
              <button
                type="button"
                onClick={() => submitExam("manual")}
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-muted"
              >
                Submit anyway
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
