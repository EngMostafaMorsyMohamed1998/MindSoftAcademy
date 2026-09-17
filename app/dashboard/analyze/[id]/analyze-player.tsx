"use client";

import { useState } from "react";
import { AnswerGuide } from "@/components/answer-guide";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import type { AnalysisPrompt } from "@/lib/question-bank/types";

export function AnalyzePlayer({
  locale,
  questions,
}: {
  locale: Locale;
  questions: AnalysisPrompt[];
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const question = questions[index];

  if (!question) {
    return <p className="mt-6 text-sm text-foreground/65">{t(locale, "analyzeEmpty")}</p>;
  }

  function next() {
    setIndex((current) => (current + 1) % questions.length);
    setAnswer("");
    setShowGuide(false);
  }

  return (
    <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-primary/10">
      <p className="text-xs font-semibold text-primary/60" dir="ltr">
        {index + 1} / {questions.length}
      </p>
      <p className="mt-3 text-lg font-semibold leading-9 text-[#111827]">
        {locale === "ar" ? question.promptAr : question.promptEn}
      </p>
      <p className="mt-2 text-base font-semibold text-[#374151]">{t(locale, "essayHint")}</p>
      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        rows={7}
        className="mt-4 w-full rounded-xl border-2 border-primary/20 bg-background px-4 py-3 text-base font-semibold leading-8 outline-none focus:ring-2 focus:ring-accent/40"
        placeholder={t(locale, "writeAnswer")}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowGuide((open) => !open)}
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {showGuide ? t(locale, "hideGuide") : t(locale, "showGuide")}
        </button>
        {questions.length > 1 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex rounded-full border border-primary/20 px-4 py-2 text-sm font-semibold text-primary"
          >
            {t(locale, "analyzeNext")}
          </button>
        ) : null}
      </div>
      {showGuide ? <AnswerGuide locale={locale} text={locale === "ar" ? question.guideAr : question.guideEn} /> : null}
    </div>
  );
}
