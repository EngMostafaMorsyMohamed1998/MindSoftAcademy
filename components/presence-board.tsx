"use client";

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

type LiveRow = {
  id: string;
  name: string;
  screen: "exam" | "game" | "elsewhere" | "away";
  detail: string;
};

type LiveState = {
  exam: number;
  game: number;
  elsewhere: number;
  away: number;
  rows: LiveRow[];
};

const empty: LiveState = { exam: 0, game: 0, elsewhere: 0, away: 0, rows: [] };

export function PresenceBoard({ locale, initial }: { locale: Locale; initial?: LiveState }) {
  const [live, setLive] = useState(initial ?? empty);

  useEffect(() => {
    if (initial) setLive(initial);
  }, [initial]);

  useEffect(() => {
    let cancelled = false;
    async function pull() {
      try {
        const response = await fetch("/api/presence/live", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as LiveState;
        if (!cancelled) setLive(body);
      } catch {
        // Keep the last snapshot if the poll fails.
      }
    }
    void pull();
    const id = window.setInterval(() => void pull(), 4000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const groups: { key: LiveRow["screen"]; label: string; tone: string }[] = [
    { key: "game", label: t(locale, "presenceGame"), tone: "bg-amber-50 text-amber-900" },
    { key: "exam", label: t(locale, "presenceExam"), tone: "bg-emerald-50 text-emerald-900" },
    { key: "elsewhere", label: t(locale, "presenceElse"), tone: "bg-primary/5 text-primary-dark" },
    { key: "away", label: t(locale, "presenceAway"), tone: "bg-stone-100 text-stone-600" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs text-foreground/60">
        {t(locale, "presenceGame")} {live.game} · {t(locale, "presenceExam")} {live.exam} ·{" "}
        {t(locale, "presenceElse")} {live.elsewhere} · {t(locale, "presenceAway")} {live.away}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {groups.map((group) => {
          const rows = live.rows.filter((row) => row.screen === group.key);
          return (
            <div key={group.key} className={`rounded-2xl p-3 ${group.tone}`}>
              <p className="text-xs font-semibold">
                {group.label} · {rows.length}
              </p>
              {rows.length === 0 ? (
                <p className="mt-2 text-xs opacity-70">—</p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {rows.map((row) => (
                    <li key={row.id} className="text-sm font-medium">
                      {row.name}
                      {row.detail ? <span className="ms-1 text-xs font-normal opacity-70">{row.detail}</span> : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
