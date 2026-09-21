"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Download } from "lucide-react";
import type { Locale } from "@/lib/locale";

export type BookletLessonTab = {
  id: string;
  labelAr: string;
  labelEn: string;
  body: ReactNode;
};

export type BookletGroup = {
  id: string;
  labelAr: string;
  labelEn: string;
  lessons: BookletLessonTab[];
};

export function BookletViewer({
  locale,
  printLabel,
  downloadLabel,
  downloadingLabel,
  groups,
}: {
  locale: Locale;
  printLabel: string;
  downloadLabel: string;
  downloadingLabel: string;
  groups: BookletGroup[];
}) {
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const group = useMemo(() => groups.find((item) => item.id === groupId) ?? groups[0], [groups, groupId]);
  const [lessonId, setLessonId] = useState(group?.lessons[0]?.id ?? "");
  const lessons = group?.lessons ?? [];
  const activeId = lessons.some((item) => item.id === lessonId) ? lessonId : (lessons[0]?.id ?? "");
  const ar = locale === "ar";
  const [busy, setBusy] = useState(false);

  async function download() {
    if (busy || !activeId) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/booklet?lang=${locale}&chapter=${activeId}`);
      if (!response.ok) throw new Error("download");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        activeId.startsWith("assess-")
          ? ar
            ? `ملزمة-أداءات-${activeId.slice(7)}-MindSoft-2027.pdf`
            : `MindSoft-assessments-${activeId.slice(7)}-2027.pdf`
          : activeId === "faiz" || activeId === "faiz-hw"
          ? ar
            ? activeId === "faiz-hw"
              ? "ملزمة-واجب-الفائز-MindSoft-2027.pdf"
              : "ملزمة-الفائز-MindSoft-2027.pdf"
            : "MindSoft-faiz-2027.pdf"
          : activeId.startsWith("hw-")
            ? ar
              ? `ملزمة-واجب-الفصل-${activeId.slice(3)}-MindSoft-2027.pdf`
              : `MindSoft-homework-${activeId.slice(3)}-2027.pdf`
            : activeId.startsWith("f")
              ? ar
                ? `ملزمة-الفائز-${activeId}-MindSoft-2027.pdf`
                : `MindSoft-faiz-${activeId}-2027.pdf`
              : ar
                ? `ملزمة-الدرس-${activeId}-MindSoft-2027.pdf`
                : `MindSoft-lesson-${activeId}-2027.pdf`;
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
      <div className="booklet-tabs no-print mb-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {groups.map((item) => {
              const on = item.id === group?.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setGroupId(item.id);
                    setLessonId(item.lessons[0]?.id ?? "");
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    on ? "bg-primary text-white" : "bg-white text-primary ring-1 ring-primary/15"
                  }`}
                >
                  {ar ? item.labelAr : item.labelEn}
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
        {lessons.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {lessons.map((item) => {
              const on = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLessonId(item.id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                    on ? "bg-accent text-primary-dark" : "bg-white text-primary ring-1 ring-primary/15"
                  }`}
                >
                  {ar ? item.labelAr : item.labelEn}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      {lessons
        .filter((tab) => tab.id === activeId)
        .map((tab) => (
          <div key={tab.id} className="booklet-pane">
            {tab.body}
          </div>
        ))}
    </div>
  );
}
