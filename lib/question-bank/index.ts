import { CLEAR_GUIDES } from "@/lib/question-bank/clear-guides";
import { MORE_GUIDES } from "@/lib/question-bank/clear-guides-more";
import { clarifyAnalysis } from "@/lib/question-bank/guide";
import { CHAPTER_1_ANALYSIS, CHAPTER_1_FACTS } from "@/lib/question-bank/chapter-1";
import { CHAPTER_2_ANALYSIS, CHAPTER_2_FACTS } from "@/lib/question-bank/chapter-2";
import { CHAPTER_3_ANALYSIS, CHAPTER_3_FACTS } from "@/lib/question-bank/chapter-3";
import { CHAPTER_4_ANALYSIS, CHAPTER_4_FACTS } from "@/lib/question-bank/chapter-4";
import { CHAPTER_5_ANALYSIS, CHAPTER_5_FACTS } from "@/lib/question-bank/chapter-5";
import { CHAPTER_6_ANALYSIS, CHAPTER_6_FACTS } from "@/lib/question-bank/chapter-6";
import { CHAPTER_7_ANALYSIS, CHAPTER_7_FACTS } from "@/lib/question-bank/chapter-7";
import { expandNotesToHomework } from "@/lib/question-bank/expand";
import type { AnalysisPrompt, BankFact } from "@/lib/question-bank/types";

export const BANK_FACTS: BankFact[] = [
  ...CHAPTER_1_FACTS,
  ...CHAPTER_2_FACTS,
  ...CHAPTER_3_FACTS,
  ...CHAPTER_4_FACTS,
  ...CHAPTER_5_FACTS,
  ...CHAPTER_6_FACTS,
  ...CHAPTER_7_FACTS,
];

export const BANK_ANALYSIS: AnalysisPrompt[] = [
  ...CHAPTER_1_ANALYSIS,
  ...CHAPTER_2_ANALYSIS,
  ...CHAPTER_3_ANALYSIS,
  ...CHAPTER_4_ANALYSIS,
  ...CHAPTER_5_ANALYSIS,
  ...CHAPTER_6_ANALYSIS,
  ...CHAPTER_7_ANALYSIS,
].map((row) => clarifyAnalysis(row, CLEAR_GUIDES[row.id] ?? MORE_GUIDES[row.id]));

export const BANK_MCQ = expandNotesToHomework();

export function analysisForLesson(lessonId: string): AnalysisPrompt[] {
  return BANK_ANALYSIS.filter((row) => row.lessonId === lessonId);
}

export function analysisForChapter(chapterId: string): AnalysisPrompt[] {
  return BANK_ANALYSIS.filter((row) => row.chapterId === chapterId);
}

export function isOffSyllabusStory(text: string): boolean {
  return /عيادة|توك توك|غرق|رئة|canteen|tuk-tuk|flood|clinic|lung|WhatsApp|واتساب|تقرير مدرسي|school report|bakery/i.test(
    text,
  );
}

export function syllabusAnalysisForChapter(chapterId: string): AnalysisPrompt[] {
  return analysisForChapter(chapterId).filter(
    (row) => !isOffSyllabusStory(`${row.promptAr} ${row.promptEn} ${row.guideAr} ${row.guideEn}`),
  );
}
