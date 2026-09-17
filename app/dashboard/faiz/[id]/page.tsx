import Link from "next/link";
import { notFound } from "next/navigation";
import { FAIZ_NOTES, getFaizNote, isFaizUnitId } from "@/lib/faiz-notes";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function FaizUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isFaizUnitId(id)) notFound();
  const note = getFaizNote(id);
  if (!note) notFound();
  const locale = await getLocale();
  const ar = locale === "ar";
  const index = FAIZ_NOTES.findIndex((row) => row.id === note.id);
  const prev = index > 0 ? FAIZ_NOTES[index - 1] : undefined;
  const next = index >= 0 && index < FAIZ_NOTES.length - 1 ? FAIZ_NOTES[index + 1] : undefined;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href="/dashboard/faiz" className="text-sm font-medium text-primary">
        {t(locale, "back")}
      </Link>
      <p className="mt-4 text-xs font-semibold text-primary/60">{t(locale, "faizTitle")}</p>
      <h1 className="mt-1 font-serif text-3xl">{ar ? note.titleAr : note.titleEn}</h1>

      <div className="mt-6 space-y-5">
        {note.sections.map((section) => (
          <article key={section.headingAr} className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <h2 className="text-lg font-semibold">{ar ? section.headingAr : section.headingEn}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/80">
              {(ar ? section.bodyAr : section.bodyEn).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-primary/10">
        <h2 className="text-lg font-semibold">{t(locale, "keyTerms")}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {(ar ? note.termsAr : note.termsEn).map((term) => (
            <li key={term.term} className="rounded-2xl bg-primary/5 px-3 py-2">
              <span className="font-semibold">{term.term}</span>
              <span className="text-foreground/70"> — {term.meaning}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 rounded-3xl bg-accent/15 px-4 py-3 text-sm font-medium">
        {t(locale, "takeaway")}: {ar ? note.takeawayAr : note.takeawayEn}
      </p>

      <nav className="mt-6 flex flex-wrap justify-between gap-3 text-sm font-semibold text-primary">
        {prev ? (
          <Link href={`/dashboard/faiz/${prev.id}`}>{ar ? prev.titleAr : prev.titleEn}</Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/dashboard/faiz/${next.id}`}>{ar ? next.titleAr : next.titleEn}</Link>
        ) : null}
      </nav>
    </div>
  );
}
