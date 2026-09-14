import { randomBytes } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type AccessCode = {
  id: string;
  code: string;
  name: string;
  phone: string;
  createdAt: string;
  usedAt: string | null;
  usedById: string | null;
  points: number;
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

type StoreFile = {
  codes: AccessCode[];
  exams: ExamSubmission[];
};

const STORE_PATH = path.join(process.cwd(), "data", "access-store.json");

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function emptyStore(): StoreFile {
  return { codes: [], exams: [] };
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    return {
      codes: Array.isArray(parsed.codes) ? parsed.codes : [],
      exams: Array.isArray(parsed.exams) ? parsed.exams : [],
    };
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: StoreFile) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

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

export function phonesMatch(a: string, b: string): boolean {
  const left = normalizePhone(a);
  const right = normalizePhone(b);
  if (!left || !right) return false;
  return left === right || left.endsWith(right) || right.endsWith(left);
}

function makeCode(): string {
  const bytes = randomBytes(6);
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return `MOST-${out}`;
}

export async function listCodes(): Promise<AccessCode[]> {
  const store = await readStore();
  return [...store.codes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function issueCode(input: {
  name: string;
  phone: string;
}): Promise<AccessCode> {
  const name = input.name.trim();
  const phone = normalizePhone(input.phone);
  if (name.length < 3) {
    throw new Error("NAME");
  }
  if (phone.length < 10) {
    throw new Error("PHONE");
  }

  const store = await readStore();
  let code = makeCode();
  while (store.codes.some((item) => item.code === code)) {
    code = makeCode();
  }

  const record: AccessCode = {
    id: randomBytes(8).toString("hex"),
    code,
    name,
    phone,
    createdAt: new Date().toISOString(),
    usedAt: null,
    usedById: null,
    points: 0,
  };
  store.codes.unshift(record);
  await writeStore(store);
  return record;
}

export async function redeemCode(input: {
  name: string;
  phone: string;
  code: string;
}): Promise<AccessCode> {
  const code = input.code.trim().toUpperCase().replace(/\s+/g, "");
  const store = await readStore();
  const record = store.codes.find((item) => item.code === code);
  if (!record) {
    throw new Error("NOT_FOUND");
  }
  if (!phonesMatch(record.phone, input.phone)) {
    throw new Error("PHONE_MISMATCH");
  }
  if (normalizeName(record.name) !== normalizeName(input.name)) {
    throw new Error("NAME_MISMATCH");
  }
  if (record.usedAt) {
    return record;
  }
  record.usedAt = new Date().toISOString();
  record.usedById = record.id;
  await writeStore(store);
  return record;
}

export async function getCodeById(id: string): Promise<AccessCode | null> {
  const store = await readStore();
  return store.codes.find((item) => item.id === id) ?? null;
}

export async function addPoints(id: string, delta: number): Promise<number> {
  const store = await readStore();
  const record = store.codes.find((item) => item.id === id);
  if (!record) return 0;
  record.points = Math.max(0, record.points + delta);
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
