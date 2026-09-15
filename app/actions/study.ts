"use server";

import { randomBytes } from "crypto";
import {
  addPoints,
  latestExam,
  listEssayGrades,
  listExamChapterIds,
  listPassedHomework,
  listUnlocks,
  saveEssayGrade,
  saveExam,
  saveHomework,
} from "@/lib/access-store";
import {
  chapterHomeworkDone,
  isChapterUnlocked,
  mergeCompleted,
  mergeIds,
  passedObjective,
} from "@/lib/chapter-progress";
import { pickLessonHomework, withShuffledOptions } from "@/lib/homework-bank";
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
}): Promise<
  | { objectiveScore: number; objectiveTotal: number; id: string; passed: boolean }
  | { error: string }
> {
  const student = await getStudentSession();
  const exam = examForChapter(input.chapterId);
  if (!exam) return { error: "NO_EXAM" };
  if (student) {
    const [exams, homework, unlocks] = await Promise.all([
      listExamChapterIds(student.id),
      listPassedHomework(student.id),
      listUnlocks(student.id),
    ]);
    const completed = mergeCompleted(student.exams, exams);
    const open = mergeIds(student.unlocks, unlocks);
    const done = mergeIds(student.homework, homework);
    if (!isChapterUnlocked(completed, input.chapterId, open)) {
      return { error: "LOCKED" };
    }
    if (!chapterHomeworkDone(input.chapterId, done)) {
      return { error: "HOMEWORK" };
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

  const total = objectiveTotal(exam);
  const passed = passedObjective(objectiveScore, total);

  await saveExam(submission);
  if (student) {
    await addPoints(student.id, objectiveScore);
    const exams = mergeCompleted(
      student.exams,
      await listExamChapterIds(student.id),
      passed ? [input.chapterId] : [],
    );
    await setStudentCookie({
      id: student.id,
      name: student.name,
      phone: student.phone,
      exams,
      homework: student.homework,
      unlocks: student.unlocks,
    });
  }

  return {
    objectiveScore,
    objectiveTotal: total,
    id,
    passed,
  };
}

export async function submitLessonHomework(input: {
  lessonId: string;
  answers: Record<string, number>;
  seed: number;
}): Promise<{ score: number; total: number; passed: boolean } | { error: string }> {
  const student = await getStudentSession();
  if (!student) return { error: "AUTH" };
  const paper = pickLessonHomework(input.lessonId, input.seed).map((question, index) =>
    withShuffledOptions(question, input.seed + index * 17),
  );
  if (paper.length === 0) return { error: "NO_HOMEWORK" };

  let score = 0;
  for (const question of paper) {
    if (input.answers[question.id] === question.correctIndex) score += 1;
  }
  const passed = passedObjective(score, paper.length);
  await saveHomework({
    studentId: student.id,
    lessonId: input.lessonId,
    score,
    total: paper.length,
    passed,
    submittedAt: new Date().toISOString(),
  });
  await setStudentCookie({
    id: student.id,
    name: student.name,
    phone: student.phone,
    exams: student.exams,
    homework: mergeIds(
      student.homework,
      await listPassedHomework(student.id),
      passed ? [input.lessonId] : [],
    ),
    unlocks: student.unlocks,
  });
  if (passed) await addPoints(student.id, score);
  return { score, total: paper.length, passed };
}

export async function gradeEssayForm(formData: FormData): Promise<void> {
  await gradeEssay({
    examId: String(formData.get("examId") ?? ""),
    studentId: String(formData.get("studentId") ?? ""),
    questionId: String(formData.get("questionId") ?? ""),
    score: Number(formData.get("score") ?? 0),
    note: String(formData.get("note") ?? ""),
  });
}

export async function gradeEssay(input: {
  examId: string;
  studentId: string;
  questionId: string;
  score: number;
  note: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!Number.isFinite(input.score) || input.score < 0) {
    return { ok: false, error: "SCORE" };
  }
  await saveEssayGrade({
    examId: input.examId,
    studentId: input.studentId,
    questionId: input.questionId,
    score: input.score,
    note: input.note.trim().slice(0, 400),
    gradedAt: new Date().toISOString(),
  });
  return { ok: true };
}

export async function getLatestExam(chapterId: string) {
  const student = await getStudentSession();
  if (!student) return null;
  const exam = await latestExam(student.id, chapterId);
  if (!exam) return null;
  const grades = await listEssayGrades(student.id, exam.id);
  return { exam, grades };
}
