import { NextResponse } from "next/server";
import { ensureTelegramReceiver, handleTelegramUpdate } from "@/lib/telegram-inbox";
import { telegramConfigured, telegramShouldPoll, type TelegramUpdate } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const polling = telegramShouldPoll() ? await ensureTelegramReceiver() : false;
  return NextResponse.json({
    ok: true,
    configured: telegramConfigured(),
    polling,
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
