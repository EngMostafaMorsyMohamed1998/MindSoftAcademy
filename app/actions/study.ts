"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import {
  addPoints,
  clearMiss,
  completeMakeup,
  getCodeById,
  getExamWindow,
  issueCourseCertificate,
  latestExam,
  listDueMisses,
  listEssayGrades,
  listExamChapterIds,
  listPassedHomework,
  listStudentMakeups,
  recordMisses,
  saveEssayGrade,
  saveExam,
  saveHomework,
  classHomeworkQuestions,
  type MissedQuestion,
} from "@/lib/access-store";
import { examWindowOpen, REVIEW_AFTER_MS } from "@/lib/class-clock";
import { allChaptersPassed, mergeCompleted, mergeIds, passedObjective } from "@/lib/chapter-progress";
import { MAKEUP_HOMEWORK_SIZE, pickLessonHomework, withShuffledOptions } from "@/lib/homework-bank";
import { examForChapter, examPaperSeed, objectiveTotal, type ExamPaperId } from "@/lib/exams";
import { getLocale } from "@/lib/locale";
import { getStudentSession, setStudentCookie } from "@/lib/student-session";
import { ARENA_XP } from "@/lib/arena";
import { getGame } from "@/lib/games";
import { after } from "next/server";

function refreshPoints() {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/leaderboard");
}

export async function awardGameXp(gameId: string): Promise<number> {
  const student = await getStudentSession();
  if (!student) return 0;
  const game = getGame(gameId);
  if (!game) return student.points;
  const next = await addPoints(student.id, game.xp);
  refreshPoints();
  return next;
}

export async function awardArenaXp(): Promise<number> {
  const student = await getStudentSession();
  if (!student) return 0;
  const next = await addPoints(student.id, ARENA_XP);
  refreshPoints();
  return next;
}

export async function submitChapterExam(input: {
  chapterId: ExamPaperId;
  objectiveAnswers: Record<string, number>;
  essayAnswers: Record<string, string>;
}): Promise<
  | {
      objectiveScore: number;
      objectiveTotal: number;
      id: string;
      passed: boolean;
      answers: Record<string, number>;
    }
  | { error: string }
> {
  const student = await getStudentSession();
  const window = await getExamWindow();
  const exam = examForChapter(input.chapterId, examPaperSeed(input.chapterId, window?.opensAt));
  if (!exam) return { error: "NO_EXAM" };
  if (student) {
    const record = await getCodeById(student.id);
    if (record?.suspendedAt) return { error: "SUSPENDED" };
    if (!examWindowOpen(window, input.chapterId)) {
      return { error: "WINDOW" };
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
    const missed: MissedQuestion[] = exam.objectives
      .filter((question) => input.objectiveAnswers[question.id] !== question.correctIndex)
      .map((question) => ({
        studentId: student.id,
        questionKey: `exam:${input.chapterId}:${question.id}`,
        lessonId: "",
        chapterId: input.chapterId,
        promptAr: question.promptAr,
        promptEn: question.promptEn,
        optionsAr: [...(question.optionsAr ?? ["صح", "غلط"])],
        optionsEn: [...(question.optionsEn ?? ["True", "False"])],
        correctIndex: question.correctIndex,
        missedAt: new Date().toISOString(),
        clearedAt: null,
      }));
    await recordMisses(missed);
    refreshPoints();
    const exams = mergeCompleted(
      student.exams,
      await listExamChapterIds(student.id),
      input.chapterId !== "mix" && passed ? [input.chapterId] : [],
    );
    await setStudentCookie({
      id: student.id,
      name: student.name,
      phone: student.phone,
      exams,
      homework: student.homework,
      unlocks: student.unlocks,
    });
    if (allChaptersPassed(exams)) {
      await issueCourseCertificate({
        studentId: student.id,
        name: student.name,
        completed: exams,
      });
    }
    after(async () => {
      const { notifyExamResult } = await import("@/lib/telegram-notify");
      await notifyExamResult({
        studentId: student.id,
        name: student.name,
        chapterId: input.chapterId,
        objectiveScore,
        objectiveTotal: total,
        passed,
        locale,
      });
    });
  }

  return {
    objectiveScore,
    objectiveTotal: total,
    id,
    passed,
    answers: input.objectiveAnswers,
  };
}

export async function submitLessonHomework(input: {
  lessonId: string;
  answers: Record<string, number>;
  seed: number;
  size?: number;
  makeupDate?: string;
}): Promise<{ score: number; total: number; passed: boolean } | { error: string }> {
  const student = await getStudentSession();
  if (!student) return { error: "AUTH" };
  const record = await getCodeById(student.id);
  if (record?.suspendedAt) return { error: "SUSPENDED" };
  if (input.makeupDate) {
    const task = (await listStudentMakeups(student.id)).find(
      (item) => item.date === input.makeupDate && item.lessonId === input.lessonId,
    );
    if (!task) return { error: "MAKEUP" };
  }
  const size = input.makeupDate ? (input.size ?? MAKEUP_HOMEWORK_SIZE) : input.size;
  const extras = await classHomeworkQuestions(input.lessonId);
  const paper = pickLessonHomework(input.lessonId, input.seed, size, extras).map((question, index) =>
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
  const missed: MissedQuestion[] = paper
    .filter((question) => input.answers[question.id] !== question.correctIndex)
    .map((question) => ({
      studentId: student.id,
      questionKey: `hw:${question.id}`,
      lessonId: input.lessonId,
      chapterId: question.chapterId,
      promptAr: question.promptAr,
      promptEn: question.promptEn,
      optionsAr: question.optionsAr,
      optionsEn: question.optionsEn,
      correctIndex: question.correctIndex,
      missedAt: new Date().toISOString(),
      clearedAt: null,
    }));
  await recordMisses(missed);
  refreshPoints();
  if (input.makeupDate && passed) {
    await completeMakeup(student.id, input.makeupDate, score, paper.length);
  }
  return { score, total: paper.length, passed };
}

export async function submitMistakeReview(input: {
  answers: Record<string, number>;
}): Promise<{ score: number; total: number } | { error: string }> {
  const student = await getStudentSession();
  if (!student) return { error: "AUTH" };
  const due = await listDueMisses(student.id, REVIEW_AFTER_MS);
  if (due.length === 0) return { error: "NONE" };
  let score = 0;
  for (const question of due) {
    if (input.answers[question.questionKey] === question.correctIndex) {
      score += 1;
      await clearMiss(student.id, question.questionKey);
    }
  }
  if (score > 0) await addPoints(student.id, score);
  refreshPoints();
  return { score, total: due.length };
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
  revalidatePath("/admin");
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
