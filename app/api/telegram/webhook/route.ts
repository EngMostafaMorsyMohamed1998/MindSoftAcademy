import { NextResponse } from "next/server";
import { findCodeByPhone, linkTelegramChat, listCodes, unlinkTelegramChat } from "@/lib/access-store";
import {
  extractPhoneText,
  sendTelegramMessage,
  telegramConfigured,
  telegramLinkedText,
  telegramStartText,
  telegramStoppedText,
  telegramUnknownPhoneText,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelegramUpdate = {
  message?: {
    chat?: { id?: number };
    from?: { first_name?: string; language_code?: string };
    text?: string;
  };
};

function localeOf(code?: string): "ar" | "en" {
  return code?.toLowerCase().startsWith("en") ? "en" : "ar";
}

export async function GET() {
  return NextResponse.json({ ok: true, configured: telegramConfigured() });
}

export async function POST(request: Request) {
  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }
  const message = update.message;
  const chatId = message?.chat?.id;
  const text = message?.text?.trim() ?? "";
  if (!chatId || !text) return NextResponse.json({ ok: true });

  const locale = localeOf(message.from?.language_code);
  const id = String(chatId);

  try {
    if (text === "/stop") {
      await unlinkTelegramChat(id);
      await sendTelegramMessage(id, telegramStoppedText(locale));
      return NextResponse.json({ ok: true });
    }
    const payload = text.startsWith("/start") ? text.slice(6) : text;
    const phone = extractPhoneText(payload);
    if (text === "/start" || (text.startsWith("/start") && phone.length < 10)) {
      await sendTelegramMessage(id, telegramStartText(locale));
      return NextResponse.json({ ok: true });
    }
    if (phone.length < 10) {
      await sendTelegramMessage(id, telegramStartText(locale));
      return NextResponse.json({ ok: true });
    }
    const student = findCodeByPhone(phone, await listCodes());
    if (!student) {
      await sendTelegramMessage(id, telegramUnknownPhoneText(locale));
      return NextResponse.json({ ok: true });
    }
    await linkTelegramChat({
      chatId: id,
      studentId: student.id,
      phone: student.phone,
      parentName: message.from?.first_name || "",
    });
    await sendTelegramMessage(id, telegramLinkedText(student.name, student.phone, locale));
  } catch {
    // Telegram retries failed webhooks; keep this 200 after we received the update.
  }
  return NextResponse.json({ ok: true });
}
