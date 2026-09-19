import type { ExamSubmission, HomeworkResult } from "@/lib/access-store";

export function pointsFromResults(
  studentId: string,
  homework: HomeworkResult[],
  exams: ExamSubmission[],
): number {
  const hwByLesson = new Map<string, HomeworkResult>();
  for (const row of homework) {
    if (row.studentId !== studentId || !row.passed) continue;
    const prev = hwByLesson.get(row.lessonId);
    if (!prev || row.submittedAt > prev.submittedAt) hwByLesson.set(row.lessonId, row);
  }
  const exByChapter = new Map<string, ExamSubmission>();
  for (const row of exams) {
    if (row.studentId !== studentId) continue;
    const prev = exByChapter.get(row.chapterId);
    if (!prev || row.submittedAt > prev.submittedAt) exByChapter.set(row.chapterId, row);
  }
  const hw = [...hwByLesson.values()].reduce((sum, row) => sum + Math.max(0, row.score), 0);
  const ex = [...exByChapter.values()].reduce((sum, row) => sum + Math.max(0, row.objectiveScore), 0);
  return hw + ex;
}

export function displayPoints(
  stored: number,
  studentId: string,
  homework: HomeworkResult[],
  exams: ExamSubmission[],
): number {
  const safe = Number.isFinite(stored) ? Math.max(0, stored) : 0;
  return Math.max(safe, pointsFromResults(studentId, homework, exams));
}
