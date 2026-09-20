import type { ChapterId } from "@/lib/curriculum";

export type ExtraHomework = {
  id: string;
  lessonId: string;
  chapterId: ChapterId;
  kind: "mcq" | "tf";
  promptAr: string;
  promptEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
};

/** Off-syllabus scene questions are not used. Drills come from lesson notes only. */
export const EXTRA_HOMEWORK: ExtraHomework[] = [];
