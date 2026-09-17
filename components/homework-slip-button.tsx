"use client";

import { printHomeworkSlips, type HomeworkSlip } from "@/lib/homework-slip";
import type { Locale } from "@/lib/locale";

export function HomeworkSlipButton({
  locale,
  slips,
  label,
}: {
  locale: Locale;
  slips: HomeworkSlip[];
  label: string;
}) {
  if (!slips.length) return null;
  return (
    <button
      type="button"
      onClick={() => printHomeworkSlips(locale, slips)}
      className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-primary-dark print:hidden"
    >
      {label}
    </button>
  );
}
