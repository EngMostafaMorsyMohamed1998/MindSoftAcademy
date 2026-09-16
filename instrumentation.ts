export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { telegramConfigured, telegramShouldPoll } = await import("@/lib/telegram");
  if (!telegramConfigured() || !telegramShouldPoll()) return;
  const { ensureTelegramReceiver } = await import("@/lib/telegram-inbox");
  await ensureTelegramReceiver();
}
