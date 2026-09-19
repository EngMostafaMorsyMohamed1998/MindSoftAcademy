"use client";

import type { MouseEvent } from "react";
import type { Locale } from "@/lib/locale";

export type NestKey = "ai" | "ml" | "dl" | "genai";

const NEST_TO_ART: Record<NestKey, string> = {
  ai: "ai",
  ml: "ml",
  dl: "neural",
  genai: "llm",
};

export function nestArt(key: NestKey): string {
  return NEST_TO_ART[key];
}

export function AiNestDiagram({
  locale,
  selected,
  onSelect,
}: {
  locale: Locale;
  selected?: string | null;
  onSelect?: (art: string) => void;
}) {
  const ar = locale === "ar";
  const pick = (key: NestKey) => (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onSelect?.(nestArt(key));
  };
  const active = (art: string) => (selected === art ? " ring-2 ring-white shadow-lg" : "");

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className={`nested-layer w-full max-w-[17rem] rounded-2xl bg-[#1e3a8a] p-4 text-center text-white shadow-md${active("ai")}`}
        onClick={pick("ai")}
      >
        <p className="text-xs font-extrabold tracking-wide text-blue-200">{ar ? "ذكاء اصطناعي" : "AI"}</p>
        <div
          className={`nested-layer mt-3 rounded-xl bg-[#2563eb] p-3.5${active("ml")}`}
          onClick={pick("ml")}
        >
          <p className="text-xs font-bold text-blue-50">{ar ? "تعلم آلي" : "Machine learning"}</p>
          <div
            className={`nested-layer mt-2.5 rounded-lg bg-[#3b82f6] p-2.5${active("neural")}`}
            onClick={pick("dl")}
          >
            <p className="text-xs font-semibold text-white">{ar ? "تعلم عميق" : "Deep learning"}</p>
            <div
              className={`nested-layer mt-2 rounded-md bg-[#f59e0b] px-2 py-2 text-xs font-extrabold text-slate-900${active("llm")}`}
              onClick={pick("genai")}
            >
              {ar ? "توليدي" : "Generative"}
            </div>
          </div>
        </div>
      </div>
      <p className="no-print mt-3 text-[11px] font-medium text-slate-400">
        {ar ? "اضغط أي طبقة عشان تتشاور الشرح" : "Click any layer to highlight the idea"}
      </p>
    </div>
  );
}
