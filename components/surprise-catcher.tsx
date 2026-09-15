"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Zap } from "lucide-react";
import { TrueFalsePick } from "@/components/true-false-pick";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

type SurpriseState = {
  open: boolean;
  id?: string;
  kind?: "mcq" | "tf";
  prompt?: string;
  options?: string[];
  remaining?: number;
  answered?: boolean;
  choice?: number;
};

export function SurpriseCatcher({ locale }: { locale: Locale }) {
  const [state, setState] = useState<SurpriseState>({ open: false });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function pull() {
      try {
        const response = await fetch("/api/surprise", { cache: "no-store" });
        const body = (await response.json()) as SurpriseState;
        if (!cancelled) setState(body);
      } catch {
        if (!cancelled) setState({ open: false });
      }
    }
    void pull();
    const id = window.setInterval(() => void pull(), 2000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  async function pick(choice: number) {
    if (!state.open || state.answered || pending) return;
    setPending(true);
    try {
      const response = await fetch("/api/surprise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      });
      if (response.ok) {
        setState((prev) => ({ ...prev, answered: true, choice }));
      }
    } finally {
      setPending(false);
    }
  }

  if (!state.open || !state.prompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary-dark/70 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
        <p className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700">
          <Zap className="size-4" />
          {t(locale, "surpriseTitle")}
          <span className="tabular-nums" dir="ltr">
            {state.remaining ?? 0}s
          </span>
        </p>
        <h2 className="mt-2 font-serif text-xl leading-snug">{state.prompt}</h2>
        {state.answered ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-3 py-3 text-sm font-semibold text-emerald-800">
            {t(locale, "surpriseSent")}
          </p>
        ) : state.kind === "tf" ? (
          <TrueFalsePick locale={locale} value={state.choice} disabled={pending} onChange={(index) => void pick(index)} />
        ) : (
          <div className="mt-3 grid gap-2">
            {(state.options ?? []).map((option, index) => (
              <button
                key={`${state.id}-${index}`}
                type="button"
                disabled={pending}
                onClick={() => void pick(index)}
                className="rounded-2xl bg-primary/5 px-3 py-3 text-start text-sm font-semibold ring-1 ring-primary/15 disabled:opacity-60"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {pending ? (
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-primary/70">
            <LoaderCircle className="size-3.5 animate-spin" />
          </p>
        ) : null}
      </div>
    </div>
  );
}
