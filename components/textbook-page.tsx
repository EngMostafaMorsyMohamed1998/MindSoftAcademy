import { CircleHelp } from "lucide-react";
import { TextbookArt } from "@/components/textbook-art";
import { bookletSafe, termArt } from "@/lib/booklet-lang";
import { BRAND } from "@/lib/brand";
import type { TextbookPage } from "@/lib/textbook-pages";
import type { Locale } from "@/lib/locale";

export function TextbookLesson({ locale, page }: { locale: Locale; page: TextbookPage }) {
  const ar = locale === "ar";
  const headers = ar ? page.headersAr : page.headersEn;
  const points = ar ? page.pointsAr : page.pointsEn;
  const colCount = headers.length;

  return (
    <article className="textbook-sheet mb-8 overflow-hidden rounded-sm bg-white ring-1 ring-slate-300">
      <header className="textbook-head flex items-center justify-between gap-3 bg-[#0c2d6b] px-5 py-3.5 text-white">
        <span className="text-base font-extrabold">
          {ar ? "الدرس" : "Lesson"} {page.id}
        </span>
        <span className="text-base font-bold leading-7">{bookletSafe(locale, ar ? page.titleAr : page.titleEn)}</span>
      </header>

      <div className="px-5 py-6 sm:px-7">
        <p className="textbook-ask rounded-sm border-2 border-amber-300 bg-[#fff6d6] px-4 py-4 text-lg font-bold leading-9 text-[#111827]">
          <span className="textbook-ask-mark" aria-hidden="true">
            <CircleHelp className="size-6" strokeWidth={2.4} />
          </span>
          <span className="text-[#92400e]">{ar ? "السؤال الرئيسي:" : "Main question:"}</span>{" "}
          {bookletSafe(locale, ar ? page.questionAr : page.questionEn)}
        </p>

        <div className="textbook-figure mt-6 grid items-start gap-5 sm:grid-cols-[220px_minmax(0,1fr)]">
          <figure className="overflow-hidden rounded-sm bg-zinc-100 ring-1 ring-slate-300">
            {page.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={page.photo} alt={ar ? page.sectionAr : page.sectionEn} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="aspect-[4/3] w-full">
                <TextbookArt art={page.art} locale={locale} />
              </div>
            )}
          </figure>
          <div>
            <h4 className="text-xl font-extrabold text-[#0c2d6b]">
              <span className="me-2 inline-flex size-7 items-center justify-center rounded-full bg-[#0c2d6b] text-xs text-white">
                1
              </span>
              {bookletSafe(locale, ar ? page.sectionAr : page.sectionEn)}
            </h4>
            <p className="mt-3 text-base font-semibold leading-8 text-[#111827]">{bookletSafe(locale, ar ? page.introAr : page.introEn)}</p>
            {points.length ? (
              <ol className="mt-4 list-decimal space-y-2 ps-6 text-base font-semibold leading-8 text-[#111827]">
                {points.map((point) => (
                  <li key={point}>{bookletSafe(locale, point)}</li>
                ))}
              </ol>
            ) : null}
          </div>
        </div>

        {page.headersAr[0] === "المصطلح" || page.headersEn[0] === "Term" ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {page.rows.map((row, index) => {
              const term = bookletSafe(locale, ar ? (row.cellsAr[0] ?? "") : (row.cellsEn[0] ?? ""));
              const meaning = bookletSafe(locale, ar ? (row.cellsAr[1] ?? "") : (row.cellsEn[1] ?? ""));
              return (
                <div key={`${page.id}-term-${index}`} className="flex gap-3 rounded-xl bg-[#eef3fb] p-4 ring-1 ring-slate-300">
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-white">
                    <TextbookArt art={termArt(term, meaning)} locale={locale} compact />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-extrabold text-[#0c2d6b]">{term}</p>
                    <p className="mt-1 text-base font-semibold leading-7 text-[#111827]">{meaning}</p>
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
          <div className="mt-6 space-y-4">
            <h4 className="text-xl font-extrabold text-[#0c2d6b]">
              {ar ? "شرح المصطلحات — اقرأ قبل التدريبات" : "Term explanations — read before the drills"}
            </h4>
            {page.explains.map((item) => {
              const title = bookletSafe(locale, ar ? item.termAr : item.termEn);
              const body = bookletSafe(locale, ar ? item.bodyAr : item.bodyEn);
              const example = bookletSafe(locale, ar ? item.exampleAr : item.exampleEn);
              return (
                <article key={`${page.id}-${item.termEn}`} className="rounded-xl bg-[#eef3fb] p-5 ring-1 ring-slate-300">
                  <div className="flex gap-3">
                    <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-white">
                      <TextbookArt art={termArt(title, body)} locale={locale} compact />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-extrabold text-[#0c2d6b]">{title}</p>
                      <p className="mt-2 text-base font-semibold leading-8 text-[#111827]">{body}</p>
                    </div>
                  </div>
                  {example ? (
                    <p className="mt-3 rounded-sm bg-[#fff4cc] px-3 py-2 text-base font-semibold leading-7 text-[#111827] ring-1 ring-amber-300">
                      <strong>{ar ? "مثال:" : "Example:"}</strong> {example}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}

        <p className="textbook-takeaway mt-6 rounded-sm bg-[#fff4cc] px-4 py-4 text-base font-bold leading-8 text-[#111827] ring-1 ring-amber-300">
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
