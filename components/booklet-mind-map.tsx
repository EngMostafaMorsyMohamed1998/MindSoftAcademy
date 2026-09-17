import type { Locale } from "@/lib/locale";
import type { MindNode } from "@/lib/mind-maps";

export function BookletMindMap({
  locale,
  root,
  color,
  accent,
}: {
  locale: Locale;
  root: MindNode;
  color: string;
  accent: string;
}) {
  const ar = locale === "ar";
  return (
    <div className="print-keep rounded-3xl bg-white p-4 ring-1 ring-primary/10">
      <div className="rounded-2xl px-4 py-3 text-center text-white" style={{ background: color }}>
        <p className="font-semibold">{ar ? root.labelAr : root.labelEn}</p>
      </div>
      <div className="relative mx-auto mt-0 h-5 w-px" style={{ background: color }} />
      <div className="grid gap-3 sm:grid-cols-2">
        {root.children.map((branch) => (
          <div key={branch.id} className="rounded-2xl p-3" style={{ background: `${color}10` }}>
            <p className="text-sm font-semibold" style={{ color }}>
              {ar ? branch.labelAr : branch.labelEn}
            </p>
            <ul className="mt-2 space-y-1.5">
              {branch.children.map((leaf) => (
                <li
                  key={leaf.id}
                  className="rounded-xl px-2.5 py-1.5 text-xs font-medium leading-relaxed text-primary-dark"
                  style={{ background: accent }}
                >
                  {ar ? leaf.labelAr : leaf.labelEn}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
