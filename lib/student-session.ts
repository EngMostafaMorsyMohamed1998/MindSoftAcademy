import { cookies, headers } from "next/headers";
import { claimStudentDevice, getCodeById, getDeviceLimit, listDevices } from "@/lib/access-store";
import { canRegisterDevice, deviceLabel, isDeviceId, newDeviceId } from "@/lib/devices";
import { DEVICE_COOKIE, DEVICE_COOKIE_MAX_AGE, STUDENT_COOKIE } from "@/lib/session-cookies";
import {
  encodeStudentSession,
  readStudentToken,
  type StudentSession,
} from "@/lib/student-token";

export { STUDENT_COOKIE, encodeStudentSession, readStudentToken };
export type { StudentSession };

export async function getStudentSession(): Promise<(StudentSession & { points: number; exams: string[]; homework: string[]; unlocks: string[]; track: "ar" | "en" }) | null> {
  const store = await cookies();
  const session = readStudentToken(store.get(STUDENT_COOKIE)?.value);
  if (!session) return null;
  const exams = session.exams ?? [];
  const homework = session.homework ?? [];
  const unlocks = session.unlocks ?? [];
  const record = await getCodeById(session.id);
  if (record) {
    return {
      ...session,
      name: record.name,
      phone: record.phone,
      points: record.points,
      exams,
      homework,
      unlocks,
      track: record.track === "en" ? "en" : "ar",
    };
  }
  return { ...session, points: 0, exams, homework, unlocks, track: "ar" };
}

export async function setStudentCookie(record: {
  id: string;
  name: string;
  phone: string;
  exams?: string[];
  homework?: string[];
  unlocks?: string[];
}) {
  const store = await cookies();
  store.set(STUDENT_COOKIE, encodeStudentSession({
    id: record.id,
    name: record.name,
    phone: record.phone,
    exams: record.exams ?? [],
    homework: record.homework ?? [],
    unlocks: record.unlocks ?? [],
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
}

export async function clearStudentCookie() {
  const store = await cookies();
  store.delete(STUDENT_COOKIE);
}

async function deviceFromRequest(): Promise<string | null> {
  const store = await cookies();
  const existing = store.get(DEVICE_COOKIE)?.value;
  return isDeviceId(existing) ? existing : null;
}

export async function ensureBoundDevice(studentId: string): Promise<void> {
  const deviceId = await deviceFromRequest();
  const [rows, limit] = await Promise.all([listDevices(studentId), getDeviceLimit()]);
  if (!deviceId) {
    if (rows.length >= limit) throw new Error("DEVICE_LIMIT");
    return;
  }
  if (rows.some((row) => row.deviceId === deviceId)) return;
  if (!canRegisterDevice(rows, studentId, deviceId, limit)) {
    throw new Error("DEVICE_LIMIT");
  }
  const requestHeaders = await headers();
  await claimStudentDevice({
    studentId,
    deviceId,
    label: deviceLabel(requestHeaders.get("user-agent") || ""),
  });
}

export async function bindStudentDevice(studentId: string, replace = true): Promise<void> {
  const store = await cookies();
  const requestHeaders = await headers();
  const deviceId = (await deviceFromRequest()) ?? newDeviceId();
  await claimStudentDevice({
    studentId,
    deviceId,
    label: deviceLabel(requestHeaders.get("user-agent") || ""),
    replace,
  });
  store.set(DEVICE_COOKIE, deviceId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEVICE_COOKIE_MAX_AGE,
  });
}
