"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function FlashCards({
  locale,
  cards,
}: {
  locale: Locale;
  cards: { term: string; meaning: string }[];
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];
  if (!card) return null;

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className="flex min-h-52 w-full flex-col items-center justify-center rounded-3xl bg-white p-8 text-center ring-1 ring-primary/10"
      >
        <p className="text-xs text-foreground/45">
          {index + 1} / {cards.length}
        </p>
        <p className="mt-3 font-serif text-2xl">{flipped ? card.meaning : card.term}</p>
        <p className="mt-4 text-sm text-primary">{t(locale, "flipCard")}</p>
      </button>
      <button
        type="button"
        onClick={() => {
          setFlipped(false);
          setIndex((value) => (value + 1) % cards.length);
        }}
        className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
      >
        {t(locale, "nextCard")}
      </button>
    </div>
  );
}
