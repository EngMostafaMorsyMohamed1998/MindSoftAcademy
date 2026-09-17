"use client";

import { useState, type ReactNode } from "react";
import type { Locale } from "@/lib/locale";

export type BookletTab = {
  id: string;
  labelAr: string;
  labelEn: string;
  body: ReactNode;
};

export function BookletViewer({
  locale,
  printLabel,
  tabs,
}: {
  locale: Locale;
  printLabel: string;
  tabs: BookletTab[];
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "p1");
  const ar = locale === "ar";

  return (
    <div>
      <div className="booklet-tabs no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const on = tab.id === active;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  on ? "bg-primary text-white" : "bg-white text-primary ring-1 ring-primary/15"
                }`}
              >
                {ar ? tab.labelAr : tab.labelEn}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white"
          onClick={() => window.print()}
        >
          {printLabel}
        </button>
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} className={tab.id === active ? "booklet-pane" : "booklet-pane hidden print:block"}>
          {tab.body}
        </div>
      ))}
    </div>
  );
}
