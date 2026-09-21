import { CHAPTERS, getLesson } from "@/lib/curriculum";
import { ASSESS_BOOK } from "@/lib/library";

/** PDF page numbers (1-based) for each part-1 lesson in the ministry assessments book. */
export const ASSESS_PAGES: Record<string, number[]> = {
  "1-1": [3, 4, 5, 6, 7, 8, 9],
  "1-2": [10, 11, 12, 13, 14, 15, 16],
  "1-3": [17, 18, 19, 20, 21, 22],
  "1-4": [23, 24, 25, 26, 27, 28, 29],
  "2-1": [30, 31, 32, 33, 34, 35],
  "2-2": [36, 37, 38, 39, 40, 41, 42],
  "2-3": [43, 44, 45, 46, 47],
  "3-1": [48, 49, 50, 51, 52],
  "3-2": [53, 54, 55, 56, 57],
  "3-3": [58, 59, 60, 61, 62],
  "4-1": [63, 64, 65, 66, 67],
  "4-2": [68, 69, 70, 71, 72, 73, 74],
  "4-3": [75, 76, 77, 78, 79, 80],
  "4-4": [81, 82, 83, 84, 85, 86],
};

export const ASSESS_SCOPE_PREFIX = "assess-";

export function part1LessonIds(): string[] {
  return CHAPTERS.filter((chapter) => chapter.part === 1).flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id));
}

export function assessmentsPages(lessonId: string): number[] {
  return ASSESS_PAGES[lessonId] ?? [];
}

export function assessLessonId(value: string | null | undefined): string | null {
  if (!value?.startsWith(ASSESS_SCOPE_PREFIX)) return null;
  const lessonId = value.slice(ASSESS_SCOPE_PREFIX.length);
  return ASSESS_PAGES[lessonId] ? lessonId : null;
}

export function assessScope(lessonId: string): string {
  return `${ASSESS_SCOPE_PREFIX}${lessonId}`;
}

export function isAssessScope(value: string | null | undefined): boolean {
  return Boolean(assessLessonId(value));
}

export function assessLessonTitle(lessonId: string): { titleAr: string; titleEn: string } {
  const lesson = getLesson(lessonId);
  return {
    titleAr: lesson?.titleAr ?? lessonId,
    titleEn: lesson?.titleEn ?? lessonId,
  };
}

export { ASSESS_BOOK };
