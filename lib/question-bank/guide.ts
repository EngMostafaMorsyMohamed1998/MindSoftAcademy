import { LESSON_NOTES } from "@/lib/lessons";
import type { AnalysisPrompt } from "@/lib/question-bank/types";

export function analysisGuide(
  termAr: string,
  reasonAr: string,
  exampleAr: string,
  termEn: string,
  reasonEn: string,
  exampleEn: string,
): { guideAr: string; guideEn: string } {
  return {
    guideAr: `المصطلح: ${termAr}\nالسبب: ${reasonAr}\nالمثال: ${exampleAr}`,
    guideEn: `Term: ${termEn}\nReason: ${reasonEn}\nExample: ${exampleEn}`,
  };
}

function prettyAr(text: string): string {
  const next = text.trim();
  if (next.includes("المصطلح:") && next.includes("السبب:")) {
    return next
      .replace(/\s*السبب:\s*/g, "\nالسبب: ")
      .replace(/\s*مثال مدرسي:\s*/g, "\nالمثال: ")
      .replace(/\s*المثال:\s*/g, "\nالمثال: ")
      .replace(/\.\n/g, "\n")
      .trim();
  }
  return next;
}

function prettyEn(text: string): string {
  const next = text.trim();
  if (/^Term:/i.test(next) && /Reason:/i.test(next)) {
    return next
      .replace(/\s*Reason:\s*/gi, "\nReason: ")
      .replace(/\s*School example:\s*/gi, "\nExample: ")
      .replace(/\s*Example:\s*/gi, "\nExample: ")
      .trim();
  }
  return next;
}

function termFor(row: AnalysisPrompt): { ar: string; en: string } {
  const note = LESSON_NOTES.find((item) => item.id === row.lessonId);
  const hay = `${row.promptAr} ${row.guideAr}`;
  if (note) {
    const index = note.termsAr.findIndex((item) => hay.includes(item.term));
    if (index >= 0) {
      return { ar: note.termsAr[index]!.term, en: note.termsEn[index]?.term ?? note.termsAr[index]!.term };
    }
  }
  return { ar: "مصطلح الدرس", en: "Lesson term" };
}

function asReasonAr(text: string): string {
  return text
    .replace(/^(اربط|بيّن|اذكر|اشرح|وضّح|اقترح|اجعل|استخدم|حدّد|اقرأ|قدّم|صف|فرّق|احسب|انتقد)\s+/g, "")
    .replace(/^(Tie|Show|Name|Explain|Propose|State|Note|Ask|Compare|Critique)\s+/i, "")
    .trim();
}

export function clarifyAnalysis(row: AnalysisPrompt, extra?: { guideAr: string; guideEn: string }): AnalysisPrompt {
  if (extra) return { ...row, guideAr: extra.guideAr, guideEn: extra.guideEn };
  const ar = prettyAr(row.guideAr);
  const en = prettyEn(row.guideEn);
  if (ar.includes("المصطلح:") && ar.includes("السبب:")) {
    return { ...row, guideAr: ar, guideEn: en.includes("Term:") ? en : prettyEn(row.guideEn) };
  }
  const term = termFor(row);
  return {
    ...row,
    guideAr: `المصطلح: ${term.ar}\nالسبب: ${asReasonAr(row.guideAr)}\nالمثال: ${row.promptAr.replace(/^(حلّل|قارن|انتقد|اشرح)\s+/g, "")}`,
    guideEn: `Term: ${term.en}\nReason: ${asReasonAr(row.guideEn)}\nExample: ${row.promptEn.replace(/^(Analyse|Compare|Critique|Explain)\s+/gi, "")}`,
  };
}
