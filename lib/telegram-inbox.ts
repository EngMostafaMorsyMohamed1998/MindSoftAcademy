import { findCodeByPhone, linkTelegramChat, listCodes, unlinkTelegramChat } from "@/lib/access-store";
import { siteUrl } from "@/lib/class-roster";
import {
  deleteTelegramWebhook,
  extractPhoneText,
  fetchTelegramUpdates,
  sendTelegramMessage,
  setTelegramWebhook,
  telegramConfigured,
  telegramEmptyRosterText,
  telegramLinkedText,
  telegramShouldPoll,
  telegramStartText,
  telegramStoppedText,
  telegramUnknownPhoneText,
  type TelegramUpdate,
} from "@/lib/telegram";

const locale = "ar" as const;

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

type PollState = { running?: boolean; offset?: number };

function pollState(): PollState {
  const globalRef = globalThis as typeof globalThis & { __msaTelegramPoll?: PollState };
  globalRef.__msaTelegramPoll ??= {};
  return globalRef.__msaTelegramPoll;
}

async function pollLoop(): Promise<void> {
  const state = pollState();
  while (state.running) {
    try {
      const updates = await fetchTelegramUpdates(state.offset ?? 0);
      for (const update of updates) {
        state.offset = (update.update_id ?? 0) + 1;
        try {
          await handleTelegramUpdate(update);
        } catch {
          // Keep polling even if one parent message fails.
        }
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

export function startTelegramPolling(): void {
  const state = pollState();
  if (state.running) return;
  state.running = true;
  void pollLoop();
}

export async function ensureTelegramReceiver(publicUrl?: string): Promise<boolean> {
  if (!telegramConfigured()) return false;
  if (telegramShouldPoll()) {
    await deleteTelegramWebhook();
    startTelegramPolling();
    return true;
  }
  const base = (publicUrl || siteUrl()).replace(/\/$/, "");
  return setTelegramWebhook(`${base}/api/telegram/webhook`);
}
