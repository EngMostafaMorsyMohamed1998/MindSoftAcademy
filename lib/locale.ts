import { cookies } from "next/headers";

export type Locale = "ar" | "en";

export const LANG_COOKIE = "morsy_lang";

export function isLocale(value: unknown): value is Locale {
  return value === "ar" || value === "en";
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const raw = store.get(LANG_COOKIE)?.value;
  return isLocale(raw) ? raw : "ar";
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
