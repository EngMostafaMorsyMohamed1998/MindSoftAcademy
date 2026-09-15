import { CHAPTERS, type ChapterId, isChapterId } from "@/lib/curriculum";
import { listExamChapterIds } from "@/lib/access-store";
import { getStudentSession } from "@/lib/student-session";

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
): boolean {
  const previous = previousChapterId(id);
  if (!previous) return true;
  return new Set(completed).has(previous);
}

export async function studentCompletedChapters(): Promise<ChapterId[]> {
  const student = await getStudentSession();
  if (!student) return [];
  const stored = await listExamChapterIds(student.id);
  return mergeCompleted(student.exams, stored);
}
