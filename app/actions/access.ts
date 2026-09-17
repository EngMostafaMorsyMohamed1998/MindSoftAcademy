"use server";

import {
  grantChapterUnlock,
  idForStudent,
  issueCode,
  setStudentTrack,
  listExamChapterIds,
  listPassedHomework,
  listUnlocks,
  markAttendance,
  normalizePhone,
  redeemCode,
  setAnnouncement,
  setMonthPaid,
  setMonthlyFee,
  setSuspended,
  startSurprise,
  closeSurprise,
  addWeekSlot,
  archiveClassSession,
  closeExamWindow,
  removeClassGroup,
  removeWeekSlot,
  upsertClassGroup,
  setDeviceLimit,
  startExamWindow,
  forgetStudentDevice,
  addLessonExample,
  removeLessonExample,
} from "@/lib/access-store";
import { parseBulkStudents } from "@/lib/class-clock";
import { getLesson, isChapterId } from "@/lib/curriculum";
import { FAIZ_PAPER_ID } from "@/lib/faiz";
import { bindStudentDevice, getStudentSession, setStudentCookie } from "@/lib/student-session";
import { setLocale } from "@/app/actions/locale";
import { parseTrack } from "@/lib/locale";
import { parseDeviceLimit } from "@/lib/devices";
import { listVisibleCodes, rememberIssuedCode } from "@/lib/teacher-roster";
import { isTeacher, setTeacherCookie, teacherPin } from "@/lib/teacher-session";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { notifySessionParents } from "@/lib/telegram-notify";

export type FormState = {
  error: string | null;
  code?: string;
  ok?: boolean;
  examChapterId?: string;
  examClosesAt?: string;
  examClosed?: boolean;
  examMode?: "class" | "ministry";
  sessionSaved?: boolean;
  surpriseId?: string;
  surpriseClosesAt?: string;
};

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
    await bindStudentDevice(record.id);
    await setLocale(parseTrack(record.track));
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

export async function claimThisDevice(): Promise<void> {
  const student = await getStudentSession();
  if (!student) redirect("/activate");
  await bindStudentDevice(student.id, true);
  redirect("/dashboard");
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
  const track = parseTrack(read(formData, "track"));
  try {
    const record = await issueCode({ name, phone, track });
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
  const track = parseTrack(read(formData, "track"));
  if (rows.length === 0) return { error: "MISSING" };
  try {
    for (const row of rows) {
      const record = await issueCode({ ...row, track });
      await rememberIssuedCode(record);
    }
    return { error: null, ok: true, code: String(rows.length) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "FAILED";
    return { error: message };
  }
}

export async function saveStudentTrack(formData: FormData): Promise<void> {
  if (!(await isTeacher())) return;
  const studentId = read(formData, "studentId");
  if (!studentId) return;
  await setStudentTrack(studentId, parseTrack(read(formData, "track")));
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

export async function markStudentFee(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const studentId = read(formData, "studentId");
  if (!studentId) return { error: "MISSING" };
  await setMonthPaid({ studentId, paid: read(formData, "paid") === "1" });
  return { error: null, ok: true };
}

export async function saveMonthlyFee(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const amount = Number(read(formData, "monthlyFee"));
  if (!Number.isFinite(amount) || amount < 0) return { error: "MISSING" };
  await setMonthlyFee(amount);
  return { error: null, ok: true };
}

export async function openSurprise(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const chapterId = read(formData, "chapterId");
  if (!isChapterId(chapterId)) return { error: "MISSING" };
  try {
    const question = await startSurprise(chapterId);
    return { error: null, ok: true, surpriseId: question.id, surpriseClosesAt: question.closesAt };
  } catch (error) {
    return { error: error instanceof Error && error.message === "SAVE" ? "SAVE" : "MISSING" };
  }
}

export async function stopSurprise(
  _prev: FormState,
  _formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  await closeSurprise();
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
  const minutes = Number(read(formData, "minutes") || "60");
  const duration = Number.isFinite(minutes) ? Math.round(minutes * 60) : 60 * 60;
  const mode = read(formData, "ministry") === "1" ? "ministry" : "class";
  const window = await startExamWindow(chapterId, duration, mode);
  return {
    error: null,
    ok: true,
    examChapterId: window.chapterId,
    examClosesAt: window.closesAt,
    examMode: window.mode,
  };
}

export async function openMixedMock(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const minutes = Number(read(formData, "minutes") || "90");
  const duration = Number.isFinite(minutes) ? Math.round(minutes * 60) : 90 * 60;
  const window = await startExamWindow("mix", duration, "ministry");
  return {
    error: null,
    ok: true,
    examChapterId: window.chapterId,
    examClosesAt: window.closesAt,
    examMode: window.mode,
  };
}

export async function openFaizExam(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const minutes = Number(read(formData, "minutes") || "60");
  const duration = Number.isFinite(minutes) ? Math.round(minutes * 60) : 60 * 60;
  const window = await startExamWindow(FAIZ_PAPER_ID, duration, "class");
  return {
    error: null,
    ok: true,
    examChapterId: window.chapterId,
    examClosesAt: window.closesAt,
    examMode: window.mode,
  };
}

export async function saveWeekSlot(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const weekday = Number(read(formData, "weekday"));
  const startTime = read(formData, "startTime");
  const topic = read(formData, "topic");
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6 || !startTime || topic.length < 2) {
    return { error: "MISSING" };
  }
  await addWeekSlot({ weekday, startTime, topic });
  return { error: null, ok: true };
}

export async function deleteWeekSlot(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const id = read(formData, "slotId");
  if (!id) return { error: "MISSING" };
  await removeWeekSlot(id);
  return { error: null, ok: true };
}

export async function stopClassExam(
  _prev: FormState,
  _formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const session = await archiveClassSession(await listVisibleCodes());
  await closeExamWindow();
  after(async () => {
    await notifySessionParents(session);
  });
  return { error: null, ok: true, examClosed: true, sessionSaved: true };
}

export async function saveClassGroup(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const name = read(formData, "name");
  const weekday = Number(read(formData, "weekday"));
  const startTime = read(formData, "startTime");
  if (!name || !startTime || !Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    return { error: "MISSING" };
  }
  const studentIds = formData
    .getAll("studentId")
    .flatMap((value) => (typeof value === "string" ? [value.trim()] : []));
  await upsertClassGroup({
    id: read(formData, "groupId") || undefined,
    name,
    weekday,
    startTime,
    place: read(formData, "place"),
    nextLesson: read(formData, "nextLesson"),
    studentIds,
  });
  return { error: null, ok: true };
}

export async function deleteClassGroup(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const id = read(formData, "groupId");
  if (!id) return { error: "MISSING" };
  await removeClassGroup(id);
  return { error: null, ok: true };
}

export async function saveDeviceLimit(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  await setDeviceLimit(parseDeviceLimit(read(formData, "limit")));
  return { error: null, ok: true };
}

export async function saveLessonExample(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const lessonId = read(formData, "lessonId");
  const bodyAr = read(formData, "bodyAr");
  const bodyEn = read(formData, "bodyEn");
  if (!getLesson(lessonId) || !bodyAr) return { error: "MISSING" };
  const saved = await addLessonExample({ lessonId, bodyAr, bodyEn });
  return saved ? { error: null, ok: true } : { error: "SAVE" };
}

export async function deleteLessonExample(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const id = read(formData, "exampleId");
  if (!id) return { error: "MISSING" };
  await removeLessonExample(id);
  return { error: null, ok: true };
}

export async function removeStudentDevice(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isTeacher())) return { error: "FORBIDDEN" };
  const id = read(formData, "deviceId");
  if (!id) return { error: "MISSING" };
  await forgetStudentDevice(id);
  return { error: null, ok: true };
}
