"use server";

import {
  grantChapterUnlock,
  idForStudent,
  issueCode,
  listExamChapterIds,
  listPassedHomework,
  listUnlocks,
  normalizePhone,
  redeemCode,
} from "@/lib/access-store";
import { isChapterId } from "@/lib/curriculum";
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
