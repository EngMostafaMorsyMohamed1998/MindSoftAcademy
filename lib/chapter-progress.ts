import { CHAPTERS, type ChapterId, isChapterId } from "@/lib/curriculum";

export const EXAM_PASS_RATIO = 0.7;

export function passedObjective(score: number, total: number): boolean {
  if (total <= 0) return false;
  return score / total >= EXAM_PASS_RATIO;
}

export function previousChapterId(id: ChapterId): ChapterId | null {
  const index = CHAPTERS.findIndex((chapter) => chapter.id === id);
  if (index <= 0) return null;
  return CHAPTERS[index - 1]!.id;
}

export function nextChapterId(id: ChapterId): ChapterId | null {
  const index = CHAPTERS.findIndex((chapter) => chapter.id === id);
  if (index < 0 || index >= CHAPTERS.length - 1) return null;
  return CHAPTERS[index + 1]!.id;
}

export function mergeIds(...lists: Array<Iterable<string> | undefined>): string[] {
  const found = new Set<string>();
  for (const list of lists) {
    if (!list) continue;
    for (const id of list) found.add(id);
  }
  return [...found];
}

export function mergeCompleted(
  ...lists: Array<Iterable<string> | undefined>
): ChapterId[] {
  const found = new Set<ChapterId>();
  for (const list of lists) {
    if (!list) continue;
    for (const id of list) {
      if (isChapterId(id)) found.add(id);
    }
  }
  return CHAPTERS.map((chapter) => chapter.id).filter((id) => found.has(id));
}

export function isChapterUnlocked(
  completed: Iterable<string>,
  id: ChapterId,
  unlocks: Iterable<string> = [],
): boolean {
  if (new Set(unlocks).has(id)) return true;
  const previous = previousChapterId(id);
  if (!previous) return true;
  return new Set(completed).has(previous);
}

export function chapterHomeworkDone(
  chapterId: ChapterId,
  homeworkLessons: Iterable<string>,
): boolean {
  const chapter = CHAPTERS.find((item) => item.id === chapterId);
  if (!chapter) return false;
  const done = new Set(homeworkLessons);
  return chapter.lessons.every((lesson) => done.has(lesson.id));
}

export function allChaptersPassed(completed: Iterable<string>): boolean {
  const set = new Set(completed);
  return CHAPTERS.every((chapter) => set.has(chapter.id));
}
