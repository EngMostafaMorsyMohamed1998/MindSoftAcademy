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
  promptEn?: string;
  optionsAr?: string[];
  optionsEn?: string[];
  correctIndex?: number;
  guideAr?: string;
  guideEn?: string;
};

export type AssessBlock = {
  key: string;
  titleAr: string;
  titleEn: string;
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

export const SECTION_TITLE_EN: Record<AssessSection, string> = {
  classroom: "First: Classroom performance tasks",
  home: "Second: Home performances",
  "weekly-a": "Weekly assessments — Form (A)",
  "weekly-b": "Weekly assessments — Form (B)",
  "weekly-c": "Weekly assessments — Form (C)",
};

export type AssessEnText = {
  prompt: string;
  options?: string[];
  guide?: string;
};

export function applyEnglish(
  rows: AssessQuestion[],
  en: Record<string, AssessEnText>,
): AssessQuestion[] {
  return rows.map((row) => {
    const text = en[row.id];
    if (!text) return row;
    return {
      ...row,
      promptEn: text.prompt,
      optionsEn: text.options ?? row.optionsEn,
      guideEn: text.guide ?? row.guideEn,
    };
  });
}

export function assessPrompt(row: AssessQuestion, locale: "ar" | "en"): string {
  return locale === "en" ? row.promptEn || row.promptAr : row.promptAr;
}

export function assessOptions(row: AssessQuestion, locale: "ar" | "en"): string[] {
  if (locale === "en" && row.optionsEn?.length) return row.optionsEn;
  return row.optionsAr ?? [];
}

export function assessGuide(row: AssessQuestion, locale: "ar" | "en"): string {
  return locale === "en" ? row.guideEn || row.guideAr || "" : row.guideAr || "";
}

export function periodLabel(period: AssessPeriod, locale: "ar" | "en"): string {
  if (locale === "en") {
    if (period === 1) return "Period 1";
    if (period === 2) return "Period 2";
    return "Period 3";
  }
  if (period === 1) return "الفترة الأولى";
  if (period === 2) return "الفترة الثانية";
  return "الفترة الثالثة";
}

export function sectionTitle(section: AssessSection, locale: "ar" | "en"): string {
  return locale === "en" ? SECTION_TITLE_EN[section] : SECTION_TITLE[section];
}

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
