import type { AccessCode, AttendanceRow, ExamSubmission, HomeworkResult } from "@/lib/access-store";
import { CHAPTERS, type ChapterId } from "@/lib/curriculum";
import { passedObjective } from "@/lib/chapter-progress";
import { cairoDate } from "@/lib/class-clock";

export const SCORE_DROP = 15;

export type ClassRow = {
  id: string;
  name: string;
  phone: string;
  code: string;
  activated: boolean;
  suspended: boolean;
  passed: ChapterId[];
  standing: ChapterId | "done";
  homeworkDone: number;
  homeworkNeed: number;
  lastScore: string;
  lastPercent: number | null;
  previousPercent: number | null;
  declined: boolean;
  missingHomework: string[];
  presentToday: boolean | null;
  attendancePresent: number;
  attendanceTotal: number;
};

function examPercent(exam: ExamSubmission): number {
  return Math.round((exam.objectiveScore / Math.max(exam.objectiveTotal, 1)) * 100);
}

const HOMEWORK_NEED = CHAPTERS.reduce((sum, chapter) => sum + chapter.lessons.length, 0);

export function buildClassRoster(
  codes: AccessCode[],
  exams: ExamSubmission[],
  homework: HomeworkResult[],
  attendance: AttendanceRow[] = [],
  today = cairoDate(),
): ClassRow[] {
  return codes.map((code) => {
    const studentExams = exams
      .filter((item) => item.studentId === code.id)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    const passed = CHAPTERS.map((chapter) => chapter.id).filter((chapterId) =>
      studentExams.some(
        (item) =>
          item.chapterId === chapterId &&
          passedObjective(item.objectiveScore, item.objectiveTotal),
      ),
    );
    const standing = CHAPTERS.find((chapter) => !passed.includes(chapter.id))?.id ?? "done";
    const latest = studentExams[0];
    const previous = studentExams[1];
    const lastPercent = latest ? examPercent(latest) : null;
    const previousPercent = previous ? examPercent(previous) : null;
    const passedLessons = new Set(
      homework
        .filter((item) => item.studentId === code.id && item.passed)
        .map((item) => item.lessonId),
    );
    const missingHomework = CHAPTERS.flatMap((chapter) => chapter.lessons)
      .map((lesson) => lesson.id)
      .filter((lessonId) => !passedLessons.has(lessonId));
    const days = attendance.filter((row) => row.studentId === code.id);
    const todayRow = days.find((row) => row.date === today);

    return {
      id: code.id,
      name: code.name,
      phone: code.phone,
      code: code.code,
      activated: Boolean(code.usedAt),
      suspended: Boolean(code.suspendedAt),
      passed,
      standing,
      homeworkDone: passedLessons.size,
      homeworkNeed: HOMEWORK_NEED,
      lastScore: latest ? `${latest.objectiveScore}/${latest.objectiveTotal}` : "—",
      lastPercent,
      previousPercent,
      declined:
        lastPercent !== null &&
        previousPercent !== null &&
        previousPercent - lastPercent >= SCORE_DROP,
      missingHomework,
      presentToday: todayRow ? todayRow.present : null,
      attendancePresent: days.filter((row) => row.present).length,
      attendanceTotal: days.length,
    };
  });
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://baccalaureate-platform-mind-soft-academy.vercel.app"
  );
}

export function whatsappHref(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("20")
    ? digits
    : digits.startsWith("0")
      ? `20${digits.slice(1)}`
      : `20${digits}`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}

export function codeWhatsappText(name: string, code: string, locale: "ar" | "en"): string {
  const activate = `${siteUrl()}/activate`;
  if (locale === "ar") {
    return `أهلًا ${name}\nكود اشتراك MindSoft Academy: ${code}\nفعّل من هنا: ${activate}\nالاسم والرقم لازم يطابقوا التسجيل.\nم. مصطفى محمد`;
  }
  return `Hi ${name}\nMindSoft Academy class code: ${code}\nActivate here: ${activate}\nName and phone must match the register.\nEng. Mostafa Mohamed`;
}

export function parentWeeklyWhatsappText(row: ClassRow, locale: "ar" | "en"): string {
  const shown = row.missingHomework.slice(0, 6);
  const extra = row.missingHomework.length > 6 ? ` +${row.missingHomework.length - 6}` : "";
  const missing = shown.length ? `${shown.join(locale === "ar" ? "، " : ", ")}${extra}` : locale === "ar" ? "لا يوجد" : "None";
  const score =
    row.lastPercent === null ? (locale === "ar" ? "لسه مفيش امتحان" : "No exam yet") : `${row.lastScore} (${row.lastPercent}%)`;
  if (locale === "ar") {
    return `ولي أمر ${row.name}\nتقرير الأسبوع — MindSoft Academy\nالحضور: ${row.attendancePresent}/${row.attendanceTotal}\nآخر درجة: ${score}\nالواجب الناقص: ${missing}\nم. مصطفى محمد`;
  }
  return `Parent of ${row.name}\nWeekly report — MindSoft Academy\nAttendance: ${row.attendancePresent}/${row.attendanceTotal}\nLast score: ${score}\nMissing homework: ${missing}\nEng. Mostafa Mohamed`;
}
