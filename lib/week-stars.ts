import { addCairoDays } from "@/lib/makeup";
import { cairoDate, cairoWeekday } from "@/lib/class-clock";

export type WeekStars = {
  stars: number;
  score: number;
  present: number;
  absent: number;
  homework: number;
  examPercent: number | null;
};

function cairoWeekStart(value = new Date()): string {
  const today = cairoDate(value);
  const fromSaturday = (cairoWeekday(value) + 1) % 7;
  return addCairoDays(today, -fromSaturday);
}

export function inCairoWeek(isoOrDate: string, start: string, end: string): boolean {
  const day = isoOrDate.length > 10 ? cairoDate(new Date(isoOrDate)) : isoOrDate;
  return day >= start && day <= end;
}

export function buildWeekStars(input: {
  attendance: { date: string; present: boolean }[];
  homework: { passed: boolean; submittedAt: string }[];
  exams: { objectiveScore: number; objectiveTotal: number; submittedAt: string }[];
  now?: Date;
}): WeekStars {
  const start = cairoWeekStart(input.now);
  const end = addCairoDays(start, 6);
  const weekAttend = input.attendance.filter((row) => inCairoWeek(row.date, start, end));
  const present = weekAttend.filter((row) => row.present).length;
  const absent = weekAttend.filter((row) => !row.present).length;
  const homework = input.homework.filter((row) => row.passed && inCairoWeek(row.submittedAt, start, end)).length;
  const weekExams = input.exams
    .filter((row) => inCairoWeek(row.submittedAt, start, end))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  const latest = weekExams[0];
  const examPercent = latest
    ? Math.round((latest.objectiveScore / Math.max(latest.objectiveTotal, 1)) * 100)
    : null;

  const attendScore = weekAttend.length ? (present / weekAttend.length) * 40 : 0;
  const homeworkScore = Math.min(homework, 3) * 10;
  const examScore = examPercent === null ? 0 : (examPercent / 100) * 30;
  const score = Math.round(attendScore + homeworkScore + examScore);
  const stars = Math.max(0, Math.min(5, Math.round(score / 20)));

  return { stars, score, present, absent, homework, examPercent };
}

export function starLabel(stars: number): string {
  return "★".repeat(stars) + "☆".repeat(Math.max(0, 5 - stars));
}
