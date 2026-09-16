import { NextResponse } from "next/server";
import { ensureTelegramReceiver, handleTelegramUpdate } from "@/lib/telegram-inbox";
import {
  fetchTelegramWebhookInfo,
  setTelegramWebhookDetailed,
  telegramConfigured,
  telegramShouldPoll,
  type TelegramUpdate,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (telegramShouldPoll()) {
    const ready = await ensureTelegramReceiver();
    return NextResponse.json({
      ok: true,
      configured: telegramConfigured(),
      polling: true,
      ready,
      hook: "poll",
      error: "",
    });
  }
  const origin = new URL(request.url).origin;
  const attach = await setTelegramWebhookDetailed(`${origin}/api/telegram/webhook`);
  const info = await fetchTelegramWebhookInfo();
  return NextResponse.json({
    ok: true,
    configured: telegramConfigured(),
    polling: false,
    ready: attach.ok,
    hook: info.url ? "on" : "off",
    error: attach.ok ? "" : attach.error || info.error,
  });
}

export async function POST(request: Request) {
  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }
  try {
    await handleTelegramUpdate(update);
  } catch {
    // Telegram retries failed webhooks; keep this 200 after we received the update.
  }
  return NextResponse.json({ ok: true });
}
