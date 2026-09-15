"use client";

import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function TrueFalsePick({
  locale,
  value,
  disabled,
  onChange,
}: {
  locale: Locale;
  value?: number;
  disabled?: boolean;
  onChange: (index: number) => void;
}) {
  return (
    <div className="mt-2 grid gap-2">
      {[
        { index: 0, label: t(locale, "trueLabel") },
        { index: 1, label: t(locale, "falseLabel") },
      ].map((choice) => {
        const selected = value === choice.index;
        return (
          <button
            key={choice.index}
            type="button"
            disabled={disabled}
            onClick={() => onChange(choice.index)}
            className={`h-12 rounded-xl text-base font-semibold ring-1 ${
              selected
                ? "bg-primary text-white ring-primary"
                : "bg-white text-foreground ring-primary/15"
            } disabled:cursor-default`}
          >
            {choice.label}
          </button>
        );
      })}
    </div>
  );
}
