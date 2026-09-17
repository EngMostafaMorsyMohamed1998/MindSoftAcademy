import { bookletSafe, termArt } from "@/lib/booklet-lang";
import { BRAND } from "@/lib/brand";
import type { TextbookPage } from "@/lib/textbook-pages";
import type { Locale } from "@/lib/locale";

function PhotoArt({ art }: { art: string }) {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect width="320" height="200" fill="#e8eef6" />
      {art === "nest" || art === "ai" ? (
        <>
          <circle cx="160" cy="100" r="74" fill="#0c2d6b" />
          <circle cx="160" cy="100" r="50" fill="#1d4ed8" />
          <circle cx="160" cy="100" r="26" fill="#c4a35a" />
        </>
      ) : art === "lock" ? (
        <>
          <rect x="118" y="88" width="84" height="70" rx="10" fill="#7f1d1d" />
          <path d="M136 88v-16a24 24 0 0 1 48 0v16" fill="none" stroke="#111827" strokeWidth="10" />
          <circle cx="160" cy="122" r="7" fill="#fde68a" />
        </>
      ) : art === "firewall" ? (
        <>
          <rect x="40" y="40" width="70" height="44" rx="8" fill="#7f1d1d" />
          <rect x="210" y="40" width="70" height="44" rx="8" fill="#16a34a" />
          <rect x="70" y="110" width="180" height="56" rx="8" fill="#0c2d6b" />
          <path d="M110 84 L110 110 M210 84 L210 110" stroke="#334155" strokeWidth="4" />
        </>
      ) : art === "web" || art === "http" || art === "html" || art === "cloud" || art === "ux" ? (
        <>
          <rect x="36" y="28" width="248" height="144" rx="12" fill="#fff" stroke="#cbd5e1" />
          <rect x="36" y="28" width="248" height="30" fill="#0c2d6b" />
          <circle cx="54" cy="43" r="4" fill="#f87171" />
          <circle cx="68" cy="43" r="4" fill="#fbbf24" />
          <rect x="54" y="78" width="130" height="10" rx="4" fill="#94a3b8" />
          <rect x="54" y="100" width="210" height="8" rx="4" fill="#cbd5e1" />
          <rect x="54" y="118" width="180" height="8" rx="4" fill="#cbd5e1" />
        </>
      ) : art === "chart" || art === "regress" || art === "data" || art === "clean" || art === "sample" || art === "api" ? (
        <>
          <rect x="44" y="28" width="232" height="144" rx="10" fill="#fff" />
          <rect x="68" y="118" width="28" height="36" fill="#0c2d6b" />
          <rect x="110" y="94" width="28" height="60" fill="#1d4ed8" />
          <rect x="152" y="64" width="28" height="90" fill="#c4a35a" />
          <rect x="194" y="84" width="28" height="70" fill="#0c2d6b" />
          <line x1="60" y1="154" x2="248" y2="154" stroke="#94a3b8" strokeWidth="3" />
        </>
      ) : art === "neural" || art === "ml" || art === "llm" ? (
        <>
          <circle cx="78" cy="64" r="11" fill="#0c2d6b" />
          <circle cx="78" cy="136" r="11" fill="#0c2d6b" />
          <circle cx="160" cy="64" r="11" fill="#1d4ed8" />
          <circle cx="160" cy="100" r="11" fill="#1d4ed8" />
          <circle cx="160" cy="136" r="11" fill="#1d4ed8" />
          <circle cx="242" cy="100" r="11" fill="#c4a35a" />
          <line x1="78" y1="64" x2="160" y2="64" stroke="#64748b" strokeWidth="3" />
          <line x1="78" y1="136" x2="160" y2="136" stroke="#64748b" strokeWidth="3" />
          <line x1="160" y1="100" x2="242" y2="100" stroke="#64748b" strokeWidth="3" />
        </>
      ) : art === "ethics" ? (
        <>
          <rect x="150" y="36" width="20" height="128" fill="#0c2d6b" />
          <rect x="70" y="70" width="180" height="14" fill="#111827" />
          <rect x="64" y="50" width="54" height="36" fill="#c4a35a" />
          <rect x="202" y="50" width="54" height="36" fill="#7f1d1d" />
        </>
      ) : art === "incident" || art === "phish" || art === "fake" ? (
        <>
          <polygon points="160,36 250,164 70,164" fill="#f59e0b" />
          <rect x="152" y="78" width="16" height="48" fill="#111827" />
          <circle cx="160" cy="142" r="8" fill="#111827" />
        </>
      ) : (
        <>
          <rect x="24" y="40" width="34" height="118" fill="#334155" />
          <rect x="66" y="30" width="38" height="128" fill="#1e293b" />
          <rect x="112" y="46" width="34" height="112" fill="#334155" />
          <rect x="154" y="26" width="42" height="132" fill="#0f172a" />
          <rect x="204" y="50" width="34" height="108" fill="#334155" />
          <rect x="246" y="38" width="30" height="120" fill="#1e293b" />
          <rect x="0" y="164" width="320" height="36" fill="#94a3b8" />
        </>
      )}
    </svg>
  );
}

export function TextbookLesson({ locale, page }: { locale: Locale; page: TextbookPage }) {
  const ar = locale === "ar";
  const headers = ar ? page.headersAr : page.headersEn;
  const points = ar ? page.pointsAr : page.pointsEn;
  const colCount = headers.length;

  return (
    <article className="textbook-sheet mb-8 overflow-hidden rounded-sm bg-white ring-1 ring-zinc-200">
      <header className="textbook-head flex items-center justify-between bg-[#0c2d6b] px-4 py-2.5 text-white">
        <span className="text-sm font-bold">
          {ar ? "الدرس" : "Lesson"} {page.id}
        </span>
        <span className="text-sm font-semibold">{bookletSafe(locale, ar ? page.titleAr : page.titleEn)}</span>
      </header>

      <div className="px-4 py-5 sm:px-6">
        <p className="textbook-ask rounded-sm border border-amber-200 bg-[#fff8e8] px-3 py-3 text-[15px] font-semibold leading-8">
          <span className="textbook-ask-mark">{ar ? "؟؟" : "??"}</span>{" "}
          <span className="text-zinc-500">{ar ? "السؤال الرئيسي:" : "Main question:"}</span>{" "}
          {bookletSafe(locale, ar ? page.questionAr : page.questionEn)}
        </p>

        <div className="textbook-figure mt-5 grid items-start gap-4 sm:grid-cols-[200px_minmax(0,1fr)]">
          <figure className="overflow-hidden rounded-sm bg-zinc-100 ring-1 ring-zinc-200">
            {page.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={page.photo} alt={ar ? page.sectionAr : page.sectionEn} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="aspect-[4/3] w-full">
                <PhotoArt art={page.art} />
              </div>
            )}
          </figure>
          <div>
            <h4 className="text-[16px] font-bold text-zinc-900">
              <span className="me-2 inline-flex size-6 items-center justify-center rounded-full bg-[#0c2d6b] text-[11px] text-white">
                1
              </span>
              {bookletSafe(locale, ar ? page.sectionAr : page.sectionEn)}
            </h4>
            <p className="mt-2 text-sm leading-7 text-zinc-700">{bookletSafe(locale, ar ? page.introAr : page.introEn)}</p>
            {points.length ? (
              <ol className="mt-3 list-decimal space-y-1.5 ps-5 text-sm leading-7 text-zinc-700">
                {points.map((point) => (
                  <li key={point}>{bookletSafe(locale, point)}</li>
                ))}
              </ol>
            ) : null}
          </div>
        </div>

        {page.headersAr[0] === "المصطلح" || page.headersEn[0] === "Term" ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {page.rows.map((row, index) => {
              const term = bookletSafe(locale, ar ? (row.cellsAr[0] ?? "") : (row.cellsEn[0] ?? ""));
              const meaning = bookletSafe(locale, ar ? (row.cellsAr[1] ?? "") : (row.cellsEn[1] ?? ""));
              return (
                <div key={`${page.id}-term-${index}`} className="flex gap-3 rounded-2xl bg-[#f4f7fb] p-3 ring-1 ring-zinc-200">
                  <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-white">
                    <PhotoArt art={termArt(term, meaning)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#0c2d6b]">{term}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-700">{meaning}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <table className="textbook-table mt-5 w-full border-collapse text-sm">
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

        <p className="textbook-takeaway mt-5 rounded-sm bg-[#fff8e8] px-3 py-3 text-sm leading-7 ring-1 ring-amber-200">
          <strong>{ar ? "الخلاصة:" : "Takeaway:"}</strong> {bookletSafe(locale, ar ? page.takeawayAr : page.takeawayEn)}
        </p>
      </div>

      <footer className="textbook-foot flex items-center justify-between gap-3 border-t border-zinc-200 px-4 py-2">
        <span className="rounded-sm bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white">
          {ar ? "البكالوريا" : "Baccalaureate"}
        </span>
        <span className="text-xs font-semibold tracking-wide text-zinc-600" dir="ltr">
          {BRAND.phone}
        </span>
        <span className="text-xs text-zinc-500">{page.pageNo}</span>
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
