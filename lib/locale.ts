import { cookies } from "next/headers";

export type Locale = "ar" | "en";

export const LANG_COOKIE = "morsy_lang";

export function isLocale(value: unknown): value is Locale {
  return value === "ar" || value === "en";
}

export function parseTrack(value: unknown): Locale {
  return value === "en" ? "en" : "ar";
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const picked = store.get(LANG_COOKIE)?.value;
  if (isLocale(picked)) return picked;
  try {
    const { getStudentSession } = await import("@/lib/student-session");
    const student = await getStudentSession();
    if (student) return parseTrack(student.track);
  } catch {
    // cookies() is unavailable outside a request
  }
  return "ar";
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
