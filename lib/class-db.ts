import { readFile, writeFile } from "node:fs/promises";
import { prisma } from "@/lib/prisma";
import type { StoreFile } from "@/lib/access-store-io";
import type {
  AccessCode,
  AttendanceRow,
  ChatMessage,
  ChapterUnlock,
  ClassAnnouncement,
  EssayGrade,
  ExamSubmission,
  ExamWindow,
  HomeworkResult,
  MissedQuestion,
} from "@/lib/access-store";
import { encodeExamChapter, parseExamChapter } from "@/lib/class-clock";
import { parseClassSessions, type ClassSession } from "@/lib/class-session";
import { parseCertificates, type CourseCertificate } from "@/lib/certificates";
import { parseTelegramLinks, type TelegramLink } from "@/lib/telegram";
import {
  DEFAULT_DEVICE_LIMIT,
  parseDeviceLimit,
  parseDevices,
  type DeviceLimit,
  type StudentDevice,
} from "@/lib/devices";
import { DEFAULT_MONTHLY_FEE, parsePayments, type MonthPayment } from "@/lib/fees";
import { parseMakeups, type MakeupTask } from "@/lib/makeup";
import { parseWeekSlots, type WeekSlot } from "@/lib/week-plan";
import { parseClassGroups, type ClassGroup } from "@/lib/class-groups";
import { parseSurprise, parseSurpriseAnswers, type SurpriseAnswer, type SurpriseQuestion } from "@/lib/surprise";
import { parseClassExamples, type ClassLessonExample } from "@/lib/class-examples";
import {
  parseCommunityComments,
  parseCommunityLikes,
  parseCommunityPosts,
  type CommunityComment,
  type CommunityLike,
  type CommunityPost,
} from "@/lib/community";

function asExamWindow(row: { id: string; chapterId: string; opensAt: Date; closesAt: Date }): ExamWindow {
  const parsed = parseExamChapter(row.chapterId);
  return {
    id: row.id,
    chapterId: parsed.chapterId,
    opensAt: row.opensAt.toISOString(),
    closesAt: row.closesAt.toISOString(),
    mode: parsed.mode,
  };
}

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

function asStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

async function safeMany<T>(query: Promise<T[]> | undefined): Promise<T[]> {
  try {
    return (await query) ?? [];
  } catch {
    return [];
  }
}

export async function readExamWindowRow(): Promise<ExamWindow | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const row = await prisma.classExamWindow.findUnique({ where: { id: "current" } });
    if (!row) return null;
    return asExamWindow(row);
  } catch {
    return null;
  }
}

export async function writeExamWindowRow(window: ExamWindow | null): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    if (!window) {
      await prisma.classExamWindow.deleteMany();
      return true;
    }
    await prisma.classExamWindow.upsert({
      where: { id: "current" },
      create: {
        id: "current",
        chapterId: encodeExamChapter(window.chapterId, window.mode),
        opensAt: asDate(window.opensAt),
        closesAt: asDate(window.closesAt),
      },
      update: {
        chapterId: encodeExamChapter(window.chapterId, window.mode),
        opensAt: asDate(window.opensAt),
        closesAt: asDate(window.closesAt),
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function readWeekPlanRow(): Promise<WeekSlot[] | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const row = await prisma.classWeekPlan.findUnique({ where: { id: "current" } });
    if (!row) return null;
    return parseWeekSlots(row.slots);
  } catch {
    return null;
  }
}

export async function writeWeekPlanRow(slots: WeekSlot[]): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.classWeekPlan.upsert({
      where: { id: "current" },
      create: { id: "current", slots, updatedAt: new Date() },
      update: { slots, updatedAt: new Date() },
    });
    return true;
  } catch {
    return false;
  }
}

function asSession(row: {
  id: string;
  date: string;
  chapterId: string | null;
  closedAt: Date;
  presentCount: number;
  absentCount: number;
  unmarkedCount: number;
  examCount: number;
  averagePercent: number | null;
  students: unknown;
}): ClassSession {
  return (
    parseClassSessions([
      {
        id: row.id,
        date: row.date,
        chapterId: row.chapterId,
        closedAt: row.closedAt.toISOString(),
        presentCount: row.presentCount,
        absentCount: row.absentCount,
        unmarkedCount: row.unmarkedCount,
        examCount: row.examCount,
        averagePercent: row.averagePercent,
        students: row.students,
      },
    ])[0] ?? {
      id: row.id,
      date: row.date,
      chapterId: row.chapterId,
      closedAt: row.closedAt.toISOString(),
      presentCount: row.presentCount,
      absentCount: row.absentCount,
      unmarkedCount: row.unmarkedCount,
      examCount: row.examCount,
      averagePercent: row.averagePercent,
      students: [],
    }
  );
}

export async function readSessionRows(): Promise<ClassSession[] | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const rows = await prisma.classSessionArchive.findMany({ orderBy: { date: "desc" } });
    return rows.map(asSession);
  } catch {
    return null;
  }
}

export async function writeSessionRows(sessions: ClassSession[]): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$transaction([
      prisma.classSessionArchive.deleteMany(),
      ...(sessions.length
        ? [
            prisma.classSessionArchive.createMany({
              data: sessions.map((row) => ({
                id: row.id,
                date: row.date,
                chapterId: row.chapterId,
                closedAt: asDate(row.closedAt),
                presentCount: row.presentCount,
                absentCount: row.absentCount,
                unmarkedCount: row.unmarkedCount,
                examCount: row.examCount,
                averagePercent: row.averagePercent,
                students: row.students,
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

export async function readMakeupRows(): Promise<MakeupTask[] | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const rows = await prisma.classMakeup.findMany();
    return parseMakeups(
      rows.map((row) => ({
        studentId: row.studentId,
        date: row.sessionDate,
        lessonId: row.lessonId,
        chapterId: row.chapterId,
        dueDate: row.dueDate,
        completedAt: row.completedAt?.toISOString() ?? null,
        score: row.score,
        total: row.total,
      })),
    );
  } catch {
    return null;
  }
}

export async function writeMakeupRows(tasks: MakeupTask[]): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$transaction([
      prisma.classMakeup.deleteMany(),
      ...(tasks.length
        ? [
            prisma.classMakeup.createMany({
              data: tasks.map((row) => ({
                studentId: row.studentId,
                sessionDate: row.date,
                lessonId: row.lessonId,
                chapterId: row.chapterId,
                dueDate: row.dueDate,
                completedAt: row.completedAt ? asDate(row.completedAt) : null,
                score: row.score,
                total: row.total,
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

export async function readPaymentRows(): Promise<MonthPayment[] | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const rows = await prisma.classPayment.findMany();
    return parsePayments(
      rows.map((row) => ({
        studentId: row.studentId,
        month: row.month,
        paid: row.paid,
        updatedAt: row.updatedAt.toISOString(),
      })),
    );
  } catch {
    return null;
  }
}

export async function writePaymentRows(rows: MonthPayment[]): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$transaction([
      prisma.classPayment.deleteMany(),
      ...(rows.length
        ? [
            prisma.classPayment.createMany({
              data: rows.map((row) => ({
                studentId: row.studentId,
                month: row.month,
                paid: row.paid,
                updatedAt: asDate(row.updatedAt),
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

export async function readClassDb(): Promise<StoreFile | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const [codes, messages, exams, homework, unlocks, essayGrades, attendance, announcements, windows, misses, weekPlans, sessionRows] =
      await Promise.all([
        prisma.classCode.findMany(),
        prisma.classMessage.findMany(),
        prisma.classExam.findMany(),
        prisma.classHomework.findMany(),
        prisma.classUnlock.findMany(),
        prisma.classEssayGrade.findMany(),
        safeMany(prisma.classAttendance?.findMany()),
        safeMany(prisma.classAnnouncement?.findMany()),
        safeMany(prisma.classExamWindow?.findMany()),
        safeMany(prisma.classMiss?.findMany()),
        safeMany(prisma.classWeekPlan?.findMany()),
        safeMany(prisma.classSessionArchive?.findMany()),
      ]);
    const announcement = announcements.find((row) => row.active) ?? announcements[0] ?? null;
    const window = windows[0] ?? null;
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
        suspendedAt: row.suspendedAt?.toISOString() ?? null,
        suspendReason: row.suspendReason,
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
        essays: Array.isArray(row.essays) ? (row.essays as ExamSubmission["essays"]) : [],
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
      attendance: attendance.map((row): AttendanceRow => ({
        studentId: row.studentId,
        date: row.sessionDate,
        present: row.present,
        createdAt: row.createdAt.toISOString(),
      })),
      announcement: announcement
        ? ({
            id: announcement.id,
            body: announcement.body,
            createdAt: announcement.createdAt.toISOString(),
            active: announcement.active,
          } satisfies ClassAnnouncement)
        : null,
      examWindow: window ? asExamWindow(window) : null,
      weekPlan: parseWeekSlots(weekPlans[0]?.slots),
      sessions: sessionRows.map(asSession),
      makeups: [],
      payments: [],
      monthlyFee: DEFAULT_MONTHLY_FEE,
      devices: [],
      deviceLimit: DEFAULT_DEVICE_LIMIT,
      certificates: [],
      telegramLinks: [],
      telegramBotToken: "",
      teacherTelegramChatId: "",
      classGroups: [],
      surprise: null,
      surpriseAnswers: [],
      presence: [],
      misses: misses.map((row): MissedQuestion => ({
        studentId: row.studentId,
        questionKey: row.questionKey,
        lessonId: row.lessonId,
        chapterId: row.chapterId,
        promptAr: row.promptAr,
        promptEn: row.promptEn,
        optionsAr: asStrings(row.optionsAr),
        optionsEn: asStrings(row.optionsEn),
        correctIndex: row.correctIndex,
        missedAt: row.missedAt.toISOString(),
        clearedAt: row.clearedAt?.toISOString() ?? null,
      })),
    };
  } catch {
    return null;
  }
}

export async function writeClassDb(store: StoreFile): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    // Do not delete ClassCertificate / ClassTelegramLink / ClassDevice /
    // ClassTelegramBot / ClassGroup / ClassSurprise / ClassLessonExample /
    // ClassCommunityPost here. Those live in dedicated tables.
    await prisma.$transaction([
      prisma.classCode.deleteMany(),
      prisma.classMessage.deleteMany(),
      prisma.classExam.deleteMany(),
      prisma.classHomework.deleteMany(),
      prisma.classUnlock.deleteMany(),
      prisma.classEssayGrade.deleteMany(),
      prisma.classAttendance.deleteMany(),
      prisma.classAnnouncement.deleteMany(),
      prisma.classMiss.deleteMany(),
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
                suspendedAt: row.suspendedAt ? asDate(row.suspendedAt) : null,
                suspendReason: row.suspendReason ?? "",
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
      ...(store.attendance.length
        ? [
            prisma.classAttendance.createMany({
              data: store.attendance.map((row) => ({
                studentId: row.studentId,
                sessionDate: row.date,
                present: row.present,
                createdAt: asDate(row.createdAt),
              })),
            }),
          ]
        : []),
      ...(store.announcement
        ? [
            prisma.classAnnouncement.createMany({
              data: [
                {
                  id: store.announcement.id,
                  body: store.announcement.body,
                  createdAt: asDate(store.announcement.createdAt),
                  active: store.announcement.active,
                },
              ],
            }),
          ]
        : []),
      ...(store.misses.length
        ? [
            prisma.classMiss.createMany({
              data: store.misses.map((row) => ({
                studentId: row.studentId,
                questionKey: row.questionKey,
                lessonId: row.lessonId,
                chapterId: row.chapterId,
                promptAr: row.promptAr,
                promptEn: row.promptEn,
                optionsAr: row.optionsAr,
                optionsEn: row.optionsEn,
                correctIndex: row.correctIndex,
                missedAt: asDate(row.missedAt),
                clearedAt: row.clearedAt ? asDate(row.clearedAt) : null,
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

export async function readCertificateRows(): Promise<CourseCertificate[] | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const rows = await prisma.classCertificate.findMany();
    return parseCertificates(
      rows.map((row) => ({
        serial: row.serial,
        studentId: row.studentId,
        name: row.name,
        issuedAt: row.issuedAt.toISOString(),
        average: row.average,
        verifyCode: row.verifyCode,
        year: row.year,
      })),
    );
  } catch {
    return null;
  }
}

export async function upsertCertificateRow(row: CourseCertificate): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.classCertificate.upsert({
      where: { studentId: row.studentId },
      create: {
        serial: row.serial,
        studentId: row.studentId,
        name: row.name,
        issuedAt: asDate(row.issuedAt),
        average: row.average,
        verifyCode: row.verifyCode,
        year: row.year,
      },
      update: {
        serial: row.serial,
        name: row.name,
        issuedAt: asDate(row.issuedAt),
        average: row.average,
        verifyCode: row.verifyCode,
        year: row.year,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function readTelegramLinkRows(): Promise<TelegramLink[] | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const rows = await prisma.classTelegramLink.findMany();
    return parseTelegramLinks(
      rows.map((row) => ({
        chatId: row.chatId,
        studentId: row.studentId,
        phone: row.phone,
        parentName: row.parentName,
        linkedAt: row.linkedAt.toISOString(),
      })),
    );
  } catch {
    return null;
  }
}

export async function upsertTelegramLinkRow(row: TelegramLink): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.classTelegramLink.upsert({
      where: { chatId: row.chatId },
      create: {
        chatId: row.chatId,
        studentId: row.studentId,
        phone: row.phone,
        parentName: row.parentName,
        linkedAt: asDate(row.linkedAt),
      },
      update: {
        studentId: row.studentId,
        phone: row.phone,
        parentName: row.parentName,
        linkedAt: asDate(row.linkedAt),
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function readDeviceRows(): Promise<StudentDevice[] | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const rows = await prisma.classDevice.findMany();
    return parseDevices(
      rows.map((row) => ({
        id: row.id,
        studentId: row.studentId,
        deviceId: row.deviceId,
        label: row.label,
        firstAt: row.firstAt.toISOString(),
        lastAt: row.lastAt.toISOString(),
      })),
    );
  } catch {
    return null;
  }
}

export async function readDeviceLimitRow(): Promise<DeviceLimit | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const row = await prisma.classDeviceLimit.findUnique({ where: { id: "current" } });
    return row ? parseDeviceLimit(row.limit) : null;
  } catch {
    return null;
  }
}

export async function upsertDeviceRow(row: StudentDevice): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.classDevice.upsert({
      where: { studentId_deviceId: { studentId: row.studentId, deviceId: row.deviceId } },
      create: {
        id: row.id,
        studentId: row.studentId,
        deviceId: row.deviceId,
        label: row.label,
        firstAt: asDate(row.firstAt),
        lastAt: asDate(row.lastAt),
      },
      update: {
        label: row.label,
        lastAt: asDate(row.lastAt),
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function deleteDeviceRow(id: string): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.classDevice.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function upsertDeviceLimitRow(limit: DeviceLimit): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.classDeviceLimit.upsert({
      where: { id: "current" },
      create: { id: "current", limit },
      update: { limit },
    });
    return true;
  } catch {
    return false;
  }
}

export async function readTelegramBotTokenRow(): Promise<string | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const row = await prisma.classTelegramBot.findUnique({ where: { id: "current" } });
    const token = row?.token?.trim() ?? "";
    return token || null;
  } catch {
    return null;
  }
}

export async function upsertTelegramBotTokenRow(token: string): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.classTelegramBot.upsert({
      where: { id: "current" },
      create: { id: "current", token, teacherChatId: "" },
      update: { token },
    });
    return true;
  } catch {
    return false;
  }
}

export async function readTeacherTelegramChatId(): Promise<string | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const row = await prisma.classTelegramBot.findUnique({ where: { id: "current" } });
    const chatId = row?.teacherChatId?.trim() ?? "";
    return chatId || null;
  } catch {
    return null;
  }
}

export async function upsertTeacherTelegramChatId(chatId: string): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.classTelegramBot.upsert({
      where: { id: "current" },
      create: { id: "current", token: "", teacherChatId: chatId },
      update: { teacherChatId: chatId },
    });
    return true;
  } catch {
    return false;
  }
}

export async function readGroupRows(): Promise<ClassGroup[] | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const rows = await prisma.classGroup.findMany();
    return parseClassGroups(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        weekday: row.weekday,
        startTime: row.startTime,
        place: row.place,
        nextLesson: row.nextLesson,
        studentIds: row.studentIds,
        remindedOn: row.remindedOn,
      })),
    );
  } catch {
    return null;
  }
}

export async function writeGroupRows(groups: ClassGroup[]): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$transaction([
      prisma.classGroup.deleteMany(),
      ...(groups.length
        ? [
            prisma.classGroup.createMany({
              data: groups.map((row) => ({
                id: row.id,
                name: row.name,
                weekday: row.weekday,
                startTime: row.startTime,
                place: row.place,
                nextLesson: row.nextLesson,
                studentIds: JSON.stringify(row.studentIds),
                remindedOn: row.remindedOn,
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

export async function ensureSurpriseTables(): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ClassSurprise" (
        "id" TEXT NOT NULL,
        "payload" TEXT NOT NULL,
        CONSTRAINT "ClassSurprise_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ClassSurpriseAnswer" (
        "id" TEXT NOT NULL,
        "surpriseId" TEXT NOT NULL,
        "studentId" TEXT NOT NULL,
        "choice" INTEGER NOT NULL,
        "correct" BOOLEAN NOT NULL,
        "answeredAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "ClassSurpriseAnswer_pkey" PRIMARY KEY ("id")
      )
    `);
    return true;
  } catch {
    return false;
  }
}

export async function readSurpriseState(): Promise<{
  question: SurpriseQuestion | null;
  answers: SurpriseAnswer[];
} | null> {
  if (!hasLiveDatabase()) return null;
  await ensureSurpriseTables();
  try {
    const [row, answers] = await Promise.all([
      prisma.classSurprise.findUnique({ where: { id: "current" } }),
      prisma.classSurpriseAnswer.findMany(),
    ]);
    let payload: unknown = null;
    if (row?.payload) {
      try {
        payload = JSON.parse(row.payload);
      } catch {
        payload = null;
      }
    }
    return {
      question: parseSurprise(payload),
      answers: parseSurpriseAnswers(
        answers.map((item) => ({
          studentId: item.studentId,
          surpriseId: item.surpriseId,
          choice: item.choice,
          correct: item.correct,
          answeredAt: item.answeredAt.toISOString(),
        })),
      ),
    };
  } catch {
    return null;
  }
}

export async function writeSurpriseState(
  question: SurpriseQuestion | null,
  answers: SurpriseAnswer[],
): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  await ensureSurpriseTables();
  try {
    const rows = parseSurpriseAnswers(answers);
    await prisma.$transaction([
      prisma.classSurprise.upsert({
        where: { id: "current" },
        create: { id: "current", payload: JSON.stringify(question) },
        update: { payload: JSON.stringify(question) },
      }),
      prisma.classSurpriseAnswer.deleteMany(),
      ...(rows.length
        ? [
            prisma.classSurpriseAnswer.createMany({
              data: rows.map((row) => ({
                id: `${row.surpriseId}:${row.studentId}`,
                surpriseId: row.surpriseId,
                studentId: row.studentId,
                choice: row.choice,
                correct: row.correct,
                answeredAt: asDate(row.answeredAt),
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

export async function ensureExampleTables(): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ClassLessonExample" (
        "id" TEXT NOT NULL,
        "lessonId" TEXT NOT NULL,
        "bodyAr" TEXT NOT NULL,
        "bodyEn" TEXT NOT NULL DEFAULT '',
        "createdAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "ClassLessonExample_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ClassLessonExample_lessonId_idx" ON "ClassLessonExample"("lessonId")
    `);
    return true;
  } catch {
    return false;
  }
}

const EXAMPLE_FILE = "/tmp/mindsoft-lesson-examples.json";

async function readLocalExamples(): Promise<ClassLessonExample[]> {
  try {
    return parseClassExamples(JSON.parse(await readFile(EXAMPLE_FILE, "utf8")));
  } catch {
    return [];
  }
}

async function writeLocalExamples(examples: ClassLessonExample[]): Promise<boolean> {
  try {
    await writeFile(EXAMPLE_FILE, JSON.stringify(parseClassExamples(examples)), "utf8");
    return true;
  } catch {
    return false;
  }
}

export async function readExampleRows(): Promise<ClassLessonExample[] | null> {
  if (!hasLiveDatabase()) return readLocalExamples();
  await ensureExampleTables();
  try {
    const rows = await prisma.classLessonExample.findMany({ orderBy: { createdAt: "desc" } });
    return parseClassExamples(
      rows.map((row) => ({
        id: row.id,
        lessonId: row.lessonId,
        bodyAr: row.bodyAr,
        bodyEn: row.bodyEn,
        createdAt: row.createdAt.toISOString(),
      })),
    );
  } catch {
    return null;
  }
}

export async function writeExampleRows(examples: ClassLessonExample[]): Promise<boolean> {
  if (!hasLiveDatabase()) return writeLocalExamples(examples);
  await ensureExampleTables();
  try {
    const rows = parseClassExamples(examples);
    await prisma.$transaction([
      prisma.classLessonExample.deleteMany(),
      ...(rows.length
        ? [
            prisma.classLessonExample.createMany({
              data: rows.map((row) => ({
                id: row.id,
                lessonId: row.lessonId,
                bodyAr: row.bodyAr,
                bodyEn: row.bodyEn,
                createdAt: asDate(row.createdAt),
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

const COMMUNITY_FILE = "/tmp/mindsoft-community.json";

type CommunityStore = {
  posts: CommunityPost[];
  comments: CommunityComment[];
  likes: CommunityLike[];
};

async function readLocalCommunity(): Promise<CommunityStore> {
  try {
    const parsed = JSON.parse(await readFile(COMMUNITY_FILE, "utf8")) as Partial<CommunityStore>;
    return {
      posts: parseCommunityPosts(parsed.posts),
      comments: parseCommunityComments(parsed.comments),
      likes: parseCommunityLikes(parsed.likes),
    };
  } catch {
    return { posts: [], comments: [], likes: [] };
  }
}

async function writeLocalCommunity(store: CommunityStore): Promise<boolean> {
  try {
    await writeFile(COMMUNITY_FILE, JSON.stringify(store), "utf8");
    return true;
  } catch {
    return false;
  }
}

export async function ensureCommunityTables(): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ClassCommunityPost" (
        "id" TEXT NOT NULL,
        "authorId" TEXT NOT NULL,
        "authorName" TEXT NOT NULL,
        "groupId" TEXT NOT NULL DEFAULT '',
        "body" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "ClassCommunityPost_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ClassCommunityComment" (
        "id" TEXT NOT NULL,
        "postId" TEXT NOT NULL,
        "authorId" TEXT NOT NULL,
        "authorName" TEXT NOT NULL,
        "body" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "ClassCommunityComment_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ClassCommunityLike" (
        "id" TEXT NOT NULL,
        "postId" TEXT NOT NULL,
        "studentId" TEXT NOT NULL,
        CONSTRAINT "ClassCommunityLike_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "ClassCommunityLike_postId_studentId_key"
      ON "ClassCommunityLike"("postId", "studentId")
    `);
    return true;
  } catch {
    return false;
  }
}

export async function readCommunityState(): Promise<CommunityStore> {
  if (!hasLiveDatabase()) return readLocalCommunity();
  await ensureCommunityTables();
  try {
    const [posts, comments, likes] = await Promise.all([
      prisma.classCommunityPost.findMany(),
      prisma.classCommunityComment.findMany(),
      prisma.classCommunityLike.findMany(),
    ]);
    return {
      posts: parseCommunityPosts(
        posts.map((row) => ({
          id: row.id,
          authorId: row.authorId,
          authorName: row.authorName,
          groupId: row.groupId,
          body: row.body,
          createdAt: row.createdAt.toISOString(),
        })),
      ),
      comments: parseCommunityComments(
        comments.map((row) => ({
          id: row.id,
          postId: row.postId,
          authorId: row.authorId,
          authorName: row.authorName,
          body: row.body,
          createdAt: row.createdAt.toISOString(),
        })),
      ),
      likes: parseCommunityLikes(likes.map((row) => ({ postId: row.postId, studentId: row.studentId }))),
    };
  } catch {
    return readLocalCommunity();
  }
}

export async function insertCommunityPostRow(post: CommunityPost): Promise<boolean> {
  if (!hasLiveDatabase()) {
    const store = await readLocalCommunity();
    return writeLocalCommunity({ ...store, posts: [post, ...store.posts] });
  }
  await ensureCommunityTables();
  try {
    await prisma.classCommunityPost.create({
      data: {
        id: post.id,
        authorId: post.authorId,
        authorName: post.authorName,
        groupId: post.groupId,
        body: post.body,
        createdAt: asDate(post.createdAt),
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function deleteCommunityPostRow(id: string): Promise<boolean> {
  if (!hasLiveDatabase()) {
    const store = await readLocalCommunity();
    return writeLocalCommunity({
      posts: store.posts.filter((row) => row.id !== id),
      comments: store.comments.filter((row) => row.postId !== id),
      likes: store.likes.filter((row) => row.postId !== id),
    });
  }
  await ensureCommunityTables();
  try {
    await prisma.$transaction([
      prisma.classCommunityLike.deleteMany({ where: { postId: id } }),
      prisma.classCommunityComment.deleteMany({ where: { postId: id } }),
      prisma.classCommunityPost.delete({ where: { id } }),
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function insertCommunityCommentRow(comment: CommunityComment): Promise<boolean> {
  if (!hasLiveDatabase()) {
    const store = await readLocalCommunity();
    return writeLocalCommunity({ ...store, comments: [...store.comments, comment] });
  }
  await ensureCommunityTables();
  try {
    await prisma.classCommunityComment.create({
      data: {
        id: comment.id,
        postId: comment.postId,
        authorId: comment.authorId,
        authorName: comment.authorName,
        body: comment.body,
        createdAt: asDate(comment.createdAt),
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function deleteCommunityCommentRow(id: string): Promise<boolean> {
  if (!hasLiveDatabase()) {
    const store = await readLocalCommunity();
    return writeLocalCommunity({
      ...store,
      comments: store.comments.filter((row) => row.id !== id),
    });
  }
  await ensureCommunityTables();
  try {
    await prisma.classCommunityComment.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function toggleCommunityLikeRow(postId: string, studentId: string): Promise<boolean> {
  if (!hasLiveDatabase()) {
    const store = await readLocalCommunity();
    const liked = store.likes.some((row) => row.postId === postId && row.studentId === studentId);
    return writeLocalCommunity({
      ...store,
      likes: liked
        ? store.likes.filter((row) => !(row.postId === postId && row.studentId === studentId))
        : [...store.likes, { postId, studentId }],
    });
  }
  await ensureCommunityTables();
  try {
    const existing = await prisma.classCommunityLike.findFirst({
      where: { postId, studentId },
    });
    if (existing) {
      await prisma.classCommunityLike.delete({ where: { id: existing.id } });
      return true;
    }
    await prisma.classCommunityLike.upsert({
      where: { id: `${postId}:${studentId}` },
      create: { id: `${postId}:${studentId}`, postId, studentId },
      update: { postId, studentId },
    });
    return true;
  } catch {
    try {
      await prisma.$executeRaw`
        INSERT INTO "ClassCommunityLike" ("id", "postId", "studentId")
        VALUES (${`${postId}:${studentId}`}, ${postId}, ${studentId})
        ON CONFLICT ("id") DO NOTHING
      `;
      return true;
    } catch {
      return false;
    }
  }
}

export async function deleteTelegramLinkRow(chatId: string): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.classTelegramLink.delete({ where: { chatId } });
    return true;
  } catch {
    return false;
  }
}
