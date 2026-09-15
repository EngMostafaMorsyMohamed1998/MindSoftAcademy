import type { ChapterId } from "@/lib/curriculum";

export type BankFact = {
  id: string;
  lessonId: string;
  chapterId: ChapterId;
  sceneAr: string;
  sceneEn: string;
  claimAr: string;
  claimEn: string;
  whyAr: string;
  whyEn: string;
  termAr: string;
  termEn: string;
  wrongAr: [string, string, string];
  wrongEn: [string, string, string];
};

export type AnalysisPrompt = {
  id: string;
  lessonId: string;
  chapterId: ChapterId;
  promptAr: string;
  promptEn: string;
  guideAr: string;
  guideEn: string;
};
