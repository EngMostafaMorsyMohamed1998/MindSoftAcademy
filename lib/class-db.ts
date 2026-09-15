import { prisma } from "@/lib/prisma";
import type { StoreFile } from "@/lib/access-store-io";
import type {
  AccessCode,
  ChatMessage,
  ChapterUnlock,
  EssayGrade,
  ExamSubmission,
  HomeworkResult,
} from "@/lib/access-store";

function hasLiveDatabase(): boolean {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    "";
  return Boolean(url) && !url.includes("build:build@127.0.0.1");
}

function asDate(value: string): Date {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export async function readClassDb(): Promise<StoreFile | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const [codes, messages, exams, homework, unlocks, essayGrades] = await Promise.all([
      prisma.classCode.findMany(),
      prisma.classMessage.findMany(),
      prisma.classExam.findMany(),
      prisma.classHomework.findMany(),
      prisma.classUnlock.findMany(),
      prisma.classEssayGrade.findMany(),
    ]);
    return {
      codes: codes.map((row): AccessCode => ({
        id: row.id,
        code: row.code,
        name: row.name,
        phone: row.phone,
        createdAt: row.createdAt.toISOString(),
        usedAt: row.usedAt?.toISOString() ?? null,
        usedById: row.usedById,
        points: row.points,
      })),
      messages: messages.map((row): ChatMessage => ({
        id: row.id,
        studentId: row.studentId,
        studentName: row.studentName,
        from: row.from === "teacher" ? "teacher" : "student",
        body: row.body,
        createdAt: row.createdAt.toISOString(),
        readByTeacher: row.readByTeacher,
        readByStudent: row.readByStudent,
      })),
      exams: exams.map((row): ExamSubmission => ({
        id: row.id,
        chapterId: row.chapterId,
        studentId: row.studentId,
        name: row.name,
        phone: row.phone,
        locale: row.locale === "en" ? "en" : "ar",
        objectiveScore: row.objectiveScore,
        objectiveTotal: row.objectiveTotal,
        essays: Array.isArray(row.essays)
          ? (row.essays as ExamSubmission["essays"])
          : [],
        submittedAt: row.submittedAt.toISOString(),
      })),
      homework: homework.map((row): HomeworkResult => ({
        studentId: row.studentId,
        lessonId: row.lessonId,
        score: row.score,
        total: row.total,
        passed: row.passed,
        submittedAt: row.submittedAt.toISOString(),
      })),
      unlocks: unlocks.map((row): ChapterUnlock => ({
        studentId: row.studentId,
        chapterId: row.chapterId,
        reason: row.reason,
        createdAt: row.createdAt.toISOString(),
      })),
      essayGrades: essayGrades.map((row): EssayGrade => ({
        examId: row.examId,
        studentId: row.studentId,
        questionId: row.questionId,
        score: row.score,
        note: row.note,
        gradedAt: row.gradedAt.toISOString(),
      })),
    };
  } catch {
    return null;
  }
}

export async function writeClassDb(store: StoreFile): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$transaction([
      prisma.classCode.deleteMany(),
      prisma.classMessage.deleteMany(),
      prisma.classExam.deleteMany(),
      prisma.classHomework.deleteMany(),
      prisma.classUnlock.deleteMany(),
      prisma.classEssayGrade.deleteMany(),
      ...(store.codes.length
        ? [
            prisma.classCode.createMany({
              data: store.codes.map((row) => ({
                id: row.id,
                code: row.code,
                name: row.name,
                phone: row.phone,
                createdAt: asDate(row.createdAt),
                usedAt: row.usedAt ? asDate(row.usedAt) : null,
                usedById: row.usedById,
                points: row.points,
              })),
            }),
          ]
        : []),
      ...(store.messages.length
        ? [
            prisma.classMessage.createMany({
              data: store.messages.map((row) => ({
                id: row.id,
                studentId: row.studentId,
                studentName: row.studentName,
                from: row.from,
                body: row.body,
                createdAt: asDate(row.createdAt),
                readByTeacher: row.readByTeacher,
                readByStudent: row.readByStudent,
              })),
            }),
          ]
        : []),
      ...(store.exams.length
        ? [
            prisma.classExam.createMany({
              data: store.exams.map((row) => ({
                id: row.id,
                chapterId: row.chapterId,
                studentId: row.studentId,
                name: row.name,
                phone: row.phone,
                locale: row.locale,
                objectiveScore: row.objectiveScore,
                objectiveTotal: row.objectiveTotal,
                essays: row.essays,
                submittedAt: asDate(row.submittedAt),
              })),
            }),
          ]
        : []),
      ...(store.homework.length
        ? [
            prisma.classHomework.createMany({
              data: store.homework.map((row) => ({
                studentId: row.studentId,
                lessonId: row.lessonId,
                score: row.score,
                total: row.total,
                passed: row.passed,
                submittedAt: asDate(row.submittedAt),
              })),
            }),
          ]
        : []),
      ...(store.unlocks.length
        ? [
            prisma.classUnlock.createMany({
              data: store.unlocks.map((row) => ({
                studentId: row.studentId,
                chapterId: row.chapterId,
                reason: row.reason,
                createdAt: asDate(row.createdAt),
              })),
            }),
          ]
        : []),
      ...(store.essayGrades.length
        ? [
            prisma.classEssayGrade.createMany({
              data: store.essayGrades.map((row) => ({
                examId: row.examId,
                studentId: row.studentId,
                questionId: row.questionId,
                score: row.score,
                note: row.note,
                gradedAt: asDate(row.gradedAt),
              })),
            }),
          ]
        : []),
    ]);
    return true;
  } catch {
    return false;
  }
}
