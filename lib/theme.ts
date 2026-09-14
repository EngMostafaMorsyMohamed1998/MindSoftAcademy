import { cookies } from "next/headers";

export type Theme = "light" | "dark";

export const THEME_COOKIE = "mindsoft_theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export async function getTheme(): Promise<Theme> {
  const store = await cookies();
  const raw = store.get(THEME_COOKIE)?.value;
  return isTheme(raw) ? raw : "light";
}
