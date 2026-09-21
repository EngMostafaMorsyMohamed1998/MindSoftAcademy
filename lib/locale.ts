import { cookies, headers } from "next/headers";

export type Locale = "ar" | "en";

export const LANG_COOKIE = "morsy_lang";
export const TEACHER_LANG_COOKIE = "morsy_teacher_lang";
export const AREA_HEADER = "x-mindsoft-area";

export function isLocale(value: unknown): value is Locale {
  return value === "ar" || value === "en";
}

export function parseTrack(value: unknown): Locale {
  return value === "en" ? "en" : "ar";
}

export async function getRequestArea(): Promise<"teacher" | "student" | "public"> {
  try {
    const area = (await headers()).get(AREA_HEADER);
    if (area === "teacher" || area === "student") return area;
  } catch {
    // headers() is unavailable outside a request
  }
  return "public";
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const area = await getRequestArea();
  if (area === "teacher") {
    const picked = store.get(TEACHER_LANG_COOKIE)?.value;
    return isLocale(picked) ? picked : "ar";
  }
  try {
    const { getStudentSession } = await import("@/lib/student-session");
    const student = await getStudentSession();
    if (student) return parseTrack(student.track);
  } catch {
    // cookies() is unavailable outside a request
  }
  const picked = store.get(LANG_COOKIE)?.value;
  return isLocale(picked) ? picked : "ar";
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
