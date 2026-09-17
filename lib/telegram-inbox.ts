import {
  findCodeByPhone,
  linkTelegramChat,
  listCodes,
  setTeacherTelegramChatId,
  unlinkTelegramChat,
} from "@/lib/access-store";
import { siteUrl } from "@/lib/class-roster";
import { teacherPin } from "@/lib/teacher-session";
import {
  extractPhoneText,
  sendTelegramMessage,
  setTelegramWebhook,
  telegramEmptyRosterText,
  telegramIsReady,
  telegramLinkedText,
  telegramStartText,
  telegramStoppedText,
  telegramTeacherLinkedText,
  telegramTeacherPinText,
  telegramTeacherWrongPinText,
  telegramUnknownPhoneText,
  type TelegramUpdate,
} from "@/lib/telegram";

const locale = "ar" as const;

function teacherCommand(text: string): string | null {
  const match = text.match(/^\/teacher(?:@\w+)?(?:\s+(.+))?$/i);
  return match ? (match[1] || "").trim() : null;
}

export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  const message = update.message;
  const chatId = message?.chat?.id;
  const text = message?.text?.trim() ?? "";
  if (!chatId || !text) return;

  const id = String(chatId);
  if (text === "/stop") {
    await unlinkTelegramChat(id);
    await sendTelegramMessage(id, telegramStoppedText(locale));
    return;
  }
  const teacherPayload = teacherCommand(text);
  if (teacherPayload !== null) {
    if (!teacherPayload) {
      await sendTelegramMessage(id, telegramTeacherPinText(locale));
      return;
    }
    if (teacherPayload === teacherPin()) {
      await setTeacherTelegramChatId(id);
      await sendTelegramMessage(id, telegramTeacherLinkedText(locale));
      return;
    }
    await sendTelegramMessage(id, telegramTeacherWrongPinText(locale));
    return;
  }
  const payload = text.startsWith("/start") ? text.slice(6) : text;
  const phone = extractPhoneText(payload);
  if (text === "/start" || (text.startsWith("/start") && phone.length < 10) || phone.length < 10) {
    await sendTelegramMessage(id, telegramStartText(locale));
    return;
  }
  const codes = await listCodes();
  if (!codes.length) {
    await sendTelegramMessage(id, telegramEmptyRosterText(locale));
    return;
  }
  const student = findCodeByPhone(phone, codes);
  if (!student) {
    await sendTelegramMessage(id, telegramUnknownPhoneText(locale));
    return;
  }
  await linkTelegramChat({
    chatId: id,
    studentId: student.id,
    phone: student.phone,
    parentName: message.from?.first_name || "",
  });
  await sendTelegramMessage(id, telegramLinkedText(student.name, student.phone, locale));
}

export async function ensureTelegramReceiver(): Promise<boolean> {
  if (!(await telegramIsReady())) return false;
  return setTelegramWebhook(`${siteUrl()}/api/telegram/webhook`);
}
