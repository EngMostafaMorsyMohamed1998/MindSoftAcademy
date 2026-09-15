import {
  listExamChapterIds,
  listPassedHomework,
  listUnlocks,
} from "@/lib/access-store";
import { mergeCompleted, mergeIds } from "@/lib/chapter-progress";
import type { ChapterId } from "@/lib/curriculum";
import { getStudentSession } from "@/lib/student-session";

export async function studentProgress(): Promise<{
  completed: ChapterId[];
  unlocks: string[];
  homework: string[];
}> {
  const student = await getStudentSession();
  if (!student) return { completed: [], unlocks: [], homework: [] };
  const [storedExams, storedHomework, storedUnlocks] = await Promise.all([
    listExamChapterIds(student.id),
    listPassedHomework(student.id),
    listUnlocks(student.id),
  ]);
  return {
    completed: mergeCompleted(student.exams, storedExams),
    unlocks: mergeIds(student.unlocks, storedUnlocks),
    homework: mergeIds(student.homework, storedHomework),
  };
}

export async function studentCompletedChapters(): Promise<ChapterId[]> {
  return (await studentProgress()).completed;
}
