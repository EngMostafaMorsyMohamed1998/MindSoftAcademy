"use client";

import { useState, type ReactNode } from "react";
import { Download } from "lucide-react";
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
  downloadLabel,
  downloadingLabel,
  tabs,
}: {
  locale: Locale;
  printLabel: string;
  downloadLabel: string;
  downloadingLabel: string;
  tabs: BookletTab[];
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "p1");
  const [busy, setBusy] = useState(false);
  const ar = locale === "ar";

  async function download() {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch("/api/booklet");
      if (!response.ok) throw new Error("download");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = ar ? "ملزمة-MindSoft-2027.pdf" : "MindSoft-booklet-2027.pdf";
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.alert(ar ? "التنزيل ما اكتملش. جرّب تاني." : "Download failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

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
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void download()}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-primary-dark disabled:opacity-60"
          >
            <Download className="size-4" />
            {busy ? downloadingLabel : downloadLabel}
          </button>
          <button
            type="button"
            className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white"
            onClick={() => window.print()}
          >
            {printLabel}
          </button>
        </div>
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} className={tab.id === active ? "booklet-pane" : "booklet-pane hidden print:block"}>
          {tab.body}
        </div>
      ))}
    </div>
  );
}
