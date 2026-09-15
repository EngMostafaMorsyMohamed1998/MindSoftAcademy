import type { AccessCode, ExamSubmission, HomeworkResult } from "@/lib/access-store";
import { CHAPTERS, type ChapterId } from "@/lib/curriculum";
import { passedObjective } from "@/lib/chapter-progress";

export type ClassRow = {
  id: string;
  name: string;
  phone: string;
  code: string;
  activated: boolean;
  passed: ChapterId[];
  standing: ChapterId | "done";
  homeworkDone: number;
  homeworkNeed: number;
  lastScore: string;
};

const HOMEWORK_NEED = CHAPTERS.reduce((sum, chapter) => sum + chapter.lessons.length, 0);

export function buildClassRoster(
  codes: AccessCode[],
  exams: ExamSubmission[],
  homework: HomeworkResult[],
): ClassRow[] {
  return codes.map((code) => {
    const studentExams = exams.filter((item) => item.studentId === code.id);
    const passed = CHAPTERS.map((chapter) => chapter.id).filter((chapterId) =>
      studentExams.some(
        (item) =>
          item.chapterId === chapterId &&
          passedObjective(item.objectiveScore, item.objectiveTotal),
      ),
    );
    const standing = CHAPTERS.find((chapter) => !passed.includes(chapter.id))?.id ?? "done";
    const latest = studentExams[0];
    const homeworkDone = new Set(
      homework
        .filter((item) => item.studentId === code.id && item.passed)
        .map((item) => item.lessonId),
    ).size;

    return {
      id: code.id,
      name: code.name,
      phone: code.phone,
      code: code.code,
      activated: Boolean(code.usedAt),
      passed,
      standing,
      homeworkDone,
      homeworkNeed: HOMEWORK_NEED,
      lastScore: latest
        ? `${latest.objectiveScore}/${latest.objectiveTotal}`
        : "—",
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
