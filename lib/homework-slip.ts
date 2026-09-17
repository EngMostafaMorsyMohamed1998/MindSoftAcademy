import { BRAND } from "@/lib/brand";
import type { Locale } from "@/lib/locale";

export type HomeworkSlip = {
  name: string;
  lessonId: string;
  lessonTitle: string;
  percent: number;
  score: number;
  total: number;
  date: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cardHtml(locale: Locale, slip: HomeworkSlip): string {
  const ar = locale === "ar";
  return `<section class="slip">
    <p class="brand">${escapeHtml(ar ? BRAND.nameAr : BRAND.nameEn)}</p>
    <p class="kicker">${escapeHtml(ar ? "قسيمة واجب" : "Homework slip")}</p>
    <h1>${escapeHtml(slip.name)}</h1>
    <p class="lesson">${escapeHtml(slip.lessonId)} · ${escapeHtml(slip.lessonTitle)}</p>
    <p class="score" dir="ltr">${slip.percent}% · ${slip.score}/${slip.total}</p>
    <p class="date">${escapeHtml(slip.date)}</p>
    <p class="teacher">${escapeHtml(ar ? BRAND.teacherAr : BRAND.teacherEn)}</p>
    <p class="stick">${escapeHtml(ar ? "الصق في الكراسة" : "Stick in the notebook")}</p>
  </section>`;
}

export function printHomeworkSlips(locale: Locale, slips: HomeworkSlip[]) {
  if (typeof window === "undefined" || !slips.length) return;
  const win = window.open("", "_blank", "noopener,noreferrer,width=720,height=640");
  if (!win) return;
  const ar = locale === "ar";
  win.document.write(`<!doctype html>
<html lang="${ar ? "ar" : "en"}" dir="${ar ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8">
  <title>${ar ? "قسيمة واجب" : "Homework slip"}</title>
  <style>
    @page { size: 90mm 55mm; margin: 4mm; }
    body { margin: 0; font-family: "Noto Naskh Arabic", "Cairo", "Georgia", serif; background: #fff; color: #0c2d6b; }
    .slip { page-break-after: always; border: 2px solid #c4a35a; padding: 10px 12px; min-height: 44mm; }
    .brand { margin: 0; font-size: 11px; letter-spacing: 0.04em; }
    .kicker { margin: 2px 0 0; font-size: 11px; color: #7a5a1a; }
    h1 { margin: 8px 0 0; font-size: 20px; }
    .lesson, .date, .teacher, .stick { margin: 4px 0 0; font-size: 12px; }
    .score { margin: 8px 0 0; font-size: 22px; font-weight: 700; }
    .stick { margin-top: 8px; font-weight: 700; }
  </style>
</head>
<body>${slips.map((row) => cardHtml(locale, row)).join("")}</body>
</html>`);
  win.document.close();
  win.focus();
  win.print();
}
