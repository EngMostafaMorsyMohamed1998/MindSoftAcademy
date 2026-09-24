"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/locale";

type FontScale = "md" | "lg" | "xl";

const SCALES: { id: FontScale; labelAr: string; labelEn: string; badge: string }[] = [
  { id: "md", labelAr: "حجم الخط: عادي", labelEn: "Font size: Normal", badge: "A" },
  { id: "lg", labelAr: "حجم الخط: كبير (+12%)", labelEn: "Font size: Large", badge: "A+" },
  { id: "xl", labelAr: "حجم الخط: كبير جداً (+25%)", labelEn: "Font size: Extra Large", badge: "A++" },
];

function applyScale(scale: FontScale) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("text-scale-lg", scale === "lg");
  root.classList.toggle("text-scale-xl", scale === "xl");
  if (scale === "lg") {
    root.style.fontSize = "112%";
  } else if (scale === "xl") {
    root.style.fontSize = "125%";
  } else {
    root.style.fontSize = "";
  }
}

export function FontScaleToggle({
  locale = "ar",
  className = "",
}: {
  locale?: Locale;
  className?: string;
}) {
  const [scale, setScale] = useState<FontScale>(() => {
    if (typeof window === "undefined") return "md";
    try {
      const saved = localStorage.getItem("mindsoft_font_scale") as FontScale | null;
      if (saved === "lg" || saved === "xl") return saved;
    } catch {
      // ignore
    }
    return "md";
  });

  useEffect(() => {
    applyScale(scale);
  }, [scale]);

  function cycle() {
    const next: FontScale = scale === "md" ? "lg" : scale === "lg" ? "xl" : "md";
    setScale(next);
    try {
      localStorage.setItem("mindsoft_font_scale", next);
    } catch {
      // ignore
    }
  }

  const current = SCALES.find((s) => s.id === scale) ?? SCALES[0];
  const ar = locale === "ar";

  return (
    <button
      type="button"
      onClick={cycle}
      className={className}
      title={ar ? current.labelAr : current.labelEn}
      aria-label={ar ? current.labelAr : current.labelEn}
    >
      <span className="font-bold tracking-tight text-xs" dir="ltr">
        {current.badge}
      </span>
    </button>
  );
}
