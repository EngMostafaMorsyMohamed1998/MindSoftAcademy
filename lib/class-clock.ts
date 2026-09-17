import { isChapterId } from "@/lib/curriculum";
import { isFaizPaper } from "@/lib/faiz";

export const REVIEW_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

export type ExamMode = "class" | "ministry";

export function cairoDate(value = new Date()): string {
  return value.toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });
}

export function cairoMonth(value = new Date()): string {
  return cairoDate(value).slice(0, 7);
}

export function cairoClock(value: string | Date): string {
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Cairo",
  });
}

export function cairoWeekday(value = new Date()): number {
  const day = value.toLocaleDateString("en-US", { timeZone: "Africa/Cairo", weekday: "short" });
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day);
}

export function encodeExamChapter(chapterId: string, mode: ExamMode = "class"): string {
  return mode === "ministry" ? `${chapterId}m` : chapterId;
}

export function parseExamChapter(raw: string): { chapterId: string; mode: ExamMode } {
  if (raw === "mix" || raw === "mixm") {
    return { chapterId: "mix", mode: "ministry" };
  }
  if (raw === "faiz" || raw === "faizm") {
    return { chapterId: "faiz", mode: raw.endsWith("m") ? "ministry" : "class" };
  }
  if (raw.endsWith("m")) {
    const chapterId = raw.slice(0, -1);
    if (isChapterId(chapterId) || isFaizPaper(chapterId)) return { chapterId, mode: "ministry" };
  }
  return { chapterId: raw, mode: "class" };
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
  return remainingExamSeconds(window, chapterId, now) > 0;
}

export function remainingExamSeconds(
  window: { chapterId: string; opensAt: string; closesAt: string } | null,
  chapterId?: string,
  now = Date.now(),
): number {
  if (!window) return 0;
  if (chapterId && window.chapterId !== chapterId) return 0;
  const opens = new Date(window.opensAt).getTime();
  const closes = new Date(window.closesAt).getTime();
  if (now < opens || now > closes) return 0;
  return Math.max(0, Math.ceil((closes - now) / 1000));
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
