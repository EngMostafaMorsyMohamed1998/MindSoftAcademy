"use server";

import { cookies } from "next/headers";
import {
  getRequestArea,
  LANG_COOKIE,
  LANG_TRACK_COOKIE,
  TEACHER_LANG_COOKIE,
  isLocale,
  parseTrack,
  type Locale,
} from "@/lib/locale";

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;
  const area = await getRequestArea();
  const store = await cookies();
  const cookie = {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax" as const,
  };
  if (area === "teacher") {
    store.set(TEACHER_LANG_COOKIE, locale, cookie);
    return;
  }
  store.set(LANG_COOKIE, locale, cookie);
  try {
    const { getStudentSession } = await import("@/lib/student-session");
    const student = await getStudentSession();
    if (student) store.set(LANG_TRACK_COOKIE, parseTrack(student.track), cookie);
  } catch {
    // public pages have no student session
  }
}
