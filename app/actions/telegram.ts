"use server";

import { after } from "next/server";
import { getStoredTelegramToken, setStoredTelegramToken } from "@/lib/access-store";
import { getLocale } from "@/lib/locale";
import { isTeacher } from "@/lib/teacher-session";
import { cacheTelegramBotToken, telegramIsReady } from "@/lib/telegram";
import { ensureTelegramReceiver } from "@/lib/telegram-inbox";
import { notifyAllWeeklyReports, notifyWeeklyReport } from "@/lib/telegram-notify";

export type TelegramState = { error: string | null; ok?: boolean; sent?: number };

function looksLikeBotToken(value: string): boolean {
  return /^\d{6,}:[A-Za-z0-9_-]{20,}$/.test(value.trim());
}

export async function activateTelegramWebhook(
  _prev: TelegramState = { error: null },
  formData?: FormData,
): Promise<TelegramState> {
  if (!(await isTeacher())) return { error: "AUTH" };
  const pasted = String(formData?.get("token") || "").trim();
  const token = pasted || (await getStoredTelegramToken());
  if (!looksLikeBotToken(token)) return { error: "TOKEN" };
  if (pasted) await setStoredTelegramToken(pasted);
  cacheTelegramBotToken(token);
  const ok = await ensureTelegramReceiver();
  return ok ? { error: null, ok: true } : { error: "WEBHOOK" };
}

export async function sendTelegramStudentReport(
  _prev: TelegramState,
  formData: FormData,
): Promise<TelegramState> {
  if (!(await isTeacher())) return { error: "AUTH" };
  cacheTelegramBotToken(await getStoredTelegramToken());
  if (!(await telegramIsReady())) return { error: "TOKEN" };
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
  cacheTelegramBotToken(await getStoredTelegramToken());
  if (!(await telegramIsReady())) return { error: "TOKEN" };
  const locale = await getLocale();
  after(async () => {
    await notifyAllWeeklyReports(locale);
  });
  return { error: null, ok: true };
}
