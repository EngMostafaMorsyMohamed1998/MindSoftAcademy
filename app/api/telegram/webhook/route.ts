import { NextResponse } from "next/server";
import { ensureTelegramReceiver, handleTelegramUpdate } from "@/lib/telegram-inbox";
import { fetchTelegramWebhookInfo, telegramIsReady, type TelegramUpdate } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const ready = await ensureTelegramReceiver();
  const info = await fetchTelegramWebhookInfo();
  return NextResponse.json({
    ok: true,
    configured: await telegramIsReady(),
    ready,
    hook: info.url ? "on" : "off",
    error: ready ? "" : info.error,
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
