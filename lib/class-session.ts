import { cairoDate } from "@/lib/class-clock";

type SessionCode = { id: string; name: string; phone: string; suspendedAt: string | null };
type SessionExam = {
  studentId: string;
  chapterId: string;
  objectiveScore: number;
  objectiveTotal: number;
  submittedAt: string;
};
type SessionAttendance = { studentId: string; date: string; present: boolean };
type SessionWindow = { chapterId: string; opensAt: string } | null;

export type SessionStudent = {
  studentId: string;
  name: string;
  phone: string;
  present: boolean | null;
  examPercent: number | null;
  examScore: string | null;
};

export type ClassSession = {
  id: string;
  date: string;
  chapterId: string | null;
  closedAt: string;
  presentCount: number;
  absentCount: number;
  unmarkedCount: number;
  examCount: number;
  averagePercent: number | null;
  students: SessionStudent[];
};

function examPercent(exam: SessionExam): number {
  return Math.round((exam.objectiveScore / Math.max(exam.objectiveTotal, 1)) * 100);
}

function examOnDate(exam: SessionExam, date: string): boolean {
  return cairoDate(new Date(exam.submittedAt)) === date;
}

export function buildClassSession(input: {
  id: string;
  codes: SessionCode[];
  exams: SessionExam[];
  attendance: SessionAttendance[];
  window: SessionWindow;
  date?: string;
  closedAt?: string;
}): ClassSession {
  const date = input.date ?? cairoDate();
  const chapterId = input.window?.chapterId ?? null;
  const opensAt = input.window ? new Date(input.window.opensAt).getTime() : 0;
  const students = input.codes
    .filter((code) => !code.suspendedAt)
    .map((code) => {
      const day = input.attendance.find((row) => row.studentId === code.id && row.date === date);
      const exam = input.exams
        .filter((item) => item.studentId === code.id)
        .filter((item) =>
          input.window
            ? item.chapterId === input.window.chapterId && new Date(item.submittedAt).getTime() >= opensAt
            : examOnDate(item, date),
        )
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];
      return {
        studentId: code.id,
        name: code.name,
        phone: code.phone,
        present: day ? day.present : null,
        examPercent: exam ? examPercent(exam) : null,
        examScore: exam ? `${exam.objectiveScore}/${exam.objectiveTotal}` : null,
      } satisfies SessionStudent;
    })
    .sort((a, b) => {
      const rank = (row: SessionStudent) => (row.present === false ? 0 : row.present === null ? 1 : 2);
      return rank(a) - rank(b) || a.name.localeCompare(b.name, "ar");
    });

  const scores = students.map((row) => row.examPercent).filter((value): value is number => value !== null);
  return {
    id: input.id,
    date,
    chapterId,
    closedAt: input.closedAt ?? new Date().toISOString(),
    presentCount: students.filter((row) => row.present === true).length,
    absentCount: students.filter((row) => row.present === false).length,
    unmarkedCount: students.filter((row) => row.present === null).length,
    examCount: scores.length,
    averagePercent: scores.length
      ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length)
      : null,
    students,
  };
}

export function parseClassSessions(value: unknown): ClassSession[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as ClassSession;
    if (typeof row.id !== "string" || typeof row.date !== "string") return [];
    return [
      {
        id: row.id,
        date: row.date,
        chapterId: typeof row.chapterId === "string" ? row.chapterId : null,
        closedAt: typeof row.closedAt === "string" ? row.closedAt : new Date().toISOString(),
        presentCount: Number(row.presentCount) || 0,
        absentCount: Number(row.absentCount) || 0,
        unmarkedCount: Number(row.unmarkedCount) || 0,
        examCount: Number(row.examCount) || 0,
        averagePercent: typeof row.averagePercent === "number" ? row.averagePercent : null,
        students: Array.isArray(row.students) ? row.students : [],
      },
    ];
  });
}

export function sessionsInMonth(sessions: ClassSession[], month: string): ClassSession[] {
  return sessions.filter((session) => session.date.startsWith(month)).sort((a, b) => b.date.localeCompare(a.date));
}

export function absenteeWhatsappText(name: string, date: string, locale: "ar" | "en"): string {
  if (locale === "ar") {
    return `أهلًا ${name}\nغبت عن حصة MindSoft Academy يوم ${date}.\nراجع المدرس عشان تعوّض.\nم. مصطفى محمد`;
  }
  return `Hi ${name}\nYou were absent from MindSoft Academy on ${date}.\nCheck in with the teacher to catch up.\nEng. Mostafa Mohamed`;
}

export function upsertSession(sessions: ClassSession[], next: ClassSession): ClassSession[] {
  return [next, ...sessions.filter((session) => session.date !== next.date)];
}
