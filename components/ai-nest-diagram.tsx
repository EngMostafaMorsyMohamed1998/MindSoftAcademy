"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import type { Locale } from "@/lib/locale";

export type NestKey = "ai" | "ml" | "dl" | "genai";

const NEST_TO_TERM: Record<NestKey, string> = {
  ai: "AI",
  ml: "Machine learning",
  dl: "Deep learning",
  genai: "Generative AI",
};

const NEST_PARENT: Record<NestKey, NestKey | null> = {
  ai: null,
  ml: "ai",
  dl: "ml",
  genai: "dl",
};

export function AiNestDiagram({
  locale,
  selected,
  onSelect,
}: {
  locale: Locale;
  selected?: string | null;
  onSelect?: (term: string) => void;
}) {
  const ar = locale === "ar";
  const [hovered, setHovered] = useState<NestKey | null>(null);
  const pick = (key: NestKey) => (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onSelect?.(NEST_TO_TERM[key]);
  };
  const enter = (key: NestKey) => (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setHovered(key);
  };
  const leave = (key: NestKey) => () => {
    setHovered(NEST_PARENT[key]);
  };
  const ring = (key: NestKey) =>
    `${hovered === key ? " is-hovered" : ""}${selected === NEST_TO_TERM[key] ? " ring-2 ring-white shadow-lg" : ""}`;
  const keys = (key: NestKey) => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-pressed": selected === NEST_TO_TERM[key],
    "aria-label": ar
      ? key === "ai"
        ? "ذكاء اصطناعي"
        : key === "ml"
          ? "تعلم آلي"
          : key === "dl"
            ? "تعلم عميق"
            : "ذكاء توليدي"
      : NEST_TO_TERM[key],
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect?.(NEST_TO_TERM[key]);
      }
    },
  });

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className={`nested-layer w-full max-w-[17rem] rounded-2xl bg-[#1e3a8a] p-4 text-center text-white shadow-md${ring("ai")}`}
        onClick={pick("ai")}
        onMouseEnter={enter("ai")}
        onMouseLeave={leave("ai")}
        {...keys("ai")}
      >
        <p className="text-xs font-extrabold leading-5 text-blue-100">{ar ? "ذكاء اصطناعي" : "AI"}</p>
        <div
          className={`nested-layer mt-3 rounded-xl bg-[#2563eb] p-3.5${ring("ml")}`}
          onClick={pick("ml")}
          onMouseEnter={enter("ml")}
          onMouseLeave={leave("ml")}
          {...keys("ml")}
        >
          <p className="text-xs font-bold leading-5 text-white">{ar ? "تعلم آلي" : "Machine learning"}</p>
          <div
            className={`nested-layer mt-2.5 rounded-lg bg-[#3b82f6] p-2.5${ring("dl")}`}
            onClick={pick("dl")}
            onMouseEnter={enter("dl")}
            onMouseLeave={leave("dl")}
            {...keys("dl")}
          >
            <p className="text-xs font-semibold leading-5 text-white">{ar ? "تعلم عميق" : "Deep learning"}</p>
            <div
              className={`nested-layer mt-2 rounded-md bg-[#f59e0b] px-2 py-2 text-xs font-extrabold leading-5 text-slate-950${ring("genai")}`}
              onClick={pick("genai")}
              onMouseEnter={enter("genai")}
              onMouseLeave={leave("genai")}
              {...keys("genai")}
            >
              {ar ? "توليدي" : "Generative"}
            </div>
          </div>
        </div>
      </div>
      <p className="no-print mt-3 text-[11px] font-medium leading-5 text-slate-600">
        {ar ? "اضغط أي طبقة عشان تتشاور الشرح" : "Click any layer to highlight the idea"}
      </p>
    </div>
  );
}
