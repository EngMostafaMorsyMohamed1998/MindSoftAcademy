import type { MindNode } from "@/lib/mind-maps";
import type { Locale } from "@/lib/locale";

export function ChapterMindMap({
  locale,
  root,
  color,
  accent,
  hiddenId,
}: {
  locale: Locale;
  root: MindNode;
  color: string;
  accent: string;
  hiddenId?: string;
}) {
  return (
    <div className="space-y-3">
      <div
        className="rounded-3xl px-4 py-4 text-center text-white"
        style={{ background: color }}
      >
        <p className="font-serif text-xl">{locale === "ar" ? root.labelAr : root.labelEn}</p>
        {root.hintAr ? (
          <p className="mt-1 text-xs text-white/75">{locale === "ar" ? root.hintAr : root.hintEn}</p>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {root.children.map((branch) => (
          <article
            key={branch.id}
            className="rounded-3xl bg-white p-4 ring-1 ring-primary/10"
          >
            <h3 className="ink-brand text-sm font-semibold leading-6 break-words" style={{ color }}>
              {locale === "ar" ? branch.labelAr : branch.labelEn}
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {branch.children.map((leaf) => {
                const hidden = leaf.id === hiddenId;
                return (
                  <span
                    key={leaf.id}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      hidden ? "text-white" : "text-primary-dark"
                    }`}
                    style={{ background: hidden ? color : accent }}
                  >
                    {hidden ? "؟؟؟" : locale === "ar" ? leaf.labelAr : leaf.labelEn}
                  </span>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
