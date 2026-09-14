import { randomBytes } from "crypto";
import { readStore, writeStore } from "@/lib/access-store-io";

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
  if (changed) await writeStore(store);
}
