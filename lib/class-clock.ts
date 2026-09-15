export const REVIEW_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

export function cairoDate(value = new Date()): string {
  return value.toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });
}

export function daysUntilReview(missedAt: string, now = Date.now()): number {
  const readyAt = new Date(missedAt).getTime() + REVIEW_AFTER_MS;
  return Math.max(0, Math.ceil((readyAt - now) / (24 * 60 * 60 * 1000)));
}

export function examWindowOpen(
  window: { chapterId: string; opensAt: string; closesAt: string } | null,
  chapterId: string,
  now = Date.now(),
): boolean {
  if (!window || window.chapterId !== chapterId) return false;
  const opens = new Date(window.opensAt).getTime();
  const closes = new Date(window.closesAt).getTime();
  return now >= opens && now <= closes;
}

export function parseBulkStudents(raw: string): { name: string; phone: string }[] {
  const rows: { name: string; phone: string }[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/[,|\t;]+/).map((part) => part.trim()).filter(Boolean);
    if (parts.length < 2) continue;
    const phone = parts[parts.length - 1] ?? "";
    const name = parts.slice(0, -1).join(" ").trim();
    if (name.length < 3 || phone.replace(/\D/g, "").length < 10) continue;
    rows.push({ name, phone });
  }
  return rows;
}
