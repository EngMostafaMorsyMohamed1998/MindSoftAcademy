"use client";

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

type LiveRow = {
  id: string;
  name: string;
  answered: boolean;
  correct: boolean | null;
  seconds: number | null;
};

type LiveState = {
  open: boolean;
  remaining: number;
  chapterId?: string;
  promptAr?: string;
  answered: number;
  correct: number;
  rows: LiveRow[];
};

export function SurpriseBoard({
  locale,
  initial,
}: {
  locale: Locale;
  initial: LiveState;
}) {
  const [live, setLive] = useState(initial);

  useEffect(() => {
    setLive(initial);
  }, [initial]);

  useEffect(() => {
    if (!initial.open && !initial.rows.length) return;
    let cancelled = false;
    async function pull() {
      try {
        const response = await fetch("/api/surprise/live", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as LiveState;
        if (!cancelled) setLive(body);
      } catch {
        // Keep the last snapshot if the poll fails.
      }
    }
    const id = window.setInterval(() => void pull(), 2000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [initial.open, initial.rows.length]);

  if (!live.chapterId && !live.rows.length) {
    return <p className="text-sm text-foreground/55">{t(locale, "surpriseNone")}</p>;
  }

  return (
    <div className="space-y-3">
      <p className={`text-sm font-semibold ${live.open ? "text-amber-700" : "text-foreground/70"}`}>
        {live.open
          ? `${t(locale, "surpriseOpen")} · ${live.remaining} ${t(locale, "surpriseSeconds")}`
          : t(locale, "surpriseLate")}
      </p>
      {live.promptAr ? <p className="text-sm leading-relaxed">{live.promptAr}</p> : null}
      <p className="text-xs text-foreground/60">
        {t(locale, "surpriseAnswered")} {live.answered} · {t(locale, "surpriseCorrect")} {live.correct}
      </p>
      <ul className="space-y-1">
        {live.rows.map((row) => (
          <li
            key={row.id}
            className={`flex items-center justify-between rounded-2xl px-3 py-2 text-sm ${
              row.answered ? "bg-emerald-50" : "bg-amber-50"
            }`}
          >
            <span className="font-medium">{row.name}</span>
            <span className="text-xs font-semibold">
              {row.answered
                ? `${t(locale, "surpriseAnswered")}${
                    row.seconds !== null ? ` · ${row.seconds}${t(locale, "surpriseSeconds")}` : ""
                  } · ${row.correct ? t(locale, "surpriseCorrect") : t(locale, "surpriseWrong")}`
                : t(locale, "surpriseWaiting")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
