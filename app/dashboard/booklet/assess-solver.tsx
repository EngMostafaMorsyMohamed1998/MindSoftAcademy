"use client";

import { useMemo, useState } from "react";
import { gradeAssessLesson, type AssessGrade } from "@/app/actions/assess-grade";

type Block = {
  key: string;
  period: string;
  title: string;
  essays: { id: string; prompt: string }[];
  mcq: { id: string; prompt: string; options: string[] }[];
};

export function AssessSolver({
  locale,
  lessonId,
  letters,
  blocks,
}: {
  locale: "ar" | "en";
  lessonId: string;
  letters: string[];
  blocks: Block[];
}) {
  const ar = locale === "ar";
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [grade, setGrade] = useState<AssessGrade | null>(null);

  const total = useMemo(() => blocks.reduce((sum, block) => sum + block.mcq.length, 0), [blocks]);
  const answered = Object.keys(answers).length;
  const byId = useMemo(() => {
    const map = new Map<string, AssessGrade["mcq"][number]>();
    grade?.mcq.forEach((row) => map.set(row.id, row));
    return map;
  }, [grade]);
  const guides = useMemo(() => {
    const map = new Map<string, string>();
    grade?.essays.forEach((row) => map.set(row.id, row.guide));
    return map;
  }, [grade]);

  async function finish() {
    setBusy(true);
    const result = await gradeAssessLesson({ lessonId, answers });
    setBusy(false);
    if ("error" in result) return;
    setGrade(result);
  }

  return (
    <>
      {blocks.map((block) => (
        <div key={block.key} className="print-break mt-8">
          <p className="text-sm font-extrabold text-primary">{block.period}</p>
          <p className="mt-1 text-xl font-extrabold text-[#0c2d6b]">{block.title}</p>
          {block.essays.length ? (
            <section className="booklet-section mt-8">
              <p className="booklet-section-title mb-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-extrabold text-white">
                {ar ? "الأسئلة المقالية" : "Essay questions"}
              </p>
              <div className="mt-4 space-y-4">
                {block.essays.map((row, index) => (
                  <article key={row.id} className="print-keep rounded-xl border-2 border-dashed border-primary/30 p-5">
                    <p className="text-lg font-bold leading-9 text-[#111827]">
                      <span className="ms-1 font-extrabold text-primary">{index + 1}-</span>
                      {row.prompt}
                    </p>
                    <textarea
                      className="no-print mt-3 min-h-28 w-full rounded-xl border border-primary/20 bg-white p-3 text-base leading-8 text-[#111827]"
                      placeholder={ar ? "اكتب إجابتك هنا" : "Write your answer here"}
                    />
                    <div className="mt-3 hidden space-y-3 print:block">
                      {Array.from({ length: 4 }, (_, line) => (
                        <div key={line} className="h-7 border-b border-dashed border-primary/25" />
                      ))}
                    </div>
                    {grade ? (
                      <p className="mt-3 text-base font-semibold leading-8 text-[#111827] whitespace-pre-line">
                        <span className="font-extrabold text-primary">{ar ? "نموذج الإجابة: " : "Model answer: "}</span>
                        {guides.get(row.id)}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          {block.mcq.length ? (
            <section className="booklet-section mt-8">
              <p className="booklet-section-title mb-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-extrabold text-white">
                {ar ? "الأسئلة الموضوعية (اختيار من متعدد)" : "Objective questions (multiple choice)"}
              </p>
              <ol className="mt-4 list-none space-y-6">
                {block.mcq.map((row, index) => {
                  const marked = byId.get(row.id);
                  return (
                    <li key={row.id} className="booklet-q rounded-xl p-5">
                      <p className="text-lg font-bold leading-9 text-[#111827]">
                        <span className="ms-1 font-extrabold text-primary">{index + 1}-</span>
                        {row.prompt}
                      </p>
                      <ul className="mt-4 space-y-3">
                        {row.options.map((option, optionIndex) => {
                          const picked = answers[row.id] === optionIndex;
                          const correct = marked?.correctIndex === optionIndex;
                          const wrongPick = Boolean(marked) && picked && !correct;
                          return (
                            <li key={`${row.id}-${optionIndex}`}>
                              <button
                                type="button"
                                disabled={Boolean(grade)}
                                onClick={() => setAnswers((current) => ({ ...current, [row.id]: optionIndex }))}
                                className={`flex w-full items-start gap-3 rounded-xl px-2 py-1 text-start text-base font-semibold leading-8 text-[#111827] ${
                                  correct
                                    ? "bg-emerald-50"
                                    : wrongPick
                                      ? "bg-red-50"
                                      : picked
                                        ? "bg-primary/10"
                                        : ""
                                }`}
                              >
                                <span
                                  className={`mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
                                    correct
                                      ? "border-emerald-600 text-emerald-700"
                                      : wrongPick
                                        ? "border-red-600 text-red-700"
                                        : "border-primary text-primary"
                                  }`}
                                >
                                  {letters[optionIndex]}
                                </span>
                                <span>{option}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            </section>
          ) : null}
        </div>
      ))}

      {total ? (
        <div className="no-print mt-8 flex flex-wrap items-center gap-4">
          {grade ? (
            <p className="font-serif text-4xl text-[#0c2d6b]" dir="ltr">
              {grade.score}/{grade.total}
              <span className="ms-2 text-2xl text-[#374151]">
                ({Math.round((grade.score / Math.max(grade.total, 1)) * 100)}%)
              </span>
            </p>
          ) : (
            <button
              type="button"
              disabled={busy || answered === 0}
              onClick={finish}
              className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-base font-extrabold text-white disabled:opacity-50"
            >
              {busy ? (ar ? "بيتحسب…" : "Scoring…") : ar ? "اعرض درجتي" : "Show my score"}
            </button>
          )}
          <p className="text-sm font-semibold text-[#374151]">
            {ar ? `جاوبت ${answered} من ${total}` : `Answered ${answered} of ${total}`}
          </p>
          {grade ? (
            <button
              type="button"
              onClick={() => {
                setGrade(null);
                setAnswers({});
              }}
              className="text-sm font-extrabold text-primary"
            >
              {ar ? "حاول تاني" : "Try again"}
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
