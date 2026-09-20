"use client";

import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { AiNestDiagram } from "@/components/ai-nest-diagram";
import { TextbookArt } from "@/components/textbook-art";
import { artFor, bookletSafe, lessonArtMap } from "@/lib/booklet-lang";
import { BRAND } from "@/lib/brand";
import { bundleExplains } from "@/lib/lesson-explains";
import type { TextbookPage } from "@/lib/textbook-pages";
import type { Locale } from "@/lib/locale";

export function TextbookLesson({ locale, page }: { locale: Locale; page: TextbookPage }) {
  const ar = locale === "ar";
  const [picked, setPicked] = useState<string | null>(null);
  const headers = ar ? page.headersAr : page.headersEn;
  const points = ar ? page.pointsAr : page.pointsEn;
  const colCount = headers.length;
  const nest = page.art === "nest";
  const termTable = page.headersAr[0] === "المصطلح" || page.headersEn[0] === "Term";
  const artMap = lessonArtMap([
    ...(termTable
      ? page.rows.map((row) => ({
          term: ar ? (row.cellsAr[0] ?? "") : (row.cellsEn[0] ?? ""),
          meaning: ar ? (row.cellsAr[1] ?? "") : (row.cellsEn[1] ?? ""),
        }))
      : []),
    ...page.explains.map((item) => ({
      term: ar ? item.termAr : item.termEn,
      meaning: ar ? item.bodyAr : item.bodyEn,
    })),
  ]);

  return (
    <article className="textbook-sheet mb-8 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
      <header className="textbook-head flex items-center justify-between gap-3 bg-[#0c2d6b] px-5 py-3.5 text-white">
        <span className="text-base font-extrabold">
          {ar ? "الدرس" : "Lesson"} {page.id}
        </span>
        <span className="text-base font-bold leading-7">{bookletSafe(locale, ar ? page.titleAr : page.titleEn)}</span>
      </header>

      <div className="px-5 py-6 sm:px-7">
        <p className="textbook-ask flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-lg font-bold leading-9 text-[#111827]">
          <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-amber-100 text-amber-700">
            <CircleHelp className="size-4" strokeWidth={2.6} />
          </span>
          <span>
            <span className="text-[#92400e]">{ar ? "السؤال الرئيسي:" : "Main question:"}</span>{" "}
            {bookletSafe(locale, ar ? page.questionAr : page.questionEn)}
          </span>
        </p>

        <div className="textbook-figure mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h4 className="flex items-center gap-3 text-xl font-extrabold text-[#0c2d6b]">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#0c2d6b] text-xs text-white">
              1
            </span>
            {bookletSafe(locale, ar ? page.sectionAr : page.sectionEn)}
          </h4>
          <div className={`mt-5 grid items-center gap-6 ${nest ? "lg:grid-cols-12" : "sm:grid-cols-[220px_minmax(0,1fr)]"}`}>
            <figure
              className={
                nest
                  ? "flex items-center justify-center rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100 lg:col-span-5"
                  : "overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-slate-200"
              }
            >
              {page.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={page.photo} alt={ar ? page.sectionAr : page.sectionEn} className="aspect-[4/3] w-full object-cover" />
              ) : nest ? (
                <AiNestDiagram
                  locale={locale}
                  selected={picked?.startsWith("explain:") ? picked.slice("explain:".length) : null}
                  onSelect={(term) => setPicked(`explain:${term}`)}
                />
              ) : (
                <div className="aspect-[4/3] w-full">
                  <TextbookArt art={page.art} locale={locale} />
                </div>
              )}
            </figure>
            <div className={nest ? "lg:col-span-7" : undefined}>
              <p className="text-base font-semibold leading-8 text-[#111827]">{bookletSafe(locale, ar ? page.introAr : page.introEn)}</p>
              {points.length ? (
                <ol className="mt-4 list-decimal space-y-3 ps-6 text-base font-semibold leading-8 text-[#111827]">
                  {points.map((point) => (
                    <li key={point}>{bookletSafe(locale, point)}</li>
                  ))}
                </ol>
              ) : null}
            </div>
          </div>
        </div>

        {termTable ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {page.rows.map((row, index) => {
              const term = bookletSafe(locale, ar ? (row.cellsAr[0] ?? "") : (row.cellsEn[0] ?? ""));
              const meaning = bookletSafe(locale, ar ? (row.cellsAr[1] ?? "") : (row.cellsEn[1] ?? ""));
              const termKey = `explain:${(row.cellsEn[0] ?? term).trim()}`;
              return (
                <div
                  key={`${page.id}-term-${index}`}
                  className={`concept-card flex cursor-pointer gap-4 rounded-2xl bg-[#eef3f9] p-4 ${picked === termKey ? "is-active" : ""}`}
                  onClick={() => setPicked(termKey)}
                >
                  <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-slate-100">
                    <TextbookArt art={artFor(artMap, term, meaning)} locale={locale} compact />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-extrabold text-[#0c2d6b]">{term}</p>
                    <p className="mt-1 text-sm font-semibold leading-7 text-[#334155]">{meaning}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <table className="textbook-table mt-6 w-full border-collapse">
            <colgroup>
              {colCount === 2 ? (
                <>
                  <col className="w-[28%]" />
                  <col className="w-[72%]" />
                </>
              ) : (
                <>
                  <col className="w-[22%]" />
                  <col className="w-[40%]" />
                  <col className="w-[38%]" />
                </>
              )}
            </colgroup>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{bookletSafe(locale, header)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.rows.map((row, index) => (
                <TextbookRows
                  key={`${page.id}-${index}`}
                  cells={(ar ? row.cellsAr : row.cellsEn).map((cell) => bookletSafe(locale, cell))}
                  example={
                    row.exampleAr || row.exampleEn
                      ? bookletSafe(locale, (ar ? row.exampleAr : row.exampleEn) ?? "")
                      : undefined
                  }
                  cols={colCount}
                  zebra={index % 2 === 1}
                />
              ))}
            </tbody>
          </table>
        )}

        {page.explains.length ? (
          <div className="mt-8 space-y-4">
            <h4 className="text-xl font-extrabold text-[#0c2d6b]">
              {ar ? "شرح المصطلحات" : "Term explanations"}
              <span className="ms-2 text-base font-semibold text-slate-400">
                {ar ? "— اقرأ قبل التدريبات" : "— read before the drills"}
              </span>
            </h4>
            {bundleExplains(page.explains).map((bundle) => {
              const grouped = bundle.items.length > 1;
              const title = bookletSafe(locale, ar ? bundle.titleAr : bundle.titleEn);
              const lead = bundle.items[0];
              const active = bundle.items.some((item) => picked === `explain:${item.termEn}`);
              return (
                <article
                  key={`${page.id}-${bundle.titleEn}`}
                  className={`concept-card exp-fade cursor-pointer rounded-2xl bg-[#eef3f9] p-5 ${active ? "is-active" : ""}`}
                  onClick={() => setPicked(`explain:${lead?.termEn ?? bundle.titleEn}`)}
                >
                  <p className="text-lg font-extrabold text-[#0c2d6b]">{title}</p>
                  {grouped ? (
                    <ol className="mt-3 list-decimal space-y-3 ps-6 text-base font-semibold leading-8 text-[#111827]">
                      {bundle.items.map((item) => (
                        <li key={item.termEn}>
                          <span className="font-extrabold text-[#0c2d6b]">{bookletSafe(locale, ar ? item.termAr : item.termEn)}</span>
                          {" — "}
                          {bookletSafe(locale, ar ? item.bodyAr : item.bodyEn)}
                        </li>
                      ))}
                    </ol>
                  ) : lead ? (
                    <div className="mt-3 flex gap-4">
                      <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-slate-100">
                        <TextbookArt
                          art={artFor(artMap, bookletSafe(locale, ar ? lead.termAr : lead.termEn), bookletSafe(locale, ar ? lead.bodyAr : lead.bodyEn))}
                          locale={locale}
                          compact
                        />
                      </div>
                      <p className="min-w-0 text-base font-semibold leading-8 text-[#111827]">
                        {bookletSafe(locale, ar ? lead.bodyAr : lead.bodyEn)}
                      </p>
                    </div>
                  ) : null}
                  {lead?.exampleAr || lead?.exampleEn ? (
                    <p className="mt-3 rounded-xl bg-[#fff4cc] px-3 py-2 text-base font-semibold leading-7 text-[#111827] ring-1 ring-amber-200">
                      <strong>{ar ? "مثال:" : "Example:"}</strong> {bookletSafe(locale, ar ? (lead?.exampleAr ?? "") : (lead?.exampleEn ?? ""))}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}

        <p className="textbook-takeaway mt-6 rounded-2xl bg-[#fff4cc] px-4 py-4 text-base font-bold leading-8 text-[#111827] ring-1 ring-amber-200">
          <strong>{ar ? "الخلاصة:" : "Takeaway:"}</strong> {bookletSafe(locale, ar ? page.takeawayAr : page.takeawayEn)}
        </p>
      </div>

      <footer className="textbook-foot flex items-center justify-between gap-3 border-t-2 border-slate-300 px-5 py-3">
        <span className="rounded-sm bg-emerald-700 px-3 py-1 text-sm font-extrabold text-white">
          {ar ? "البكالوريا" : "Baccalaureate"}
        </span>
        <span className="text-sm font-extrabold tracking-wide text-[#111827]" dir="ltr">
          {BRAND.phone}
        </span>
        <span className="text-base font-extrabold text-[#111827]">{page.pageNo}</span>
      </footer>
    </article>
  );
}

function TextbookRows({
  cells,
  example,
  cols,
  zebra,
}: {
  cells: string[];
  example?: string;
  cols: number;
  zebra: boolean;
}) {
  return (
    <>
      <tr className={zebra ? "textbook-zebra" : undefined}>
        {cells.map((cell, index) => (
          <td key={`${index}-${cell.slice(0, 12)}`}>{cell}</td>
        ))}
      </tr>
      {example ? (
        <tr className="textbook-example">
          <td colSpan={cols}>{example}</td>
        </tr>
      ) : null}
    </>
  );
}
