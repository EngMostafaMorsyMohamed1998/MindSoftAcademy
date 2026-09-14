import { cookies } from "next/headers";
import { TEACHER_COOKIE } from "@/lib/session-cookies";
import { isTeacherToken, teacherToken } from "@/lib/teacher-token";

export { TEACHER_COOKIE, isTeacherToken, teacherToken };

export function teacherPin(): string {
  return process.env.TEACHER_PIN || "mostafa2026";
}

export async function isTeacher(): Promise<boolean> {
  const store = await cookies();
  return isTeacherToken(store.get(TEACHER_COOKIE)?.value);
}

export async function setTeacherCookie() {
  const store = await cookies();
  store.set(TEACHER_COOKIE, teacherToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearTeacherCookie() {
  const store = await cookies();
  store.delete(TEACHER_COOKIE);
}
