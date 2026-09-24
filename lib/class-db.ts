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
import { displayPoints } from "@/lib/student-points";
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
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
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
    try {
      if (!window) {
        await prisma.$executeRaw`DELETE FROM "ClassExamWindow" WHERE "id" = 'current'`;
        return true;
      }
      const chapterId = encodeExamChapter(window.chapterId, window.mode);
      const opensAt = asDate(window.opensAt);
      const closesAt = asDate(window.closesAt);
      await prisma.$executeRaw`
        INSERT INTO "ClassExamWindow" ("id", "chapterId", "opensAt", "closesAt")
        VALUES ('current', ${chapterId}, ${opensAt}, ${closesAt})
        ON CONFLICT ("id") DO UPDATE SET
          "chapterId" = EXCLUDED."chapterId",
          "opensAt" = EXCLUDED."opensAt",
          "closesAt" = EXCLUDED."closesAt"
      `;
      return true;
    } catch {
      return false;
    }
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

export async function ensureCodeTrackColumn(): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "ClassCode" ADD COLUMN IF NOT EXISTS "track" TEXT NOT NULL DEFAULT 'ar'
    `);
    return true;
  } catch {
    return false;
  }
}

function asTrack(value: unknown): "ar" | "en" {
  return value === "en" ? "en" : "ar";
}

async function ensureStudentTrackTable(): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "StudentTrack" (
        "id" TEXT PRIMARY KEY,
        "track" TEXT NOT NULL
      )
    `);
    return true;
  } catch {
    return false;
  }
}

export async function readCodeTracks(): Promise<Map<string, "ar" | "en">> {
  const tracks = new Map<string, "ar" | "en">();
  if (!hasLiveDatabase()) return tracks;
  await ensureCodeTrackColumn();
  try {
    const rows = await prisma.$queryRaw<Array<{ id: string; track: string | null }>>`
      SELECT id, track FROM "ClassCode"
    `;
    for (const row of rows) {
      tracks.set(row.id, asTrack(row.track));
    }
  } catch {
    // Column may still be missing on a stale replica.
  }
  if (await ensureStudentTrackTable()) {
    try {
      const rows = await prisma.$queryRaw<Array<{ id: string; track: string | null }>>`
        SELECT id, track FROM "StudentTrack"
      `;
      for (const row of rows) {
        tracks.set(row.id, asTrack(row.track));
      }
    } catch {
      // Side table is optional until the first write.
    }
  }
  return tracks;
}

export async function writeCodeTracks(rows: { id: string; track?: string; code?: string }[]): Promise<boolean> {
  if (!hasLiveDatabase() || !rows.length) return false;
  await ensureCodeTrackColumn();
  const side = await ensureStudentTrackTable();
  let wrote = false;
  for (const row of rows) {
    const track = asTrack(row.track);
    const code = row.code ?? "";
    if (side) {
      try {
        await prisma.$executeRaw`
          INSERT INTO "StudentTrack" ("id", "track") VALUES (${row.id}, ${track})
          ON CONFLICT ("id") DO UPDATE SET "track" = EXCLUDED."track"
        `;
        wrote = true;
      } catch {
        // Fall through to the ClassCode column.
      }
    }
    try {
      const updated = await prisma.$executeRaw`
        UPDATE "ClassCode" SET "track" = ${track}
        WHERE "id" = ${row.id} OR (${code} <> '' AND "code" = ${code})
      `;
      if (Number(updated) > 0) wrote = true;
    } catch {
      // Column may still be missing.
    }
  }
  return wrote;
}

export async function readClassDb(): Promise<StoreFile | null> {
  if (!hasLiveDatabase()) return null;
  await ensureCodeTrackColumn();
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
    const window = windows.find((row) => row.id === "current") ?? null;
    const tracks = await readCodeTracks();
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
        track: tracks.get(row.id) ?? asTrack("track" in row ? (row as { track?: string }).track : "ar"),
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

export async function setClassCodePoints(id: string, points: number): Promise<number | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const row = await prisma.classCode.update({
      where: { id },
      data: { points: Math.max(0, Math.round(points)) },
      select: { points: true },
    });
    return row.points;
  } catch {
    return null;
  }
}

async function upsertClassCodes(codes: AccessCode[]): Promise<void> {
  if (!codes.length) return;
  const existing = await prisma.classCode.findMany({ select: { id: true, points: true } });
  const prevPoints = new Map(existing.map((row) => [row.id, row.points]));
  const run = (withTrack: boolean) =>
    prisma.$transaction(
      codes.map((row) => {
        const track = asTrack(row.track);
        const create = {
          id: row.id,
          code: row.code,
          name: row.name,
          phone: row.phone,
          createdAt: asDate(row.createdAt),
          usedAt: row.usedAt ? asDate(row.usedAt) : null,
          usedById: row.usedById,
          points: Math.max(0, row.points),
          suspendedAt: row.suspendedAt ? asDate(row.suspendedAt) : null,
          suspendReason: row.suspendReason ?? "",
          ...(withTrack ? { track } : {}),
        };
        const update = {
          code: row.code,
          name: row.name,
          phone: row.phone,
          usedAt: row.usedAt ? asDate(row.usedAt) : null,
          usedById: row.usedById,
          suspendedAt: row.suspendedAt ? asDate(row.suspendedAt) : null,
          suspendReason: row.suspendReason ?? "",
          points: Math.max(prevPoints.get(row.id) ?? 0, Math.max(0, row.points)),
          ...(withTrack ? { track } : {}),
        };
        return prisma.classCode.upsert({
          where: { id: row.id },
          create,
          update,
        });
      }),
    );
  try {
    await run(true);
  } catch {
    await run(false);
  }
  await writeCodeTracks(codes);
}

async function upsertClassMessages(messages: ChatMessage[]): Promise<void> {
  if (!messages.length) return;
  await ensureChatTable();
  await prisma.$transaction(
    messages.map((row) =>
      prisma.classMessage.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          studentId: row.studentId,
          studentName: row.studentName,
          from: row.from,
          body: row.body,
          createdAt: asDate(row.createdAt),
          readByTeacher: row.readByTeacher,
          readByStudent: row.readByStudent,
        },
        update: {
          readByTeacher: row.readByTeacher,
          readByStudent: row.readByStudent,
        },
      }),
    ),
  );
}

export async function ensureChatTable(): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ClassMessage" (
        "id" TEXT NOT NULL,
        "studentId" TEXT NOT NULL,
        "studentName" TEXT NOT NULL,
        "from" TEXT NOT NULL,
        "body" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL,
        "readByTeacher" BOOLEAN NOT NULL DEFAULT false,
        "readByStudent" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "ClassMessage_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ClassMessage_studentId_createdAt_idx"
      ON "ClassMessage"("studentId", "createdAt")
    `);
    return true;
  } catch {
    return false;
  }
}

export async function readChatMessageRows(studentId?: string): Promise<ChatMessage[] | null> {
  if (!hasLiveDatabase()) return null;
  await ensureChatTable();
  try {
    const rows = await prisma.classMessage.findMany({
      where: studentId ? { studentId } : undefined,
      orderBy: { createdAt: "asc" },
    });
    return rows.map((row) => ({
      id: row.id,
      studentId: row.studentId,
      studentName: row.studentName,
      from: row.from === "teacher" ? "teacher" : "student",
      body: row.body,
      createdAt: row.createdAt.toISOString(),
      readByTeacher: row.readByTeacher,
      readByStudent: row.readByStudent,
    }));
  } catch {
    return null;
  }
}

export async function insertChatMessageRow(message: ChatMessage): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  await ensureChatTable();
  try {
    await prisma.classMessage.create({
      data: {
        id: message.id,
        studentId: message.studentId,
        studentName: message.studentName,
        from: message.from,
        body: message.body,
        createdAt: asDate(message.createdAt),
        readByTeacher: message.readByTeacher,
        readByStudent: message.readByStudent,
      },
    });
    return true;
  } catch {
    try {
      await prisma.$executeRaw`
        INSERT INTO "ClassMessage" ("id","studentId","studentName","from","body","createdAt","readByTeacher","readByStudent")
        VALUES (${message.id}, ${message.studentId}, ${message.studentName}, ${message.from}, ${message.body}, ${asDate(message.createdAt)}, ${message.readByTeacher}, ${message.readByStudent})
      `;
      return true;
    } catch {
      return false;
    }
  }
}

export async function markChatReadRows(studentId: string, reader: "student" | "teacher"): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  await ensureChatTable();
  try {
    if (reader === "teacher") {
      await prisma.classMessage.updateMany({
        where: { studentId, from: "student", readByTeacher: false },
        data: { readByTeacher: true },
      });
    } else {
      await prisma.classMessage.updateMany({
        where: { studentId, from: "teacher", readByStudent: false },
        data: { readByStudent: true },
      });
    }
    return true;
  } catch {
    return false;
  }
}

export async function upsertHomeworkRow(row: HomeworkResult): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    const prev = await prisma.classHomework.findUnique({
      where: { studentId_lessonId: { studentId: row.studentId, lessonId: row.lessonId } },
    });
    const score = Math.max(row.score, prev?.score ?? 0);
    const passed = row.passed || Boolean(prev?.passed);
    const submittedAt = asDate(score === row.score ? row.submittedAt : (prev?.submittedAt.toISOString() ?? row.submittedAt));
    await prisma.classHomework.upsert({
      where: { studentId_lessonId: { studentId: row.studentId, lessonId: row.lessonId } },
      create: {
        studentId: row.studentId,
        lessonId: row.lessonId,
        score,
        total: row.total,
        passed,
        submittedAt,
      },
      update: { score, total: Math.max(row.total, prev?.total ?? 0), passed, submittedAt },
    });
    return true;
  } catch {
    return false;
  }
}

export async function commitHomeworkPoints(row: HomeworkResult): Promise<number | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const submittedAt = asDate(row.submittedAt);
    await prisma.$executeRaw`
      INSERT INTO "ClassHomework" ("studentId", "lessonId", "score", "total", "passed", "submittedAt")
      VALUES (${row.studentId}, ${row.lessonId}, ${Math.max(0, row.score)}, ${Math.max(0, row.total)}, ${row.passed}, ${submittedAt})
      ON CONFLICT ("studentId", "lessonId") DO UPDATE
      SET "score" = GREATEST("ClassHomework"."score", EXCLUDED."score"),
          "total" = GREATEST("ClassHomework"."total", EXCLUDED."total"),
          "passed" = "ClassHomework"."passed" OR EXCLUDED."passed",
          "submittedAt" = CASE
            WHEN EXCLUDED."score" >= "ClassHomework"."score" THEN EXCLUDED."submittedAt"
            ELSE "ClassHomework"."submittedAt"
          END
    `;
    return syncStudentPointsFromDb(row.studentId);
  } catch {
    return null;
  }
}

export async function syncStudentPointsFromDb(studentId: string): Promise<number | null> {
  if (!hasLiveDatabase()) return null;
  try {
    const [code, homework, exams] = await Promise.all([
      prisma.classCode.findUnique({ where: { id: studentId }, select: { points: true } }),
      prisma.classHomework.findMany({ where: { studentId } }),
      prisma.classExam.findMany({ where: { studentId } }),
    ]);
    if (!code) return null;
    const next = displayPoints(
      code.points,
      studentId,
      homework.map((row) => ({
        studentId: row.studentId,
        lessonId: row.lessonId,
        score: row.score,
        total: row.total,
        passed: row.passed,
        submittedAt: row.submittedAt.toISOString(),
      })),
      exams.map((row) => ({
        id: row.id,
        chapterId: row.chapterId,
        studentId: row.studentId,
        name: row.name,
        phone: row.phone,
        locale: row.locale === "en" ? "en" : "ar",
        objectiveScore: row.objectiveScore,
        objectiveTotal: row.objectiveTotal,
        essays: [],
        submittedAt: row.submittedAt.toISOString(),
      })),
    );
    return setClassCodePoints(studentId, next);
  } catch {
    return null;
  }
}

export async function writeClassDb(store: StoreFile): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  await ensureCodeTrackColumn();
  try {
    await upsertClassCodes(store.codes);
    // Do not delete ClassCode / ClassCertificate / ClassTelegramLink / ClassDevice /
    // ClassTelegramBot / ClassGroup / ClassSurprise / ClassLessonExample /
    // ClassCommunityPost here. Codes are upserted so points cannot be wiped.
    await upsertClassMessages(store.messages);
    await prisma.$transaction([
      prisma.classExam.deleteMany(),
      prisma.classUnlock.deleteMany(),
      prisma.classEssayGrade.deleteMany(),
      prisma.classAttendance.deleteMany(),
      prisma.classAnnouncement.deleteMany(),
      prisma.classMiss.deleteMany(),
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
    for (const row of store.homework) {
      await upsertHomeworkRow(row);
    }
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
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "ClassSurpriseAnswer_surpriseId_studentId_key"
      ON "ClassSurpriseAnswer"("surpriseId", "studentId")
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

async function writeSurprisePayload(payload: string): Promise<boolean> {
  try {
    await prisma.classSurprise.upsert({
      where: { id: "current" },
      create: { id: "current", payload },
      update: { payload },
    });
    return true;
  } catch {
    try {
      await prisma.$executeRaw`
        INSERT INTO "ClassSurprise" ("id", "payload")
        VALUES ('current', ${payload})
        ON CONFLICT ("id") DO UPDATE SET "payload" = EXCLUDED."payload"
      `;
      return true;
    } catch {
      return false;
    }
  }
}

async function replaceSurpriseAnswers(rows: SurpriseAnswer[]): Promise<boolean> {
  try {
    await prisma.classSurpriseAnswer.deleteMany();
    if (rows.length) {
      await prisma.classSurpriseAnswer.createMany({
        data: rows.map((row) => ({
          id: `${row.surpriseId}:${row.studentId}`,
          surpriseId: row.surpriseId,
          studentId: row.studentId,
          choice: row.choice,
          correct: row.correct,
          answeredAt: asDate(row.answeredAt),
        })),
      });
    }
    return true;
  } catch {
    try {
      await prisma.$executeRaw`DELETE FROM "ClassSurpriseAnswer"`;
      for (const row of rows) {
        await prisma.$executeRaw`
          INSERT INTO "ClassSurpriseAnswer" ("id", "surpriseId", "studentId", "choice", "correct", "answeredAt")
          VALUES (
            ${`${row.surpriseId}:${row.studentId}`},
            ${row.surpriseId},
            ${row.studentId},
            ${row.choice},
            ${row.correct},
            ${asDate(row.answeredAt)}
          )
          ON CONFLICT ("id") DO UPDATE SET
            "choice" = EXCLUDED."choice",
            "correct" = EXCLUDED."correct",
            "answeredAt" = EXCLUDED."answeredAt"
        `;
      }
      return true;
    } catch {
      return false;
    }
  }
}

export async function writeSurpriseState(
  question: SurpriseQuestion | null,
  answers: SurpriseAnswer[],
): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  await ensureSurpriseTables();
  const payload = JSON.stringify(question ?? null).replace(/\u0000/g, "");
  const saved = await writeSurprisePayload(payload);
  if (!saved) return false;
  const rows = parseSurpriseAnswers(answers);
  const answersSaved = await replaceSurpriseAnswers(rows);
  return rows.length === 0 || answersSaved;
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
const COMMUNITY_BLOB = "mindsoft-community.json";

type CommunityStore = {
  posts: CommunityPost[];
  comments: CommunityComment[];
  likes: CommunityLike[];
};

function emptyCommunity(): CommunityStore {
  return { posts: [], comments: [], likes: [] };
}

function mergeCommunity(base: CommunityStore, extra: CommunityStore): CommunityStore {
  const posts = [...base.posts];
  for (const row of extra.posts) {
    if (!posts.some((item) => item.id === row.id)) posts.push(row);
  }
  const comments = [...base.comments];
  for (const row of extra.comments) {
    if (!comments.some((item) => item.id === row.id)) comments.push(row);
  }
  const likes = [...base.likes];
  for (const row of extra.likes) {
    if (!likes.some((item) => item.postId === row.postId && item.studentId === row.studentId)) {
      likes.push(row);
    }
  }
  return { posts, comments, likes };
}

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

async function readBlobCommunity(): Promise<CommunityStore> {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL) return emptyCommunity();
  try {
    const { get } = await import("@vercel/blob");
    const result = await get(COMMUNITY_BLOB, { access: "private", useCache: false });
    if (!result?.stream) return emptyCommunity();
    const parsed = JSON.parse(await new Response(result.stream).text()) as Partial<CommunityStore>;
    return {
      posts: parseCommunityPosts(parsed.posts),
      comments: parseCommunityComments(parsed.comments),
      likes: parseCommunityLikes(parsed.likes),
    };
  } catch {
    return emptyCommunity();
  }
}

async function writeBlobCommunity(store: CommunityStore): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL) return false;
  try {
    const { put } = await import("@vercel/blob");
    await put(COMMUNITY_BLOB, JSON.stringify(store), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return true;
  } catch {
    return false;
  }
}

async function persistCommunityFallback(store: CommunityStore): Promise<boolean> {
  const localOk = await writeLocalCommunity(store);
  const blobOk = await writeBlobCommunity(store);
  return blobOk || localOk;
}

async function runCommunitySql(sql: string): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(sql);
  } catch {
    // A later statement can still create the table the insert needs.
  }
}

export async function ensureCommunityTables(): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  await runCommunitySql(`
    CREATE TABLE IF NOT EXISTS "ClassCommunityPost" (
      "id" TEXT PRIMARY KEY,
      "authorId" TEXT NOT NULL,
      "authorName" TEXT NOT NULL,
      "groupId" TEXT NOT NULL DEFAULT '',
      "body" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL
    )
  `);
  await runCommunitySql(`ALTER TABLE "ClassCommunityPost" ADD COLUMN IF NOT EXISTS "groupId" TEXT NOT NULL DEFAULT ''`);
  await runCommunitySql(`ALTER TABLE "ClassCommunityPost" DISABLE ROW LEVEL SECURITY`);
  await runCommunitySql(`
    CREATE TABLE IF NOT EXISTS "ClassCommunityComment" (
      "id" TEXT PRIMARY KEY,
      "postId" TEXT NOT NULL,
      "authorId" TEXT NOT NULL,
      "authorName" TEXT NOT NULL,
      "body" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL
    )
  `);
  await runCommunitySql(`ALTER TABLE "ClassCommunityComment" DISABLE ROW LEVEL SECURITY`);
  await runCommunitySql(`
    CREATE TABLE IF NOT EXISTS "ClassCommunityLike" (
      "id" TEXT PRIMARY KEY,
      "postId" TEXT NOT NULL,
      "studentId" TEXT NOT NULL
    )
  `);
  await runCommunitySql(`
    CREATE UNIQUE INDEX IF NOT EXISTS "ClassCommunityLike_postId_studentId_key"
    ON "ClassCommunityLike"("postId", "studentId")
  `);
  await runCommunitySql(`ALTER TABLE "ClassCommunityLike" DISABLE ROW LEVEL SECURITY`);
  return true;
}

export async function readCommunityState(): Promise<CommunityStore> {
  const fallback = mergeCommunity(await readLocalCommunity(), await readBlobCommunity());
  if (!hasLiveDatabase()) return fallback;
  await ensureCommunityTables();
  try {
    const [posts, comments, likes] = await Promise.all([
      prisma.$queryRaw<Array<{ id: string; authorId: string; authorName: string; groupId: string; body: string; createdAt: Date }>>`
        SELECT "id", "authorId", "authorName", "groupId", "body", "createdAt" FROM "ClassCommunityPost"
      `,
      prisma.$queryRaw<Array<{ id: string; postId: string; authorId: string; authorName: string; body: string; createdAt: Date }>>`
        SELECT "id", "postId", "authorId", "authorName", "body", "createdAt" FROM "ClassCommunityComment"
      `,
      prisma.$queryRaw<Array<{ postId: string; studentId: string }>>`
        SELECT "postId", "studentId" FROM "ClassCommunityLike"
      `,
    ]);
    return mergeCommunity(
      {
        posts: parseCommunityPosts(
          posts.map((row) => ({
            id: row.id,
            authorId: row.authorId,
            authorName: row.authorName,
            groupId: row.groupId,
            body: row.body,
            createdAt: asDate(String(row.createdAt)).toISOString(),
          })),
        ),
        comments: parseCommunityComments(
          comments.map((row) => ({
            id: row.id,
            postId: row.postId,
            authorId: row.authorId,
            authorName: row.authorName,
            body: row.body,
            createdAt: asDate(String(row.createdAt)).toISOString(),
          })),
        ),
        likes: parseCommunityLikes(likes.map((row) => ({ postId: row.postId, studentId: row.studentId }))),
      },
      fallback,
    );
  } catch {
    return fallback;
  }
}

export async function insertCommunityPostRow(post: CommunityPost): Promise<boolean> {
  const store = await readCommunityState();
  const fallbackOk = await persistCommunityFallback({
    ...store,
    posts: [post, ...store.posts.filter((row) => row.id !== post.id)],
  });
  if (!hasLiveDatabase()) return fallbackOk || true;
  await ensureCommunityTables();
  const createdAt = asDate(post.createdAt);
  try {
    await prisma.$executeRaw`
      INSERT INTO "ClassCommunityPost" ("id","authorId","authorName","groupId","body","createdAt")
      VALUES (${post.id}, ${post.authorId}, ${post.authorName}, ${post.groupId}, ${post.body}, ${createdAt})
      ON CONFLICT ("id") DO NOTHING
    `;
    return true;
  } catch {
    try {
      await prisma.classCommunityPost.create({
        data: {
          id: post.id,
          authorId: post.authorId,
          authorName: post.authorName,
          groupId: post.groupId,
          body: post.body,
          createdAt,
        },
      });
      return true;
    } catch {
      return fallbackOk;
    }
  }
}

export async function deleteCommunityPostRow(id: string): Promise<boolean> {
  const store = await readCommunityState();
  const fallbackOk = await persistCommunityFallback({
    posts: store.posts.filter((row) => row.id !== id),
    comments: store.comments.filter((row) => row.postId !== id),
    likes: store.likes.filter((row) => row.postId !== id),
  });
  if (!hasLiveDatabase()) return fallbackOk || true;
  await ensureCommunityTables();
  try {
    await prisma.$transaction([
      prisma.classCommunityLike.deleteMany({ where: { postId: id } }),
      prisma.classCommunityComment.deleteMany({ where: { postId: id } }),
      prisma.classCommunityPost.delete({ where: { id } }),
    ]);
    return true;
  } catch {
    return fallbackOk;
  }
}

export async function insertCommunityCommentRow(comment: CommunityComment): Promise<boolean> {
  const store = await readCommunityState();
  const fallbackOk = await persistCommunityFallback({
    ...store,
    comments: [...store.comments.filter((row) => row.id !== comment.id), comment],
  });
  if (!hasLiveDatabase()) return fallbackOk || true;
  await ensureCommunityTables();
  const createdAt = asDate(comment.createdAt);
  try {
    await prisma.$executeRaw`
      INSERT INTO "ClassCommunityComment" ("id","postId","authorId","authorName","body","createdAt")
      VALUES (${comment.id}, ${comment.postId}, ${comment.authorId}, ${comment.authorName}, ${comment.body}, ${createdAt})
      ON CONFLICT ("id") DO NOTHING
    `;
    return true;
  } catch {
    try {
      await prisma.classCommunityComment.create({
        data: {
          id: comment.id,
          postId: comment.postId,
          authorId: comment.authorId,
          authorName: comment.authorName,
          body: comment.body,
          createdAt,
        },
      });
      return true;
    } catch {
      return fallbackOk;
    }
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
