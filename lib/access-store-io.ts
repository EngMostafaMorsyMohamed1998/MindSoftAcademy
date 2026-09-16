import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
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
import { parseExamChapter } from "@/lib/class-clock";
import { parseClassSessions, type ClassSession } from "@/lib/class-session";
import { DEFAULT_MONTHLY_FEE, parseMonthlyFee, parsePayments, type MonthPayment } from "@/lib/fees";
import { parseMakeups, type MakeupTask } from "@/lib/makeup";
import {
  parseSurprise,
  parseSurpriseAnswers,
  type SurpriseAnswer,
  type SurpriseQuestion,
} from "@/lib/surprise";
import { parseCertificates, type CourseCertificate } from "@/lib/certificates";
import { parseTelegramLinks, type TelegramLink } from "@/lib/telegram";
import { DEFAULT_DEVICE_LIMIT, parseDeviceLimit, parseDevices, type DeviceLimit, type StudentDevice } from "@/lib/devices";
import { parsePresence, type PresencePing } from "@/lib/presence";
import { parseWeekSlots, type WeekSlot } from "@/lib/week-plan";

export type StoreFile = {
  codes: AccessCode[];
  exams: ExamSubmission[];
  messages: ChatMessage[];
  homework: HomeworkResult[];
  unlocks: ChapterUnlock[];
  essayGrades: EssayGrade[];
  attendance: AttendanceRow[];
  announcement: ClassAnnouncement | null;
  examWindow: ExamWindow | null;
  misses: MissedQuestion[];
  weekPlan: WeekSlot[];
  sessions: ClassSession[];
  makeups: MakeupTask[];
  payments: MonthPayment[];
  monthlyFee: number;
  devices: StudentDevice[];
  deviceLimit: DeviceLimit;
  certificates: CourseCertificate[];
  telegramLinks: TelegramLink[];
  surprise: SurpriseQuestion | null;
  surpriseAnswers: SurpriseAnswer[];
  presence: PresencePing[];
};

const BLOB_KEY = "mindsoft-access-store.json";

function localPath(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", BLOB_KEY);
  }
  return path.join(process.cwd(), "data", "access-store.json");
}

export function emptyStore(): StoreFile {
  return {
    codes: [],
    exams: [],
    messages: [],
    homework: [],
    unlocks: [],
    essayGrades: [],
    attendance: [],
    announcement: null,
    examWindow: null,
    misses: [],
    weekPlan: [],
    sessions: [],
    makeups: [],
    payments: [],
    monthlyFee: DEFAULT_MONTHLY_FEE,
    devices: [],
    deviceLimit: DEFAULT_DEVICE_LIMIT,
    certificates: [],
    telegramLinks: [],
    surprise: null,
    surpriseAnswers: [],
    presence: [],
  };
}

function asExamWindow(value: ExamWindow | null | undefined): ExamWindow | null {
  if (!value) return null;
  const parsed = parseExamChapter(value.chapterId);
  return {
    id: value.id || "current",
    chapterId: parsed.chapterId,
    opensAt: value.opensAt,
    closesAt: value.closesAt,
    mode: value.mode === "ministry" || parsed.mode === "ministry" ? "ministry" : "class",
  };
}

function asCode(row: AccessCode): AccessCode {
  return {
    ...row,
    suspendedAt: row.suspendedAt ?? null,
    suspendReason: row.suspendReason ?? "",
  };
}

export function parseStore(value: unknown): StoreFile {
  if (typeof value !== "object" || value === null) {
    return emptyStore();
  }
  const parsed = value as StoreFile;
  return {
    codes: Array.isArray(parsed.codes) ? parsed.codes.map(asCode) : [],
    exams: Array.isArray(parsed.exams) ? parsed.exams : [],
    messages: Array.isArray(parsed.messages) ? parsed.messages : [],
    homework: Array.isArray(parsed.homework) ? parsed.homework : [],
    unlocks: Array.isArray(parsed.unlocks) ? parsed.unlocks : [],
    essayGrades: Array.isArray(parsed.essayGrades) ? parsed.essayGrades : [],
    attendance: Array.isArray(parsed.attendance) ? parsed.attendance : [],
    announcement: parsed.announcement ?? null,
    examWindow: asExamWindow(parsed.examWindow),
    misses: Array.isArray(parsed.misses) ? parsed.misses : [],
    weekPlan: parseWeekSlots(parsed.weekPlan),
    sessions: parseClassSessions(parsed.sessions),
    makeups: parseMakeups(parsed.makeups),
    payments: parsePayments(parsed.payments),
    monthlyFee: parseMonthlyFee(parsed.monthlyFee),
    devices: parseDevices(parsed.devices),
    deviceLimit: parseDeviceLimit(parsed.deviceLimit),
    certificates: parseCertificates(parsed.certificates),
    telegramLinks: parseTelegramLinks(parsed.telegramLinks),
    surprise: parseSurprise(parsed.surprise),
    surpriseAnswers: parseSurpriseAnswers(parsed.surpriseAnswers),
    presence: parsePresence(parsed.presence),
  };
}

export async function readLocalStore(): Promise<StoreFile | null> {
  try {
    const raw = await readFile(localPath(), "utf8");
    return parseStore(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function writeLocal(store: StoreFile): Promise<void> {
  const filePath = localPath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(store, null, 2), "utf8");
}

async function readBlob(): Promise<StoreFile | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL) {
    return null;
  }
  try {
    const { get } = await import("@vercel/blob");
    const result = await get(BLOB_KEY, { access: "private", useCache: false });
    if (!result?.stream) return null;
    const text = await new Response(result.stream).text();
    return parseStore(JSON.parse(text));
  } catch {
    return null;
  }
  return null;
}

async function writeBlob(store: StoreFile): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL) {
    return;
  }
  try {
    const { put } = await import("@vercel/blob");
    await put(BLOB_KEY, JSON.stringify(store), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
  } catch {
    // Blob is optional until a store is connected in the Vercel dashboard.
  }
}

export async function readStore(): Promise<StoreFile> {
  try {
    const { readClassDb } = await import("@/lib/class-db");
    const fromDb = await readClassDb();
    if (fromDb) {
      try {
        const { readDeviceLimitRow, readDeviceRows } = await import("@/lib/class-db");
        const dedicated = await readDeviceRows();
        if (dedicated?.length) fromDb.devices = dedicated;
        const limit = await readDeviceLimitRow();
        if (limit) fromDb.deviceLimit = limit;
        const { readCertificateRows } = await import("@/lib/class-db");
        const certs = await readCertificateRows();
        if (certs?.length) fromDb.certificates = certs;
        const { readTelegramLinkRows } = await import("@/lib/class-db");
        const telegram = await readTelegramLinkRows();
        if (telegram?.length) fromDb.telegramLinks = telegram;
      } catch {
        // Dedicated device tables may not exist yet.
      }
      const local = await readLocalStore();
      if (local) {
        if (!fromDb.codes.length && local.codes.length) fromDb.codes = local.codes;
        fromDb.monthlyFee = parseMonthlyFee(local.monthlyFee);
        if (!fromDb.devices.length) fromDb.devices = parseDevices(local.devices);
        if (!fromDb.deviceLimit) fromDb.deviceLimit = parseDeviceLimit(local.deviceLimit);
        if (!fromDb.certificates.length) fromDb.certificates = parseCertificates(local.certificates);
        if (!fromDb.telegramLinks?.length) fromDb.telegramLinks = parseTelegramLinks(local.telegramLinks);
        fromDb.surprise = parseSurprise(local.surprise);
        fromDb.surpriseAnswers = parseSurpriseAnswers(local.surpriseAnswers);
        fromDb.presence = parsePresence(local.presence);
      }
      return fromDb;
    }
  } catch {
    // Prisma client or database may not be ready yet.
  }
  const fromBlob = await readBlob();
  if (fromBlob) return fromBlob;
    return (await readLocalStore()) ?? emptyStore();
}

export async function writeStore(
  store: StoreFile,
  options?: {
    replaceMakeups?: boolean;
    replacePayments?: boolean;
    replaceSurprise?: boolean;
    replacePresence?: boolean;
    replaceDevices?: boolean;
    replaceCertificates?: boolean;
    replaceTelegramLinks?: boolean;
  },
): Promise<void> {
  if (!store.codes.length) {
    const localCodes = (await readLocalStore())?.codes ?? [];
    if (localCodes.length) store.codes = localCodes;
  }
  if (!options?.replaceMakeups && !store.makeups.length) {
    let dedicated: MakeupTask[] | null = null;
    try {
      const { readMakeupRows } = await import("@/lib/class-db");
      dedicated = await readMakeupRows();
    } catch {
      dedicated = null;
    }
    const local = parseMakeups((await readLocalStore())?.makeups);
    store.makeups = dedicated?.length ? dedicated : local;
  }
  if (!options?.replacePayments && !store.payments.length) {
    let dedicated: MonthPayment[] | null = null;
    try {
      const { readPaymentRows } = await import("@/lib/class-db");
      dedicated = await readPaymentRows();
    } catch {
      dedicated = null;
    }
    const local = parsePayments((await readLocalStore())?.payments);
    store.payments = dedicated?.length ? dedicated : local;
  }
  if (store.monthlyFee == null) {
    store.monthlyFee = parseMonthlyFee((await readLocalStore())?.monthlyFee);
  }
  if (!options?.replaceSurprise) {
    const local = await readLocalStore();
    if (!store.surprise) store.surprise = parseSurprise(local?.surprise);
    if (!store.surpriseAnswers.length) store.surpriseAnswers = parseSurpriseAnswers(local?.surpriseAnswers);
  }
  if (!options?.replacePresence && !store.presence.length) {
    store.presence = parsePresence((await readLocalStore())?.presence);
  }
  if (!options?.replaceDevices && !store.devices.length) {
    let dedicated: StudentDevice[] | null = null;
    try {
      const { readDeviceRows } = await import("@/lib/class-db");
      dedicated = await readDeviceRows();
    } catch {
      dedicated = null;
    }
    const local = parseDevices((await readLocalStore())?.devices);
    store.devices = dedicated?.length ? dedicated : local;
  }
  if (store.deviceLimit == null) {
    store.deviceLimit = parseDeviceLimit((await readLocalStore())?.deviceLimit);
  }
  if (!options?.replaceCertificates && !store.certificates.length) {
    let dedicated: CourseCertificate[] | null = null;
    try {
      const { readCertificateRows } = await import("@/lib/class-db");
      dedicated = await readCertificateRows();
    } catch {
      dedicated = null;
    }
    const local = parseCertificates((await readLocalStore())?.certificates);
    store.certificates = dedicated?.length ? dedicated : local;
  }
  if (!options?.replaceTelegramLinks && !store.telegramLinks?.length) {
    let dedicated: TelegramLink[] | null = null;
    try {
      const { readTelegramLinkRows } = await import("@/lib/class-db");
      dedicated = await readTelegramLinkRows();
    } catch {
      dedicated = null;
    }
    const local = parseTelegramLinks((await readLocalStore())?.telegramLinks);
    store.telegramLinks = dedicated?.length ? dedicated : local;
  }
  let wroteDb = false;
  try {
    const { writeClassDb } = await import("@/lib/class-db");
    wroteDb = await writeClassDb(store);
  } catch {
    wroteDb = false;
  }
  try {
    const { upsertDeviceLimitRow } = await import("@/lib/class-db");
    await upsertDeviceLimitRow(parseDeviceLimit(store.deviceLimit));
  } catch {
    // Dedicated device-limit table may not exist yet.
  }
  await writeLocal(store);
  if (!wroteDb) {
    await writeBlob(store);
  }
}
