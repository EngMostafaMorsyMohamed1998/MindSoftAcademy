import type { TextbookPage } from "@/lib/textbook-pages";
import type { Locale } from "@/lib/locale";

function PhotoArt({ art }: { art: string }) {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
      <rect width="320" height="220" fill="#dbe4f0" />
      {art === "nest" ? (
        <>
          <circle cx="160" cy="110" r="78" fill="#0c2d6b" />
          <circle cx="160" cy="110" r="54" fill="#1d4ed8" />
          <circle cx="160" cy="110" r="28" fill="#c4a35a" />
        </>
      ) : art === "lock" ? (
        <>
          <rect x="110" y="90" width="100" height="80" rx="10" fill="#7f1d1d" />
          <path d="M130 90v-18a30 30 0 0 1 60 0v18" fill="none" stroke="#111827" strokeWidth="10" />
        </>
      ) : art === "web" || art === "http" || art === "html" ? (
        <>
          <rect x="40" y="36" width="240" height="148" rx="10" fill="#fff" />
          <rect x="40" y="36" width="240" height="28" fill="#0c2d6b" />
          <rect x="56" y="80" width="120" height="10" rx="4" fill="#94a3b8" />
          <rect x="56" y="102" width="200" height="8" rx="4" fill="#cbd5e1" />
          <rect x="56" y="120" width="180" height="8" rx="4" fill="#cbd5e1" />
        </>
      ) : art === "chart" || art === "regress" || art === "data" || art === "clean" ? (
        <>
          <rect x="50" y="40" width="220" height="140" rx="8" fill="#fff" />
          <rect x="70" y="120" width="28" height="40" fill="#0c2d6b" />
          <rect x="112" y="96" width="28" height="64" fill="#1d4ed8" />
          <rect x="154" y="70" width="28" height="90" fill="#c4a35a" />
          <rect x="196" y="88" width="28" height="72" fill="#0c2d6b" />
        </>
      ) : art === "neural" || art === "ml" || art === "llm" ? (
        <>
          <circle cx="80" cy="70" r="12" fill="#0c2d6b" />
          <circle cx="80" cy="150" r="12" fill="#0c2d6b" />
          <circle cx="160" cy="70" r="12" fill="#1d4ed8" />
          <circle cx="160" cy="110" r="12" fill="#1d4ed8" />
          <circle cx="160" cy="150" r="12" fill="#1d4ed8" />
          <circle cx="240" cy="110" r="12" fill="#c4a35a" />
          <line x1="80" y1="70" x2="160" y2="70" stroke="#64748b" />
          <line x1="80" y1="150" x2="160" y2="150" stroke="#64748b" />
          <line x1="160" y1="110" x2="240" y2="110" stroke="#64748b" />
        </>
      ) : (
        <>
          <rect x="28" y="50" width="36" height="130" fill="#334155" />
          <rect x="72" y="40" width="40" height="140" fill="#1e293b" />
          <rect x="120" y="56" width="36" height="124" fill="#334155" />
          <rect x="168" y="36" width="44" height="144" fill="#0f172a" />
          <rect x="220" y="60" width="36" height="120" fill="#334155" />
          <rect x="264" y="48" width="32" height="132" fill="#1e293b" />
          <rect x="0" y="180" width="320" height="40" fill="#94a3b8" />
        </>
      )}
    </svg>
  );
}

export function TextbookLesson({ locale, page }: { locale: Locale; page: TextbookPage }) {
  const ar = locale === "ar";
  const headers = ar ? page.headersAr : page.headersEn;
  return (
    <article className="textbook-sheet mb-10 bg-white px-4 py-6 sm:px-8">
      <p className="text-center text-[13px] text-zinc-500">
        {ar ? "الدرس" : "Lesson"} {page.id} {ar ? page.titleAr : page.titleEn}
      </p>

      <p className="textbook-ask mt-8 text-[15px] font-semibold leading-8">
        <span className="textbook-ask-mark ms-1" aria-hidden>
          ؟؟
        </span>{" "}
        <span className="text-zinc-500">{ar ? "السؤال الرئيسي:" : "Main question:"}</span>{" "}
        {ar ? page.questionAr : page.questionEn}
      </p>

      <div className="mt-8 grid items-start gap-6 sm:grid-cols-[220px_minmax(0,1fr)]">
        <figure className="overflow-hidden rounded-md bg-zinc-100 shadow-sm ring-1 ring-zinc-200">
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
          <h4 className="text-[17px] font-bold text-zinc-900">
            <span className="me-2 inline-flex size-6 items-center justify-center rounded-full bg-zinc-900 text-[12px] text-white">
              1
            </span>
            {ar ? page.sectionAr : page.sectionEn}
          </h4>
          <p className="mt-3 text-sm leading-8 text-zinc-700">{ar ? page.introAr : page.introEn}</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="textbook-table w-full border-collapse text-sm">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {page.rows.map((row, index) => (
              <TextbookRows
                key={`${page.id}-${index}`}
                cells={ar ? row.cellsAr : row.cellsEn}
                example={ar ? row.exampleAr : row.exampleEn}
              />
            ))}
          </tbody>
        </table>
      </div>

      <footer className="textbook-foot mt-8 flex items-center justify-between">
        <span className="rounded-sm bg-emerald-600 px-4 py-1 text-xs font-semibold text-white">
          {ar ? "البكالوريا" : "Baccalaureate"}
        </span>
        <span className="text-sm text-zinc-500">{page.pageNo}</span>
      </footer>
    </article>
  );
}

function TextbookRows({ cells, example }: { cells: string[]; example?: string }) {
  return (
    <>
      <tr>
        {cells.map((cell) => (
          <td key={cell}>{cell}</td>
        ))}
      </tr>
      {example ? (
        <tr className="textbook-example">
          <td colSpan={3}>{example}</td>
        </tr>
      ) : null}
    </>
  );
}
