"use client";

import { Languages } from "lucide-react";
import { setLocale } from "@/app/actions/locale";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function LanguageToggle({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const next = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await setLocale(next);
        // A full reload avoids React 19 insertBefore crashes when <html dir>
        // flips between rtl and ltr during an RSC refresh.
        window.location.reload();
      }}
    >
      <Languages className="size-4" aria-hidden="true" />
      {t(locale, "language")}
    </button>
  );
}
