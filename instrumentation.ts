export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (!process.env.VERCEL) return;
  const { ensureTelegramReceiver } = await import("@/lib/telegram-inbox");
  await ensureTelegramReceiver();
}
