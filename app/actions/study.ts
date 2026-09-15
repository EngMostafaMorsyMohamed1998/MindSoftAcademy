"use server";

import { randomBytes } from "crypto";
import { addPoints, latestExam, listExamChapterIds, saveExam } from "@/lib/access-store";
import {
  isChapterUnlocked,
  mergeCompleted,
} from "@/lib/chapter-progress";
import { examForChapter, objectiveTotal } from "@/lib/exams";
import { getLocale } from "@/lib/locale";
import { getStudentSession, setStudentCookie } from "@/lib/student-session";
import { gameForChapter } from "@/lib/games";
import type { ChapterId } from "@/lib/curriculum";

export async function awardGameXp(chapterId: ChapterId): Promise<number> {
  const student = await getStudentSession();
  if (!student) return 0;
  const game = gameForChapter(chapterId);
  if (!game) return student.points;
  return addPoints(student.id, game.xp);
}

export async function submitChapterExam(input: {
  chapterId: ChapterId;
  objectiveAnswers: Record<string, number>;
  essayAnswers: Record<string, string>;
}): Promise<{ objectiveScore: number; objectiveTotal: number; id: string } | { error: string }> {
  const student = await getStudentSession();
  const exam = examForChapter(input.chapterId);
  if (!exam) return { error: "NO_EXAM" };
  if (student) {
    const completed = mergeCompleted(
      student.exams,
      await listExamChapterIds(student.id),
    );
    if (!isChapterUnlocked(completed, input.chapterId)) {
      return { error: "LOCKED" };
    }
  }

  let objectiveScore = 0;
  for (const question of exam.objectives) {
    if (input.objectiveAnswers[question.id] === question.correctIndex) {
      objectiveScore += question.points;
    }
  }

  const locale = await getLocale();
  const id = randomBytes(8).toString("hex");
  const submission = {
    id,
    chapterId: input.chapterId,
    studentId: student?.id ?? "preview",
    name: student?.name ?? "Preview",
    phone: student?.phone ?? "",
    locale,
    objectiveScore,
    objectiveTotal: objectiveTotal(exam),
    essays: exam.essays.map((question) => ({
      id: question.id,
      prompt: locale === "ar" ? question.promptAr : question.promptEn,
      answer: (input.essayAnswers[question.id] ?? "").trim(),
    })),
    submittedAt: new Date().toISOString(),
  };

  await saveExam(submission);
  if (student) {
    await addPoints(student.id, objectiveScore);
    const exams = mergeCompleted(
      student.exams,
      await listExamChapterIds(student.id),
      [input.chapterId],
    );
    await setStudentCookie({
      id: student.id,
      name: student.name,
      phone: student.phone,
      exams,
    });
  }

  return {
    objectiveScore,
    objectiveTotal: objectiveTotal(exam),
    id,
  };
}

export async function getLatestExam(chapterId: string) {
  const student = await getStudentSession();
  if (!student) return null;
  return latestExam(student.id, chapterId);
}
