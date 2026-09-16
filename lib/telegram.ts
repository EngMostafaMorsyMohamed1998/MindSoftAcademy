export type TelegramLink = {
  chatId: string;
  studentId: string;
  phone: string;
  parentName: string;
  linkedAt: string;
};

function readEnv(name: string): string {
  return String((process.env as Record<string, string | undefined>)[name] ?? "").trim();
}

export function telegramBotToken(): string {
  return readEnv("TELEGRAM_BOT_TOKEN");
}

export function telegramConfigured(): boolean {
  return Boolean(telegramBotToken());
}

export function telegramWebhookSecret(): string {
  return (
    readEnv("TELEGRAM_WEBHOOK_SECRET") ||
    readEnv("AUTH_SECRET") ||
    readEnv("TEACHER_PIN") ||
    "mindsoft-telegram-local"
  );
}

export function telegramBotUsername(): string {
  return (readEnv("TELEGRAM_BOT_USERNAME") || readEnv("NEXT_PUBLIC_TELEGRAM_BOT") || "mindsoft_academy_bot")
    .replace(/^@/, "");
}

export function telegramBotHref(): string | null {
  const name = telegramBotUsername();
  return name ? `https://t.me/${name}` : null;
}

export function parseTelegramLinks(value: unknown): TelegramLink[] {
  if (!Array.isArray(value)) return [];
  const rows: TelegramLink[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as TelegramLink;
    const chatId = String(row.chatId || "").trim();
    if (!chatId || seen.has(chatId)) continue;
    seen.add(chatId);
    rows.push({
      chatId,
      studentId: String(row.studentId || ""),
      phone: String(row.phone || ""),
      parentName: String(row.parentName || ""),
      linkedAt: row.linkedAt || new Date().toISOString(),
    });
  }
  return rows;
}

export function extractPhoneText(text: string): string {
  return text.replace(/[^\d]/g, "");
}

type TelegramApiResult = { ok: boolean };

async function telegramApi(method: string, body: Record<string, unknown>): Promise<TelegramApiResult> {
  const token = telegramBotToken();
  if (!token) return { ok: false };
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as { ok?: boolean };
    return { ok: Boolean(data.ok) };
  } catch {
    return { ok: false };
  }
}

export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  const { ok } = await telegramApi("sendMessage", { chat_id: chatId, text });
  return ok;
}

export async function sendTelegramDocument(
  chatId: string,
  filename: string,
  bytes: Uint8Array,
  caption: string,
): Promise<boolean> {
  const token = telegramBotToken();
  if (!token) return false;
  try {
    const form = new FormData();
    form.set("chat_id", chatId);
    form.set("caption", caption.slice(0, 1024));
    form.set("document", new Blob([Buffer.from(bytes)], { type: "application/pdf" }), filename);
    const response = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: "POST",
      body: form,
    });
    const data = (await response.json()) as { ok?: boolean };
    return Boolean(data.ok);
  } catch {
    return false;
  }
}

export async function setTelegramWebhook(url: string): Promise<boolean> {
  const { ok } = await telegramApi("setWebhook", {
    url,
    secret_token: telegramWebhookSecret(),
    allowed_updates: ["message"],
    drop_pending_updates: false,
  });
  return ok;
}

export async function fetchTelegramBotUsername(): Promise<string | null> {
  const token = telegramBotToken();
  if (!token) return null;
  const named = telegramBotUsername();
  if (named) return named;
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = (await response.json()) as { ok?: boolean; result?: { username?: string } };
    return data.result?.username || null;
  } catch {
    return null;
  }
}

export function telegramStartText(locale: "ar" | "en"): string {
  if (locale === "en") {
    return "Send the student phone number only (example: 01012345678).\nReports and the PDF arrive here after each exam.";
  }
  return "ابعت رقم تليفون الطالب بس (مثال: 01012345678).\nالتقرير والـ PDF هيوصلك هنا بعد كل امتحان.";
}

export function telegramLinkedText(name: string, phone: string, locale: "ar" | "en"): string {
  if (locale === "en") {
    return `Linked to ${name}\nPhone: ${phone}\nExam results and weekly PDF reports will arrive here.\nStop: /stop`;
  }
  return `اتربطت بالطالب: ${name}\nالرقم: ${phone}\nهتوصلك نتيجة كل امتحان وتقرير PDF هنا.\nوقف الإرسال: /stop`;
}

export function telegramUnknownPhoneText(locale: "ar" | "en"): string {
  if (locale === "en") {
    return "This number is not on the class register. Check it with the teacher.";
  }
  return "الرقم مش في كشف الفصل. راجع الاسم والرقم مع المدرس.";
}

export function telegramStoppedText(locale: "ar" | "en"): string {
  if (locale === "en") {
    return "Notifications stopped. Send the student phone number again anytime to reconnect.";
  }
  return "اتوقف الإرسال. تقدر تبعت رقم الطالب تاني في أي وقت.";
}
