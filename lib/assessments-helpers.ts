export type AssessSection = "classroom" | "home" | "weekly-a" | "weekly-b" | "weekly-c";
export type AssessPeriod = 1 | 2 | 3;
export type AssessKind = "essay" | "mcq";

export type AssessQuestion = {
  id: string;
  lessonId: string;
  section: AssessSection;
  period: AssessPeriod;
  kind: AssessKind;
  promptAr: string;
  optionsAr?: string[];
  correctIndex?: number;
  guideAr?: string;
};

export type AssessBlock = {
  key: string;
  titleAr: string;
  period: AssessPeriod;
  section: AssessSection;
  essays: AssessQuestion[];
  mcq: AssessQuestion[];
};

export const SECTION_TITLE: Record<AssessSection, string> = {
  classroom: "أولاً: المهام الأدائية",
  home: "ثانيًا: أداءات منزلية",
  "weekly-a": "التقييمات الأسبوعية — النموذج (A)",
  "weekly-b": "التقييمات الأسبوعية — النموذج (B)",
  "weekly-c": "التقييمات الأسبوعية — النموذج (C)",
};

export function essay(
  id: string,
  lessonId: string,
  section: AssessSection,
  period: AssessPeriod,
  promptAr: string,
): AssessQuestion {
  return { id, lessonId, section, period, kind: "essay", promptAr };
}

export function mcq(
  id: string,
  lessonId: string,
  section: AssessSection,
  period: AssessPeriod,
  promptAr: string,
  optionsAr: string[],
): AssessQuestion {
  return { id, lessonId, section, period, kind: "mcq", promptAr, optionsAr };
}

export function applyKeys(
  rows: AssessQuestion[],
  mcqKey: Record<string, number>,
  essayGuide: Record<string, string>,
): AssessQuestion[] {
  return rows.map((row) =>
    row.kind === "mcq"
      ? { ...row, correctIndex: mcqKey[row.id] ?? 0 }
      : { ...row, guideAr: essayGuide[row.id] ?? "" },
  );
}
