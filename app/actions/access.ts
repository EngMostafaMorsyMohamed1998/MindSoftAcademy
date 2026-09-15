"use server";

import {
  grantChapterUnlock,
  idForStudent,
  issueCode,
  listExamChapterIds,
  listPassedHomework,
  listUnlocks,
  markAttendance,
  normalizePhone,
  redeemCode,
  setAnnouncement,
  setSuspended,
  startExamWindow,
} from "@/lib/access-store";
import { parseBulkStudents } from "@/lib/class-clock";
import { EXAM_DURATION_SECONDS, isChapterId } from "@/lib/curriculum";
import { setStudentCookie } from "@/lib/student-session";
import { rememberIssuedCode } from "@/lib/teacher-roster";
import { isTeacher, setTeacherCookie, teacherPin } from "@/lib/teacher-session";

export type FormState = { error: string | null; code?: string; ok?: boolean };

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function activateAccess(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = read(formData, "name");
  const phone = read(formData, "phone");
  const code = read(formData, "code");
  if (!name || !phone || !code) {
    return { error: "MISSING" };
  }
  try {
    const record = await redeemCode({ name, phone, code });
    await setStudentCookie({
      ...record,
      exams: await listExamChapterIds(record.id),
      homework: await listPassedHomework(record.id),
      unlocks: await listUnlocks(record.id),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "FAILED";
    return { error: message };
  }
  return { error: null, ok: true };
}

export async function teacherSignIn(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const pin = read(formData, "pin");
  if (pin !== teacherPin()) {
    return { error: "PIN" };
  }
  await setTeacherCookie();
  return { error: null, ok: true };
}

export async function createStudentCode(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) {
    return { error: "FORBIDDEN" };
  }
  const name = read(formData, "name");
  const phone = read(formData, "phone");
  try {
    const record = await issueCode({ name, phone });
    await rememberIssuedCode(record);
    return { error: null, code: record.code };
  } catch (error) {
    const message = error instanceof Error ? error.message : "FAILED";
    return { error: message };
  }
}

export async function unlockStudentChapter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) {
    return { error: "FORBIDDEN" };
  }
  const name = read(formData, "name");
  const phone = normalizePhone(read(formData, "phone"));
  const chapterId = read(formData, "chapterId");
  const reason = read(formData, "reason") || "مرض / غياب";
  if (!name || phone.length < 10 || !isChapterId(chapterId)) {
    return { error: "MISSING" };
  }
  await grantChapterUnlock({
    studentId: idForStudent(name, phone),
    chapterId,
    reason,
  });
  return { error: null, ok: true };
}

export async function createManyStudentCodes(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const rows = parseBulkStudents(read(formData, "bulk"));
  if (rows.length === 0) return { error: "MISSING" };
  try {
    for (const row of rows) {
      const record = await issueCode(row);
      await rememberIssuedCode(record);
    }
    return { error: null, ok: true, code: String(rows.length) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "FAILED";
    return { error: message };
  }
}

export async function markStudentAttendance(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const studentId = read(formData, "studentId");
  const date = read(formData, "date");
  const present = read(formData, "present") === "1";
  if (!studentId || !date) return { error: "MISSING" };
  await markAttendance({ studentId, date, present });
  return { error: null, ok: true };
}

export async function toggleStudentSuspend(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const studentId = read(formData, "studentId");
  const suspended = read(formData, "suspended") === "1";
  if (!studentId) return { error: "MISSING" };
  await setSuspended({
    studentId,
    suspended,
    reason: read(formData, "reason") || "اشتراك",
  });
  return { error: null, ok: true };
}

export async function saveAnnouncement(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  await setAnnouncement(read(formData, "body"));
  return { error: null, ok: true };
}

export async function openClassExam(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const chapterId = read(formData, "chapterId");
  if (!isChapterId(chapterId)) return { error: "MISSING" };
  await startExamWindow(chapterId, EXAM_DURATION_SECONDS);
  return { error: null, ok: true };
}
