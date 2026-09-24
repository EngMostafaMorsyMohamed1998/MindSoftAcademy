import { FontScaleToggle } from "@/components/font-scale-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Locale } from "@/lib/locale";
import type { Theme } from "@/lib/theme";

export function HeaderTools({
  locale,
  theme,
  contrast = "bar",
}: {
  locale: Locale;
  theme: Theme;
  contrast?: "bar" | "hero";
}) {
  const cls =
    contrast === "hero"
      ? "inline-flex size-10 items-center justify-center rounded-full border-2 border-white/40 bg-white/15 text-white hover:bg-white/25"
      : "inline-flex size-10 items-center justify-center rounded-full border-2 border-primary/20 bg-primary text-white shadow-sm hover:bg-primary-muted dark:border-accent/40 dark:bg-accent dark:text-primary-dark";

  return (
    <div className="flex items-center gap-2">
      <FontScaleToggle locale={locale} className={cls} />
      <ThemeToggle theme={theme} locale={locale} className={cls} />
      <LanguageToggle locale={locale} className={`${cls} w-auto gap-1.5 px-3 text-xs font-semibold`} />
    </div>
  );
}
