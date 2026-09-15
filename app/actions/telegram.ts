"use server";

import { after } from "next/server";
import { siteUrl } from "@/lib/class-roster";
import { getLocale } from "@/lib/locale";
import { isTeacher } from "@/lib/teacher-session";
import { setTelegramWebhook, telegramConfigured } from "@/lib/telegram";
import { notifyAllWeeklyReports, notifyWeeklyReport } from "@/lib/telegram-notify";

export type TelegramState = { error: string | null; ok?: boolean; sent?: number };

export async function activateTelegramWebhook(
  _prev: TelegramState = { error: null },
): Promise<TelegramState> {
  if (!(await isTeacher())) return { error: "AUTH" };
  if (!telegramConfigured()) return { error: "TOKEN" };
  const ok = await setTelegramWebhook(`${siteUrl()}/api/telegram/webhook`);
  return ok ? { error: null, ok: true } : { error: "WEBHOOK" };
}

export async function sendTelegramStudentReport(
  _prev: TelegramState,
  formData: FormData,
): Promise<TelegramState> {
  if (!(await isTeacher())) return { error: "AUTH" };
  if (!telegramConfigured()) return { error: "TOKEN" };
  const studentId = String(formData.get("studentId") || "");
  if (!studentId) return { error: "STUDENT" };
  const locale = await getLocale();
  const sent = await notifyWeeklyReport(studentId, locale);
  return sent > 0 ? { error: null, ok: true, sent } : { error: "NOT_LINKED" };
}

export async function sendTelegramAllReports(
  _prev: TelegramState = { error: null },
): Promise<TelegramState> {
  if (!(await isTeacher())) return { error: "AUTH" };
  if (!telegramConfigured()) return { error: "TOKEN" };
  const locale = await getLocale();
  after(async () => {
    await notifyAllWeeklyReports(locale);
  });
  return { error: null, ok: true };
}
