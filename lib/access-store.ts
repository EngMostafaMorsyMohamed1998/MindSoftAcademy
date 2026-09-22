import { createHmac, randomBytes } from "crypto";
import { readLocalStore, readStore, writeStore } from "@/lib/access-store-io";
import {
  canIssueCertificate,
  courseAverage,
  nextCertificateSerial,
  stampCertificate,
  type CourseCertificate,
} from "@/lib/certificates";
import { cairoDate, cairoMonth, type ExamMode } from "@/lib/class-clock";
import {
  buildClassSession,
  parseClassSessions,
  upsertSession,
  type ClassSession,
} from "@/lib/class-session";
import { parseMonthlyFee, parsePayments, type MonthPayment } from "@/lib/fees";
import { addCairoDays, lessonForMakeup, MAKEUP_DAYS, parseMakeups, type MakeupTask } from "@/lib/makeup";
import type { ChapterId } from "@/lib/curriculum";
import { parsePresence, screenFromPath, type PresencePing } from "@/lib/presence";
import {
  parseSurprise,
  parseSurpriseAnswers,
  pickSurpriseQuestion,
  surpriseOpen,
  type SurpriseAnswer,
  type SurpriseQuestion,
} from "@/lib/surprise";
import { parseTelegramLinks, type TelegramLink } from "@/lib/telegram";
import {
  allowedDevicesForStudent,
  canRegisterDevice,
  devicesForStudent,
  parseDeviceLimit,
  parseDevices,
  type DeviceLimit,
  type StudentDevice,
} from "@/lib/devices";
import { parseWeekSlots, sortWeekSlots, type WeekSlot } from "@/lib/week-plan";
import { parseClassGroups, sortClassGroups, type ClassGroup } from "@/lib/class-groups";
import { parseClassExamples, questionsFromExamples, type ClassLessonExample } from "@/lib/class-examples";
import type { HomeworkQuestion } from "@/lib/homework-bank";
import { displayPoints } from "@/lib/student-points";
import {
  buildCommunityFeed,
  cleanCommunityText,
  COMMUNITY_COMMENT_MAX,
  COMMUNITY_POST_MAX,
  type CommunityComment,
  type CommunityFeedPost,
  type CommunityPost,
} from "@/lib/community";

export type AccessCode = {
  id: string;
  code: string;
  name: string;
  phone: string;
  createdAt: string;
  usedAt: string | null;
  usedById: string | null;
  points: number;
  suspendedAt: string | null;
  suspendReason: string;
  /** Arabic-stream book + Arabic UI, or Languages-stream book + English UI. */
  track: "ar" | "en";
};

export type ChatMessage = {
  id: string;
  studentId: string;
  studentName: string;
  from: "student" | "teacher";
  body: string;
  createdAt: string;
  readByTeacher: boolean;
  readByStudent: boolean;
};

export type ChatThread = {
  studentId: string;
  studentName: string;
  phone?: string;
  messages: ChatMessage[];
  lastAt: string;
  unreadForTeacher: number;
  unreadForStudent: number;
};

export type ExamSubmission = {
  id: string;
  chapterId: string;
  studentId: string;
  name: string;
  phone: string;
  locale: "ar" | "en";
  objectiveScore: number;
  objectiveTotal: number;
  essays: { id: string; prompt: string; answer: string }[];
  submittedAt: string;
};

export type HomeworkResult = {
  studentId: string;
  lessonId: string;
  score: number;
  total: number;
  passed: boolean;
  submittedAt: string;
};

export type ChapterUnlock = {
  studentId: string;
  chapterId: string;
  reason: string;
  createdAt: string;
};

export type EssayGrade = {
  examId: string;
  studentId: string;
  questionId: string;
  score: number;
  note: string;
  gradedAt: string;
};

export type AttendanceRow = {
  studentId: string;
  date: string;
  present: boolean;
  createdAt: string;
};

export type ClassAnnouncement = {
  id: string;
  body: string;
  createdAt: string;
  active: boolean;
};

export type ExamWindow = {
  id: string;
  chapterId: string;
  opensAt: string;
  closesAt: string;
  mode: ExamMode;
};

export type { WeekSlot, ClassSession, MakeupTask, MonthPayment, SurpriseAnswer, SurpriseQuestion, PresencePing, CourseCertificate, TelegramLink, StudentDevice, DeviceLimit };

export async function getMonthlyFee(): Promise<number> {
  return parseMonthlyFee((await readStore()).monthlyFee);
}

export async function setMonthlyFee(amount: number): Promise<number> {
  const monthlyFee = parseMonthlyFee(amount);
  const store = await readStore();
  store.monthlyFee = monthlyFee;
  await writeStore(store);
  return monthlyFee;
}

export type MissedQuestion = {
  studentId: string;
  questionKey: string;
  lessonId: string;
  chapterId: string;
  promptAr: string;
  promptEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
  missedAt: string;
  clearedAt: string | null;
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function normalizeName(name: string): string {
  return name
    .normalize("NFKC")
    .replace(/[إأآا]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0020")) return `0${digits.slice(4)}`;
  if (digits.startsWith("20") && digits.length >= 12) return `0${digits.slice(2)}`;
  return digits;
}

function phoneCore(digits: string): string {
  const local = digits.startsWith("0") ? digits.slice(1) : digits;
  return local.length > 10 ? local.slice(-10) : local;
}

export function phonesMatch(a: string, b: string): boolean {
  const left = normalizePhone(a);
  const right = normalizePhone(b);
  if (!left || !right) return false;
  if (left === right || left.endsWith(right) || right.endsWith(left)) return true;
  const leftCore = phoneCore(left);
  const rightCore = phoneCore(right);
  if (leftCore.length >= 10 && leftCore === rightCore) return true;
  if (left.length >= 10 && right.length >= 10) {
    const shorter = left.length <= right.length ? left : right;
    const longer = left.length <= right.length ? right : left;
    if (longer.startsWith(shorter) && longer.length - shorter.length <= 2) return true;
  }
  return false;
}

function accessSecret(): string {
  return process.env.TEACHER_PIN || "mostafa2026";
}

function digestBytes(kind: "code" | "id", name: string, phone: string): Buffer {
  return createHmac("sha256", accessSecret()).update(
    `${kind}|${normalizeName(name)}|${normalizePhone(phone)}`,
  ).digest();
}

export function codeForStudent(name: string, phone: string): string {
  const digest = digestBytes("code", name, phone);
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += ALPHABET[digest[i]! % ALPHABET.length];
  }
  return `MOST-${out}`;
}

export function idForStudent(name: string, phone: string): string {
  return digestBytes("id", name, phone).toString("hex").slice(0, 16);
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function recordFor(
  name: string,
  phone: string,
  extra?: Partial<AccessCode>,
): AccessCode {
  return {
    id: extra?.id ?? idForStudent(name, phone),
    code: extra?.code ?? codeForStudent(name, phone),
    name,
    phone,
    createdAt: extra?.createdAt ?? new Date().toISOString(),
    usedAt: extra?.usedAt ?? null,
    usedById: extra?.usedById ?? null,
    points: extra?.points ?? 0,
    suspendedAt: extra?.suspendedAt ?? null,
    suspendReason: extra?.suspendReason ?? "",
    track: extra?.track === "en" ? "en" : "ar",
  };
}

export async function listCodes(): Promise<AccessCode[]> {
  const store = await readStore();
  return store.codes
    .map((row) => ({
      ...row,
      points: displayPoints(row.points, row.id, store.homework, store.exams),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function issueCode(input: {
  name: string;
  phone: string;
  track?: "ar" | "en";
}): Promise<AccessCode> {
  const name = input.name.trim();
  const phone = normalizePhone(input.phone);
  const track = input.track === "en" ? "en" : "ar";
  if (name.length < 3) {
    throw new Error("NAME");
  }
  if (phone.length < 10) {
    throw new Error("PHONE");
  }

  const store = await readStore();
  const existing = store.codes.find(
    (item) =>
      phonesMatch(item.phone, phone) && normalizeName(item.name) === normalizeName(name),
  );
  if (existing) {
    existing.code = codeForStudent(name, phone);
    existing.id = existing.id || idForStudent(name, phone);
    existing.track = track;
    await writeStore(store);
    await persistCodeTrack(existing.id, track, existing.code);
    return existing;
  }

  const record = recordFor(name, phone, { track });
  store.codes.unshift(record);
  await writeStore(store);
  await persistCodeTrack(record.id, track, record.code);
  return record;
}

async function persistCodeTrack(studentId: string, track: "ar" | "en", code?: string): Promise<void> {
  try {
    const { writeCodeTracks } = await import("@/lib/class-db");
    await writeCodeTracks([{ id: studentId, track, code }]);
  } catch {
    // JSON / Blob fallback already wrote the store.
  }
}

export async function setStudentTrack(studentId: string, track: "ar" | "en", code?: string): Promise<void> {
  const store = await readStore();
  const next = track === "en" ? "en" : "ar";
  const row = store.codes.find((item) => item.id === studentId);
  if (row) {
    row.track = next;
    await writeStore(store);
    await persistCodeTrack(studentId, next, code || row.code);
    return;
  }
  await persistCodeTrack(studentId, next, code);
}

export async function redeemCode(input: {
  name: string;
  phone: string;
  code: string;
}): Promise<AccessCode> {
  const name = input.name.trim();
  const phone = normalizePhone(input.phone);
  const code = normalizeCode(input.code);
  const expected = normalizeCode(codeForStudent(name, phone));
  const store = await readStore();
  const record =
    store.codes.find((item) => normalizeCode(item.code) === code) ??
    (code === expected ? recordFor(name, phone) : null);

  if (!record) {
    throw new Error("NOT_FOUND");
  }
  if (record.suspendedAt) {
    throw new Error("SUSPENDED");
  }
  if (!phonesMatch(record.phone, phone)) {
    throw new Error("PHONE_MISMATCH");
  }
  if (normalizeName(record.name) !== normalizeName(name)) {
    throw new Error("NAME_MISMATCH");
  }
  if (!record.usedAt) {
    record.usedAt = new Date().toISOString();
    record.usedById = record.id;
  }
  if (!store.codes.some((item) => item.id === record.id)) {
    store.codes.unshift(record);
  }
  await writeStore(store);
  return record;
}

export async function getCodeById(id: string): Promise<AccessCode | null> {
  const store = await readStore();
  const record = store.codes.find((item) => item.id === id);
  if (!record) return null;
  return {
    ...record,
    points: displayPoints(record.points, id, store.homework, store.exams),
  };
}

export async function addPoints(id: string, delta: number): Promise<number> {
  const store = await readStore();
  const record = store.codes.find((item) => item.id === id);
  if (!record) return 0;
  const base = displayPoints(record.points, id, store.homework, store.exams);
  record.points = Math.max(0, base + (Number.isFinite(delta) ? delta : 0));
  try {
    const { setClassCodePoints } = await import("@/lib/class-db");
    const saved = await setClassCodePoints(id, record.points);
    if (saved !== null) record.points = Math.max(record.points, saved);
  } catch {
    // JSON / Blob fallback still writes below.
  }
  await writeStore(store);
  return record.points;
}

export async function saveExam(submission: ExamSubmission): Promise<void> {
  const store = await readStore();
  store.exams.unshift(submission);
  await writeStore(store);
}

export async function listExams(): Promise<ExamSubmission[]> {
  const store = await readStore();
  return store.exams;
}

export async function latestExam(
  studentId: string,
  chapterId: string,
): Promise<ExamSubmission | undefined> {
  const store = await readStore();
  return store.exams.find(
    (item) => item.studentId === studentId && item.chapterId === chapterId,
  );
}

export async function listExamChapterIds(studentId: string): Promise<string[]> {
  const store = await readStore();
  return [
    ...new Set(
      store.exams
        .filter(
          (item) =>
            item.studentId === studentId &&
            item.objectiveTotal > 0 &&
            item.objectiveScore / item.objectiveTotal >= 0.7,
        )
        .map((item) => item.chapterId),
    ),
  ];
}

export async function saveHomework(result: HomeworkResult): Promise<void> {
  const store = await readStore();
  const previous = store.homework.find(
    (item) => item.studentId === result.studentId && item.lessonId === result.lessonId,
  );
  const score = Math.max(result.score, previous?.score ?? 0);
  store.homework = store.homework.filter(
    (item) => !(item.studentId === result.studentId && item.lessonId === result.lessonId),
  );
  store.homework.unshift({
    ...result,
    score,
    passed: result.passed || Boolean(previous?.passed),
    submittedAt: score === result.score ? result.submittedAt : (previous?.submittedAt ?? result.submittedAt),
  });
  const record = store.codes.find((item) => item.id === result.studentId);
  if (record) {
    record.points = displayPoints(record.points, result.studentId, store.homework, store.exams);
  }
  await writeStore(store);
  if (record) {
    try {
      const { setClassCodePoints } = await import("@/lib/class-db");
      await setClassCodePoints(result.studentId, record.points);
    } catch {
      // The store write already kept the homework score.
    }
  }
}

export async function listPassedHomework(studentId: string): Promise<string[]> {
  const store = await readStore();
  return store.homework
    .filter((item) => item.studentId === studentId && item.passed)
    .map((item) => item.lessonId);
}

export async function listHomeworkResults(): Promise<HomeworkResult[]> {
  const store = await readStore();
  return store.homework;
}

export async function grantChapterUnlock(input: {
  studentId: string;
  chapterId: string;
  reason: string;
}): Promise<void> {
  const store = await readStore();
  store.unlocks = store.unlocks.filter(
    (item) => !(item.studentId === input.studentId && item.chapterId === input.chapterId),
  );
  store.unlocks.unshift({
    studentId: input.studentId,
    chapterId: input.chapterId,
    reason: input.reason.trim() || "exception",
    createdAt: new Date().toISOString(),
  });
  await writeStore(store);
}

export async function listUnlocks(studentId: string): Promise<string[]> {
  const store = await readStore();
  return store.unlocks
    .filter((item) => item.studentId === studentId)
    .map((item) => item.chapterId);
}

export async function saveEssayGrade(grade: EssayGrade): Promise<void> {
  const store = await readStore();
  store.essayGrades = store.essayGrades.filter(
    (item) => !(item.examId === grade.examId && item.questionId === grade.questionId),
  );
  store.essayGrades.unshift(grade);
  await writeStore(store);
}

export async function listEssayGrades(studentId: string, examId?: string): Promise<EssayGrade[]> {
  const store = await readStore();
  return store.essayGrades.filter(
    (item) =>
      item.studentId === studentId && (examId ? item.examId === examId : true),
  );
}

export async function listAllEssayGrades(): Promise<EssayGrade[]> {
  return (await readStore()).essayGrades;
}

function sanitizeMessage(body: string): string {
  return body.replace(/\s+/g, " ").trim().slice(0, 800);
}

function threadFromMessages(
  studentId: string,
  studentName: string,
  messages: ChatMessage[],
  phone?: string,
): ChatThread {
  const mine = messages
    .filter((item) => item.studentId === studentId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return {
    studentId,
    studentName,
    phone,
    messages: mine,
    lastAt: mine.at(-1)?.createdAt ?? "",
    unreadForTeacher: mine.filter((item) => item.from === "student" && !item.readByTeacher).length,
    unreadForStudent: mine.filter((item) => item.from === "teacher" && !item.readByStudent).length,
  };
}

export async function listStudentMessages(studentId: string): Promise<ChatMessage[]> {
  const store = await readStore();
  return store.messages
    .filter((item) => item.studentId === studentId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function listChatThreads(): Promise<ChatThread[]> {
  const store = await readStore();
  const byStudent = new Map<string, { name: string; phone?: string }>();
  for (const code of store.codes) {
    byStudent.set(code.id, { name: code.name, phone: code.phone });
  }
  for (const message of store.messages) {
    if (!byStudent.has(message.studentId)) {
      byStudent.set(message.studentId, { name: message.studentName });
    }
  }
  return [...byStudent.entries()]
    .map(([studentId, meta]) =>
      threadFromMessages(studentId, meta.name, store.messages, meta.phone),
    )
    .filter((thread) => thread.messages.length > 0)
    .sort((a, b) => (b.lastAt || "").localeCompare(a.lastAt || ""));
}

export async function appendChatMessage(input: {
  studentId: string;
  studentName: string;
  from: "student" | "teacher";
  body: string;
}): Promise<ChatMessage | null> {
  const body = sanitizeMessage(input.body);
  if (!body || !input.studentId) return null;

  const store = await readStore();
  const message: ChatMessage = {
    id: randomBytes(8).toString("hex"),
    studentId: input.studentId,
    studentName: input.studentName.trim() || "Student",
    from: input.from,
    body,
    createdAt: new Date().toISOString(),
    readByTeacher: input.from === "teacher",
    readByStudent: input.from === "student",
  };
  store.messages.push(message);
  try {
    const { insertChatMessageRow } = await import("@/lib/class-db");
    const saved = await insertChatMessageRow(message);
    if (saved) return message;
  } catch {
    // Fall through to the class store write.
  }
  await writeStore(store);
  return message;
}

export async function markChatRead(
  studentId: string,
  reader: "student" | "teacher",
): Promise<void> {
  const store = await readStore();
  let changed = false;
  for (const message of store.messages) {
    if (message.studentId !== studentId) continue;
    if (reader === "teacher" && message.from === "student" && !message.readByTeacher) {
      message.readByTeacher = true;
      changed = true;
    }
    if (reader === "student" && message.from === "teacher" && !message.readByStudent) {
      message.readByStudent = true;
      changed = true;
    }
  }
  if (!changed) return;
  try {
    const { markChatReadRows } = await import("@/lib/class-db");
    const saved = await markChatReadRows(studentId, reader);
    if (saved) return;
  } catch {
    // Fall through to the class store write.
  }
  await writeStore(store);
}

export async function listAttendance(): Promise<AttendanceRow[]> {
  return (await readStore()).attendance;
}

export async function markAttendance(input: {
  studentId: string;
  date: string;
  present: boolean;
}): Promise<void> {
  const [store, makeups, window] = await Promise.all([readStore(), listMakeups(), getExamWindow()]);
  store.attendance = store.attendance.filter(
    (row) => !(row.studentId === input.studentId && row.date === input.date),
  );
  store.attendance.unshift({
    studentId: input.studentId,
    date: input.date,
    present: input.present,
    createdAt: new Date().toISOString(),
  });
  store.makeups = makeups;
  await writeStore(store);
  if (input.present) {
    const next = makeups.filter(
      (task) => !(task.studentId === input.studentId && task.date === input.date && !task.completedAt),
    );
    if (next.length !== makeups.length) await persistMakeups(next);
    return;
  }
  await assignMakeup({
    studentId: input.studentId,
    date: input.date,
    chapterId: window?.chapterId,
  });
}

export async function listPayments(): Promise<MonthPayment[]> {
  let fromDb: MonthPayment[] | null = null;
  try {
    const { readPaymentRows } = await import("@/lib/class-db");
    fromDb = await readPaymentRows();
  } catch {
    fromDb = null;
  }
  const local = parsePayments((await readLocalStore())?.payments);
  if (fromDb && fromDb.length) return fromDb;
  if (local.length) return local;
  return fromDb ?? [];
}

async function persistPayments(rows: MonthPayment[]): Promise<void> {
  try {
    const { writePaymentRows } = await import("@/lib/class-db");
    await writePaymentRows(rows);
  } catch {
    // Fall through to the class store.
  }
  const store = await readStore();
  store.payments = rows;
  await writeStore(store, { replacePayments: true });
  try {
    const { writePaymentRows } = await import("@/lib/class-db");
    await writePaymentRows(rows);
  } catch {
    // Local /tmp still has the fees if Postgres is down.
  }
}

export async function setMonthPaid(input: { studentId: string; paid: boolean }): Promise<void> {
  const month = cairoMonth();
  const rows = await listPayments();
  const next = rows.filter((row) => !(row.studentId === input.studentId && row.month === month));
  next.unshift({
    studentId: input.studentId,
    month,
    paid: input.paid,
    updatedAt: new Date().toISOString(),
  });
  await persistPayments(next);
  if (!input.paid) return;
  const store = await readStore();
  const record = store.codes.find((item) => item.id === input.studentId);
  if (record?.suspendedAt && (!record.suspendReason || record.suspendReason === "اشتراك")) {
    await setSuspended({ studentId: input.studentId, suspended: false });
  }
}

export async function setSuspended(input: {
  studentId: string;
  suspended: boolean;
  reason?: string;
}): Promise<void> {
  const store = await readStore();
  const record = store.codes.find((item) => item.id === input.studentId);
  if (!record) return;
  record.suspendedAt = input.suspended ? new Date().toISOString() : null;
  record.suspendReason = input.suspended ? (input.reason ?? "").trim() : "";
  await writeStore(store);
}

export async function getAnnouncement(): Promise<ClassAnnouncement | null> {
  return (await readStore()).announcement;
}

export async function setAnnouncement(body: string): Promise<void> {
  const store = await readStore();
  const text = body.replace(/\s+/g, " ").trim().slice(0, 240);
  store.announcement = text
    ? {
        id: randomBytes(6).toString("hex"),
        body: text,
        createdAt: new Date().toISOString(),
        active: true,
      }
    : null;
  await writeStore(store);
}

export async function getExamWindow(): Promise<ExamWindow | null> {
  try {
    const { readExamWindowRow } = await import("@/lib/class-db");
    const fromDb = await readExamWindowRow();
    if (fromDb) return fromDb;
  } catch {
    // Table may not exist yet.
  }
  return (await readStore()).examWindow;
}

async function persistExamWindow(window: ExamWindow | null): Promise<void> {
  try {
    const { writeExamWindowRow } = await import("@/lib/class-db");
    await writeExamWindowRow(window);
  } catch {
    // Fall through to the class store.
  }
  const store = await readStore();
  store.examWindow = window;
  await writeStore(store);
  try {
    const { writeExamWindowRow } = await import("@/lib/class-db");
    await writeExamWindowRow(window);
  } catch {
    // Local /tmp still has the window if Postgres is down.
  }
}

export async function startExamWindow(
  chapterId: string,
  seconds: number,
  mode: ExamMode = "class",
): Promise<ExamWindow> {
  const duration = Math.min(Math.max(seconds, 60), 3 * 60 * 60);
  const opensAt = new Date();
  const window: ExamWindow = {
    id: "current",
    chapterId,
    opensAt: opensAt.toISOString(),
    closesAt: new Date(opensAt.getTime() + duration * 1000).toISOString(),
    mode,
  };
  await persistExamWindow(window);
  return window;
}

export async function getWeekPlan(): Promise<WeekSlot[]> {
  try {
    const { readWeekPlanRow } = await import("@/lib/class-db");
    const fromDb = await readWeekPlanRow();
    if (fromDb) return fromDb;
  } catch {
    // Table may not exist yet.
  }
  return parseWeekSlots((await readStore()).weekPlan);
}

async function persistWeekPlan(slots: WeekSlot[]): Promise<void> {
  const next = sortWeekSlots(slots);
  try {
    const { writeWeekPlanRow } = await import("@/lib/class-db");
    await writeWeekPlanRow(next);
  } catch {
    // Fall through to the class store.
  }
  const store = await readStore();
  store.weekPlan = next;
  await writeStore(store);
  try {
    const { writeWeekPlanRow } = await import("@/lib/class-db");
    await writeWeekPlanRow(next);
  } catch {
    // Local /tmp still has the plan if Postgres is down.
  }
}

export async function addWeekSlot(input: { weekday: number; startTime: string; topic: string }): Promise<WeekSlot[]> {
  const slots = await getWeekPlan();
  slots.push({
    id: randomBytes(4).toString("hex"),
    weekday: input.weekday,
    startTime: input.startTime,
    topic: input.topic.trim(),
  });
  await persistWeekPlan(slots);
  return slots;
}

export async function removeWeekSlot(id: string): Promise<WeekSlot[]> {
  const slots = (await getWeekPlan()).filter((slot) => slot.id !== id);
  await persistWeekPlan(slots);
  return slots;
}

export async function closeExamWindow(): Promise<void> {
  await persistExamWindow(null);
}

async function dedicatedSurprise(): Promise<{
  question: SurpriseQuestion | null;
  answers: SurpriseAnswer[];
} | null> {
  try {
    const { readSurpriseState } = await import("@/lib/class-db");
    return await readSurpriseState();
  } catch {
    return null;
  }
}

export async function getSurprise(): Promise<SurpriseQuestion | null> {
  const dedicated = await dedicatedSurprise();
  if (dedicated?.question) return dedicated.question;
  return parseSurprise((await readStore()).surprise);
}

export async function listSurpriseAnswers(surpriseId?: string): Promise<SurpriseAnswer[]> {
  const dedicated = await dedicatedSurprise();
  const rows = dedicated?.answers.length
    ? dedicated.answers
    : parseSurpriseAnswers((await readStore()).surpriseAnswers);
  return surpriseId ? rows.filter((row) => row.surpriseId === surpriseId) : rows;
}

export async function startSurprise(chapterId: ChapterId): Promise<SurpriseQuestion> {
  const question = pickSurpriseQuestion(chapterId);
  if (!question) {
    throw new Error("NO_QUESTION");
  }
  try {
    const { writeSurpriseState } = await import("@/lib/class-db");
    const saved = await writeSurpriseState(question, []);
    const url =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL ||
      "";
    const liveDb = Boolean(url) && !url.includes("build:build@127.0.0.1");
    if (liveDb && !saved) throw new Error("SAVE");
  } catch (error) {
    if (error instanceof Error && error.message === "SAVE") throw error;
    const url =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL ||
      "";
    if (url && !url.includes("build:build@127.0.0.1")) throw new Error("SAVE");
  }
  const store = await readStore();
  store.surprise = question;
  store.surpriseAnswers = [];
  await writeStore(store, { replaceSurprise: true });
  return question;
}

export async function closeSurprise(): Promise<void> {
  const current = await getSurprise();
  const closed = current ? { ...current, closesAt: new Date().toISOString() } : null;
  const answers = current ? await listSurpriseAnswers(current.id) : [];
  try {
    const { writeSurpriseState } = await import("@/lib/class-db");
    await writeSurpriseState(closed, answers);
  } catch {
    // Fall through to the class store.
  }
  const store = await readStore();
  if (store.surprise) {
    store.surprise = { ...store.surprise, closesAt: new Date().toISOString() };
  }
  await writeStore(store, { replaceSurprise: true });
}

export async function answerSurprise(input: {
  studentId: string;
  choice: number;
}): Promise<SurpriseAnswer | null> {
  const question = await getSurprise();
  if (!question || !surpriseOpen(question)) return null;
  const current = await listSurpriseAnswers(question.id);
  const existing = current.find((row) => row.studentId === input.studentId);
  if (existing) return existing;
  const choice = Math.floor(input.choice);
  if (!Number.isFinite(choice) || choice < 0 || choice >= question.optionsAr.length) {
    return null;
  }
  const row: SurpriseAnswer = {
    studentId: input.studentId,
    surpriseId: question.id,
    choice,
    correct: choice === question.correctIndex,
    answeredAt: new Date().toISOString(),
  };
  try {
    const { writeSurpriseState } = await import("@/lib/class-db");
    await writeSurpriseState(question, [...current, row]);
  } catch {
    // Fall through to the class store.
  }
  const store = await readStore();
  store.surprise = question;
  store.surpriseAnswers = [...current, row];
  await writeStore(store, { replaceSurprise: true });
  return row;
}

export async function listPresence(): Promise<PresencePing[]> {
  return parsePresence((await readStore()).presence);
}

export async function pingPresence(input: {
  studentId: string;
  name: string;
  path: string;
}): Promise<PresencePing> {
  const row: PresencePing = {
    studentId: input.studentId,
    name: input.name.replace(/\s+/g, " ").trim().slice(0, 80) || input.studentId,
    path: input.path.slice(0, 180),
    screen: screenFromPath(input.path),
    at: new Date().toISOString(),
  };
  const store = await readStore();
  store.presence = [...parsePresence(store.presence).filter((item) => item.studentId !== row.studentId), row];
  await writeStore(store, { replacePresence: true });
  return row;
}

export async function listClassSessions(): Promise<ClassSession[]> {
  let fromDb: ClassSession[] | null = null;
  try {
    const { readSessionRows } = await import("@/lib/class-db");
    fromDb = await readSessionRows();
  } catch {
    fromDb = null;
  }
  const local = parseClassSessions((await readLocalStore())?.sessions);
  if (fromDb && fromDb.length) return fromDb;
  if (local.length) return local;
  return fromDb ?? [];
}

async function persistSessions(sessions: ClassSession[]): Promise<void> {
  try {
    const { writeSessionRows } = await import("@/lib/class-db");
    await writeSessionRows(sessions);
  } catch {
    // Fall through to the class store.
  }
  const store = await readStore();
  store.sessions = sessions;
  await writeStore(store);
  try {
    const { writeSessionRows } = await import("@/lib/class-db");
    await writeSessionRows(sessions);
  } catch {
    // Local /tmp still has the archive if Postgres is down.
  }
}

export async function listMakeups(): Promise<MakeupTask[]> {
  let fromDb: MakeupTask[] | null = null;
  try {
    const { readMakeupRows } = await import("@/lib/class-db");
    fromDb = await readMakeupRows();
  } catch {
    fromDb = null;
  }
  const local = parseMakeups((await readLocalStore())?.makeups);
  if (fromDb && fromDb.length) return fromDb;
  if (local.length) return local;
  return fromDb ?? [];
}

async function persistMakeups(tasks: MakeupTask[]): Promise<void> {
  try {
    const { writeMakeupRows } = await import("@/lib/class-db");
    await writeMakeupRows(tasks);
  } catch {
    // Fall through to the class store.
  }
  const store = await readStore();
  store.makeups = tasks;
  await writeStore(store, { replaceMakeups: true });
  try {
    const { writeMakeupRows } = await import("@/lib/class-db");
    await writeMakeupRows(tasks);
  } catch {
    // Local /tmp still has the makeup if Postgres is down.
  }
}

export async function listStudentMakeups(studentId: string): Promise<MakeupTask[]> {
  return (await listMakeups()).filter((task) => task.studentId === studentId);
}

export async function assignMakeup(input: {
  studentId: string;
  date: string;
  chapterId?: string | null;
}): Promise<MakeupTask> {
  const tasks = await listMakeups();
  const existing = tasks.find((task) => task.studentId === input.studentId && task.date === input.date);
  if (existing) return existing;
  const lesson = lessonForMakeup(input.chapterId === "mix" ? undefined : input.chapterId);
  const task: MakeupTask = {
    studentId: input.studentId,
    date: input.date,
    lessonId: lesson.lessonId,
    chapterId: lesson.chapterId,
    dueDate: addCairoDays(input.date, MAKEUP_DAYS),
    completedAt: null,
    score: null,
    total: null,
  };
  await persistMakeups([task, ...tasks]);
  return task;
}

export async function completeMakeup(
  studentId: string,
  date: string,
  score: number,
  total: number,
): Promise<void> {
  const tasks = await listMakeups();
  const row = tasks.find((task) => task.studentId === studentId && task.date === date);
  if (!row || row.completedAt) return;
  row.completedAt = new Date().toISOString();
  row.score = score;
  row.total = total;
  await persistMakeups(tasks);
}

export async function archiveClassSession(codes: AccessCode[]): Promise<ClassSession> {
  const [exams, attendance, window] = await Promise.all([listExams(), listAttendance(), getExamWindow()]);
  const session = buildClassSession({
    id: randomBytes(6).toString("hex"),
    codes,
    exams,
    attendance,
    window,
  });
  const next = upsertSession(await listClassSessions(), session);
  await persistSessions(next);
  const absentees = session.students.filter((row) => row.present === false);
  if (absentees.length) {
    const tasks = await listMakeups();
    let changed = false;
    for (const row of absentees) {
      if (tasks.some((task) => task.studentId === row.studentId && task.date === session.date)) continue;
      const lesson = lessonForMakeup(session.chapterId === "mix" ? undefined : session.chapterId);
      tasks.unshift({
        studentId: row.studentId,
        date: session.date,
        lessonId: lesson.lessonId,
        chapterId: lesson.chapterId,
        dueDate: addCairoDays(session.date, MAKEUP_DAYS),
        completedAt: null,
        score: null,
        total: null,
      });
      changed = true;
    }
    if (changed) await persistMakeups(tasks);
  }
  return session;
}

export async function recordMisses(rows: MissedQuestion[]): Promise<void> {
  if (rows.length === 0) return;
  const store = await readStore();
  for (const row of rows) {
    store.misses = store.misses.filter(
      (item) => !(item.studentId === row.studentId && item.questionKey === row.questionKey),
    );
    store.misses.unshift(row);
  }
  await writeStore(store);
}

export async function listDueMisses(studentId: string, afterMs: number): Promise<MissedQuestion[]> {
  const store = await readStore();
  const cutoff = Date.now() - afterMs;
  return store.misses.filter(
    (item) =>
      item.studentId === studentId &&
      !item.clearedAt &&
      new Date(item.missedAt).getTime() <= cutoff,
  );
}

export async function listWaitingMisses(studentId: string): Promise<MissedQuestion[]> {
  const store = await readStore();
  return store.misses.filter((item) => item.studentId === studentId && !item.clearedAt);
}

export async function listAllMisses(): Promise<MissedQuestion[]> {
  return (await readStore()).misses.filter((item) => !item.clearedAt);
}

export async function listClassGroups(): Promise<ClassGroup[]> {
  return sortClassGroups(parseClassGroups((await readStore()).classGroups));
}

export async function persistClassGroups(groups: ClassGroup[]): Promise<void> {
  const store = await readStore();
  store.classGroups = sortClassGroups(parseClassGroups(groups));
  await writeStore(store, { replaceClassGroups: true });
}

export async function upsertClassGroup(input: {
  id?: string;
  name: string;
  weekday: number;
  startTime: string;
  place: string;
  nextLesson: string;
  studentIds: string[];
}): Promise<ClassGroup> {
  const groups = await listClassGroups();
  const id = input.id?.trim() || `group-${randomBytes(4).toString("hex")}`;
  const existing = groups.find((row) => row.id === id);
  const next: ClassGroup = {
    id,
    name: input.name.trim().slice(0, 80),
    weekday: input.weekday,
    startTime: input.startTime,
    place: input.place.trim().slice(0, 80),
    nextLesson: input.nextLesson.trim().slice(0, 160),
    studentIds: [...new Set(input.studentIds.map((id) => id.trim()).filter(Boolean))],
    remindedOn: existing?.remindedOn || "",
  };
  await persistClassGroups([...groups.filter((row) => row.id !== id), next]);
  return next;
}

export async function removeClassGroup(id: string): Promise<void> {
  await persistClassGroups((await listClassGroups()).filter((row) => row.id !== id));
}

export async function getTeacherTelegramChatId(): Promise<string> {
  return String((await readStore()).teacherTelegramChatId || "").trim();
}

export async function setTeacherTelegramChatId(chatId: string): Promise<void> {
  const store = await readStore();
  store.teacherTelegramChatId = chatId.trim();
  await writeStore(store);
  try {
    const { upsertTeacherTelegramChatId } = await import("@/lib/class-db");
    await upsertTeacherTelegramChatId(store.teacherTelegramChatId);
  } catch {
    // Dedicated teacher-chat column may not exist yet.
  }
}

export async function clearMiss(studentId: string, questionKey: string): Promise<void> {
  const store = await readStore();
  const row = store.misses.find(
    (item) => item.studentId === studentId && item.questionKey === questionKey,
  );
  if (!row) return;
  row.clearedAt = new Date().toISOString();
  await writeStore(store);
}

export async function getCertificate(studentId: string): Promise<CourseCertificate | null> {
  const store = await readStore();
  return store.certificates.find((row) => row.studentId === studentId) ?? null;
}

export async function getCertificateBySerial(serial: string): Promise<CourseCertificate | null> {
  const store = await readStore();
  const key = serial.trim().toUpperCase();
  return store.certificates.find((row) => row.serial.toUpperCase() === key) ?? null;
}

export async function listCertificates(): Promise<CourseCertificate[]> {
  return (await readStore()).certificates;
}

export async function issueCourseCertificate(input: {
  studentId: string;
  name: string;
  completed: Iterable<string>;
}): Promise<CourseCertificate | null> {
  if (!canIssueCertificate(input.completed)) return null;
  const existing = await getCertificate(input.studentId);
  if (existing) return existing;
  const store = await readStore();
  const year = cairoDate().slice(0, 4);
  const serial = nextCertificateSerial(store.certificates, year);
  const issued: CourseCertificate = {
    serial,
    studentId: input.studentId,
    name: input.name,
    issuedAt: new Date().toISOString(),
    average: courseAverage(store.exams, input.studentId),
    verifyCode: stampCertificate(serial, input.studentId),
    year,
  };
  store.certificates.unshift(issued);
  await writeStore(store, { replaceCertificates: true });
  try {
    const { upsertCertificateRow } = await import("@/lib/class-db");
    await upsertCertificateRow(issued);
  } catch {
    // Local store is enough if Prisma migrate has not run yet.
  }
  try {
    const { after } = await import("next/server");
    after(async () => {
      const { notifyCertificateIssued } = await import("@/lib/telegram-notify");
      await notifyCertificateIssued(issued);
    });
  } catch {
    // Notification is best-effort.
  }
  return issued;
}

export async function listTelegramLinks(studentId?: string): Promise<TelegramLink[]> {
  const rows = parseTelegramLinks((await readStore()).telegramLinks);
  return studentId ? rows.filter((row) => row.studentId === studentId) : rows;
}

export async function linkTelegramChat(input: {
  chatId: string;
  studentId: string;
  phone: string;
  parentName: string;
}): Promise<TelegramLink> {
  const store = await readStore();
  const linked: TelegramLink = {
    chatId: String(input.chatId),
    studentId: input.studentId,
    phone: input.phone,
    parentName: input.parentName,
    linkedAt: new Date().toISOString(),
  };
  store.telegramLinks = [
    linked,
    ...parseTelegramLinks(store.telegramLinks).filter((row) => row.chatId !== linked.chatId),
  ];
  await writeStore(store, { replaceTelegramLinks: true });
  try {
    const { upsertTelegramLinkRow } = await import("@/lib/class-db");
    await upsertTelegramLinkRow(linked);
  } catch {
    // Local store is enough if Prisma migrate has not run yet.
  }
  return linked;
}

export async function unlinkTelegramChat(chatId: string): Promise<void> {
  const store = await readStore();
  store.telegramLinks = parseTelegramLinks(store.telegramLinks).filter((row) => row.chatId !== chatId);
  await writeStore(store, { replaceTelegramLinks: true });
  try {
    const { deleteTelegramLinkRow } = await import("@/lib/class-db");
    await deleteTelegramLinkRow(chatId);
  } catch {
    // Local store is enough if Prisma migrate has not run yet.
  }
}

export async function getStoredTelegramToken(): Promise<string> {
  return String((await readStore()).telegramBotToken || "").trim();
}

export async function setStoredTelegramToken(token: string): Promise<void> {
  const store = await readStore();
  store.telegramBotToken = token.trim();
  await writeStore(store);
}

export function findCodeByPhone(phone: string, codes: { id: string; name: string; phone: string }[]) {
  const exact = codes.filter((row) => normalizePhone(row.phone) === normalizePhone(phone));
  if (exact.length) return exact[0] ?? null;
  const fuzzy = codes.filter((row) => phonesMatch(row.phone, phone));
  return fuzzy.length === 1 ? fuzzy[0] ?? null : null;
}

export async function listDevices(studentId?: string): Promise<StudentDevice[]> {
  try {
    const { readDeviceRows } = await import("@/lib/class-db");
    const dedicated = await readDeviceRows();
    if (dedicated) {
      const rows = parseDevices(dedicated);
      return studentId ? devicesForStudent(rows, studentId) : rows;
    }
  } catch {
    // Fall through to the class store.
  }
  const rows = parseDevices((await readStore()).devices);
  return studentId ? devicesForStudent(rows, studentId) : rows;
}

export async function getDeviceLimit(): Promise<DeviceLimit> {
  return parseDeviceLimit((await readStore()).deviceLimit);
}

export async function setDeviceLimit(limit: DeviceLimit): Promise<DeviceLimit> {
  const store = await readStore();
  const current = parseDevices(store.devices);
  const keep = new Set<string>();
  for (const studentId of new Set(current.map((row) => row.studentId))) {
    for (const row of allowedDevicesForStudent(current, studentId, limit)) {
      keep.add(row.id);
    }
  }
  const removed = current.filter((row) => !keep.has(row.id));
  store.deviceLimit = limit;
  store.devices = current.filter((row) => keep.has(row.id));
  await writeStore(store, { replaceDevices: true });
  try {
    const { upsertDeviceLimitRow, deleteDeviceRow } = await import("@/lib/class-db");
    await upsertDeviceLimitRow(limit);
    for (const row of removed) {
      await deleteDeviceRow(row.id);
    }
  } catch {
    // Local store is enough if Prisma migrate has not run yet.
  }
  return limit;
}

export async function claimStudentDevice(input: {
  studentId: string;
  deviceId: string;
  label: string;
  replace?: boolean;
}): Promise<StudentDevice> {
  const store = await readStore();
  const limit = parseDeviceLimit(store.deviceLimit);
  let rows = parseDevices(await listDevices());
  if (!canRegisterDevice(rows, input.studentId, input.deviceId, limit)) {
    if (!input.replace) throw new Error("DEVICE_LIMIT");
    const extras = devicesForStudent(rows, input.studentId)
      .filter((row) => row.deviceId !== input.deviceId)
      .sort((a, b) => a.lastAt.localeCompare(b.lastAt));
    const dropCount = Math.max(1, devicesForStudent(rows, input.studentId).length - limit + 1);
    const drop = extras.slice(0, dropCount);
    rows = rows.filter((row) => !drop.some((item) => item.id === row.id));
    for (const row of drop) {
      try {
        const { deleteDeviceRow } = await import("@/lib/class-db");
        await deleteDeviceRow(row.id);
      } catch {
        // Dedicated row may already be gone.
      }
    }
  }
  const now = new Date().toISOString();
  const existing = rows.find(
    (row) => row.studentId === input.studentId && row.deviceId === input.deviceId,
  );
  const claimed: StudentDevice = existing
    ? { ...existing, label: input.label || existing.label, lastAt: now }
    : {
        id: `${input.studentId}:${input.deviceId}`,
        studentId: input.studentId,
        deviceId: input.deviceId,
        label: input.label,
        firstAt: now,
        lastAt: now,
      };
  store.devices = [claimed, ...rows.filter((row) => row.id !== claimed.id)];
  await writeStore(store, { replaceDevices: true });
  try {
    const { upsertDeviceRow } = await import("@/lib/class-db");
    await upsertDeviceRow(claimed);
  } catch {
    // Local store is enough if Prisma migrate has not run yet.
  }
  return claimed;
}

export async function forgetStudentDevice(id: string): Promise<void> {
  const store = await readStore();
  store.devices = parseDevices(store.devices).filter((row) => row.id !== id);
  await writeStore(store, { replaceDevices: true });
  try {
    const { deleteDeviceRow } = await import("@/lib/class-db");
    await deleteDeviceRow(id);
  } catch {
    // Local store is enough if Prisma migrate has not run yet.
  }
}

export async function listLessonExamples(): Promise<ClassLessonExample[]> {
  try {
    const { readExampleRows } = await import("@/lib/class-db");
    return parseClassExamples(await readExampleRows());
  } catch {
    return [];
  }
}

export async function addLessonExample(input: {
  lessonId: string;
  bodyAr: string;
  bodyEn?: string;
}): Promise<ClassLessonExample | null> {
  const rows = parseClassExamples([
    {
      id: `ex-${randomBytes(4).toString("hex")}`,
      lessonId: input.lessonId,
      bodyAr: input.bodyAr,
      bodyEn: input.bodyEn || input.bodyAr,
      createdAt: new Date().toISOString(),
    },
    ...(await listLessonExamples()),
  ]);
  const saved = rows[0];
  if (!saved) return null;
  try {
    const { writeExampleRows } = await import("@/lib/class-db");
    await writeExampleRows(rows);
  } catch {
    return saved;
  }
  return saved;
}

export async function removeLessonExample(id: string): Promise<void> {
  const rows = (await listLessonExamples()).filter((row) => row.id !== id);
  try {
    const { writeExampleRows } = await import("@/lib/class-db");
    await writeExampleRows(rows);
  } catch {
    // Dedicated table may not exist yet.
  }
}

export async function classHomeworkQuestions(lessonId: string): Promise<HomeworkQuestion[]> {
  return questionsFromExamples(await listLessonExamples(), lessonId);
}

export async function listCommunityFeed(input: {
  viewerId: string;
  groupIds: string[];
  seeAll?: boolean;
}): Promise<CommunityFeedPost[]> {
  try {
    const { readCommunityState } = await import("@/lib/class-db");
    const state = await readCommunityState();
    return buildCommunityFeed(
      state.posts,
      state.comments,
      state.likes,
      input.viewerId,
      input.groupIds,
      input.seeAll,
    );
  } catch {
    return [];
  }
}

export async function createCommunityPost(input: {
  authorId: string;
  authorName: string;
  groupId?: string;
  body: string;
}): Promise<CommunityPost | null> {
  const body = cleanCommunityText(input.body, COMMUNITY_POST_MAX);
  if (body.length < 2) return null;
  const post: CommunityPost = {
    id: `p-${randomBytes(5).toString("hex")}`,
    authorId: input.authorId,
    authorName: input.authorName.replace(/\s+/g, " ").trim().slice(0, 80) || input.authorId,
    groupId: String(input.groupId || "").trim(),
    body,
    createdAt: new Date().toISOString(),
  };
  try {
    const { insertCommunityPostRow } = await import("@/lib/class-db");
    const saved = await insertCommunityPostRow(post);
    return saved ? post : null;
  } catch {
    return null;
  }
}

export async function removeCommunityPost(id: string, actorId: string, teacher: boolean): Promise<boolean> {
  try {
    const { readCommunityState, deleteCommunityPostRow } = await import("@/lib/class-db");
    const state = await readCommunityState();
    const post = state.posts.find((row) => row.id === id);
    if (!post) return false;
    if (!teacher && post.authorId !== actorId) return false;
    return await deleteCommunityPostRow(id);
  } catch {
    return false;
  }
}

export async function createCommunityComment(input: {
  postId: string;
  authorId: string;
  authorName: string;
  body: string;
}): Promise<CommunityComment | null> {
  const body = cleanCommunityText(input.body, COMMUNITY_COMMENT_MAX);
  if (body.length < 1) return null;
  const comment: CommunityComment = {
    id: `c-${randomBytes(5).toString("hex")}`,
    postId: input.postId,
    authorId: input.authorId,
    authorName: input.authorName.replace(/\s+/g, " ").trim().slice(0, 80) || input.authorId,
    body,
    createdAt: new Date().toISOString(),
  };
  try {
    const { insertCommunityCommentRow } = await import("@/lib/class-db");
    const saved = await insertCommunityCommentRow(comment);
    return saved ? comment : null;
  } catch {
    return null;
  }
}

export async function removeCommunityComment(id: string, actorId: string, teacher: boolean): Promise<boolean> {
  try {
    const { readCommunityState, deleteCommunityCommentRow } = await import("@/lib/class-db");
    const state = await readCommunityState();
    const comment = state.comments.find((row) => row.id === id);
    if (!comment) return false;
    if (!teacher && comment.authorId !== actorId) return false;
    return await deleteCommunityCommentRow(id);
  } catch {
    return false;
  }
}

export async function toggleCommunityLike(postId: string, studentId: string): Promise<boolean> {
  try {
    const { toggleCommunityLikeRow } = await import("@/lib/class-db");
    return await toggleCommunityLikeRow(postId, studentId);
  } catch {
    return false;
  }
}
