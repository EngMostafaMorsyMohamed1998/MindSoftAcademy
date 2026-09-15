import { cairoDate } from "@/lib/class-clock";
import { CHAPTERS } from "@/lib/curriculum";

export const MAKEUP_SIZE = 5;
export const MAKEUP_DAYS = 3;

export type MakeupTask = {
  studentId: string;
  date: string;
  lessonId: string;
  chapterId: string;
  dueDate: string;
  completedAt: string | null;
  score: number | null;
  total: number | null;
};

export function addCairoDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  return cairoDate(new Date(Date.UTC(year, (month ?? 1) - 1, (day ?? 1) + days, 12, 0, 0)));
}

export function lessonForMakeup(chapterId?: string | null): { lessonId: string; chapterId: string } {
  const chapter = CHAPTERS.find((item) => item.id === chapterId) ?? CHAPTERS[0];
  const lesson = chapter?.lessons[0];
  return {
    lessonId: lesson?.id ?? "1-1",
    chapterId: chapter?.id ?? "1",
  };
}

export function parseMakeups(value: unknown): MakeupTask[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as MakeupTask;
    if (typeof row.studentId !== "string" || typeof row.date !== "string" || typeof row.lessonId !== "string") {
      return [];
    }
    return [
      {
        studentId: row.studentId,
        date: row.date,
        lessonId: row.lessonId,
        chapterId: typeof row.chapterId === "string" ? row.chapterId : "1",
        dueDate: typeof row.dueDate === "string" ? row.dueDate : row.date,
        completedAt: row.completedAt ?? null,
        score: typeof row.score === "number" ? row.score : null,
        total: typeof row.total === "number" ? row.total : null,
      },
    ];
  });
}

export function openMakeups(tasks: MakeupTask[], studentId: string, today = cairoDate()): MakeupTask[] {
  return tasks.filter((task) => task.studentId === studentId && !task.completedAt && task.dueDate >= today);
}
