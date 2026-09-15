import { createHmac } from "crypto";
import { allChaptersPassed } from "@/lib/chapter-progress";
import { CHAPTERS } from "@/lib/curriculum";

type ExamScore = {
  studentId: string;
  chapterId: string;
  objectiveScore: number;
  objectiveTotal: number;
};

export type CourseCertificate = {
  serial: string;
  studentId: string;
  name: string;
  issuedAt: string;
  average: number;
  verifyCode: string;
  year: string;
};

function secret() {
  return process.env.AUTH_SECRET || process.env.TEACHER_PIN || "morsy-lab-local-dev-secret";
}

export function stampCertificate(serial: string, studentId: string): string {
  return createHmac("sha256", secret())
    .update(`${serial}:${studentId}`)
    .digest("hex")
    .slice(0, 8)
    .toUpperCase();
}

export function parseCertificates(value: unknown): CourseCertificate[] {
  if (!Array.isArray(value)) return [];
  const rows: CourseCertificate[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as CourseCertificate;
    if (!row.serial || !row.studentId || seen.has(row.serial)) continue;
    seen.add(row.serial);
    rows.push({
      serial: row.serial,
      studentId: row.studentId,
      name: row.name || "",
      issuedAt: row.issuedAt || new Date().toISOString(),
      average: Number.isFinite(row.average) ? Math.max(0, Math.min(100, Math.round(row.average))) : 0,
      verifyCode: row.verifyCode || stampCertificate(row.serial, row.studentId),
      year: row.year || row.serial.split("-")[1] || "",
    });
  }
  return rows;
}

export function nextCertificateSerial(existing: CourseCertificate[], year: string): string {
  const prefix = `MSA-${year}-`;
  let max = 0;
  for (const row of existing) {
    if (!row.serial.startsWith(prefix)) continue;
    const seq = Number(row.serial.slice(prefix.length));
    if (Number.isFinite(seq) && seq > max) max = seq;
  }
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

export function courseAverage(exams: ExamScore[], studentId: string): number {
  const percents = CHAPTERS.map((chapter) => {
    const best = exams
      .filter((item) => item.studentId === studentId && item.chapterId === chapter.id && item.objectiveTotal > 0)
      .reduce((top, item) => Math.max(top, item.objectiveScore / item.objectiveTotal), 0);
    return Math.round(best * 100);
  });
  const mix = exams
    .filter((item) => item.studentId === studentId && item.chapterId === "mix" && item.objectiveTotal > 0)
    .reduce((top, item) => Math.max(top, item.objectiveScore / item.objectiveTotal), 0);
  const scores = mix > 0 ? [...percents, Math.round(mix * 100)] : percents;
  if (!scores.length) return 0;
  return Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
}

export function canIssueCertificate(completed: Iterable<string>): boolean {
  return allChaptersPassed(completed);
}
