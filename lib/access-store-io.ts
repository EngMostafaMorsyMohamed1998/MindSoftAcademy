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
    examWindow: parsed.examWindow ?? null,
    misses: Array.isArray(parsed.misses) ? parsed.misses : [],
  };
}

async function readLocal(): Promise<StoreFile | null> {
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
    if (fromDb) return fromDb;
  } catch {
    // Prisma client or database may not be ready yet.
  }
  const fromBlob = await readBlob();
  if (fromBlob) return fromBlob;
  return (await readLocal()) ?? emptyStore();
}

export async function writeStore(store: StoreFile): Promise<void> {
  let wroteDb = false;
  try {
    const { writeClassDb } = await import("@/lib/class-db");
    wroteDb = await writeClassDb(store);
  } catch {
    wroteDb = false;
  }
  await writeLocal(store);
  if (!wroteDb) {
    await writeBlob(store);
  }
}
