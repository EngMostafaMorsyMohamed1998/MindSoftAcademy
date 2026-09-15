import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function StudyProgress({
  locale,
  completed,
}: {
  locale: Locale;
  completed: Iterable<string>;
}) {
  const done = new Set(completed);
  const total = CHAPTERS.length;
  const count = CHAPTERS.filter((chapter) => done.has(chapter.id)).length;
  const pct = Math.round((count / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{t(locale, "progressLabel")}</span>
        <span className="text-foreground/65">
          {count} {t(locale, "of")} {total} · {pct}%
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary/10">
        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
