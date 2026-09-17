import {
  getTeacherTelegramChatId,
  listAttendance,
  listClassGroups,
  listCodes,
  listExams,
  listHomeworkResults,
  listPayments,
  listTelegramLinks,
  persistClassGroups,
} from "@/lib/access-store";
import { cairoDate, cairoWeekday } from "@/lib/class-clock";
import { groupsOnWeekday } from "@/lib/class-groups";
import type { ClassSession } from "@/lib/class-session";
import { weekdayName } from "@/lib/week-plan";
import { BRAND } from "@/lib/brand";
import { CHAPTERS } from "@/lib/curriculum";
import { examPaperTitle } from "@/lib/faiz";
import { buildClassRoster, parentWeeklyWhatsappText, siteUrl } from "@/lib/class-roster";
import { buildReportPdf } from "@/lib/report-pdf";
import { sendTelegramDocument, sendTelegramMessage, type TelegramLink } from "@/lib/telegram";

async function rosterRow(studentId: string) {
  const [codes, exams, homework, attendance, payments] = await Promise.all([
    listCodes(),
    listExams(),
    listHomeworkResults(),
    listAttendance(),
    listPayments(),
  ]);
  return buildClassRoster(codes, exams, homework, attendance, payments).find((row) => row.id === studentId) ?? null;
}

async function deliver(links: TelegramLink[], text: string, filename: string, pdfBody: string) {
  if (!links.length) return 0;
  const pdf = await buildReportPdf("MindSoft Academy", pdfBody);
  let sent = 0;
  for (const link of links) {
    const messageOk = await sendTelegramMessage(link.chatId, text);
    const fileOk = await sendTelegramDocument(link.chatId, filename, pdf, text.slice(0, 1024));
    if (messageOk || fileOk) sent += 1;
  }
  return sent;
}

function examTitle(chapterId: string, locale: "ar" | "en"): string {
  const named = examPaperTitle(chapterId, locale);
  if (named) return named;
  const chapter = CHAPTERS.find((item) => item.id === chapterId);
  if (!chapter) return chapterId;
  return locale === "ar" ? `الفصل ${chapter.id} — ${chapter.titleAr}` : `Chapter ${chapter.id} — ${chapter.titleEn}`;
}

export async function notifyExamResult(input: {
  studentId: string;
  name: string;
  chapterId: string;
  objectiveScore: number;
  objectiveTotal: number;
  passed: boolean;
  locale: "ar" | "en";
}): Promise<void> {
  const links = await listTelegramLinks(input.studentId);
  if (!links.length) return;
  const percent = Math.round((input.objectiveScore / Math.max(input.objectiveTotal, 1)) * 100);
  const row = await rosterRow(input.studentId);
  const weekly = row
    ? parentWeeklyWhatsappText(row, input.locale)
    : input.locale === "ar"
      ? `ولي أمر ${input.name}`
      : `Parent of ${input.name}`;
  const title = examTitle(input.chapterId, input.locale);
  const status = input.passed
    ? input.locale === "ar"
      ? "ناجح"
      : "Passed"
    : input.locale === "ar"
      ? "محتاج إعادة"
      : "Needs a retake";
  const text =
    input.locale === "ar"
      ? `ولي أمر ${input.name}\nنتيجة الامتحان — ${BRAND.nameAr}\n${title}\nالدرجة: ${input.objectiveScore}/${input.objectiveTotal} (${percent}%)\nالحالة: ${status}\n\n${weekly}`
      : `Parent of ${input.name}\nExam result — ${BRAND.nameEn}\n${title}\nScore: ${input.objectiveScore}/${input.objectiveTotal} (${percent}%)\nStatus: ${status}\n\n${weekly}`;
  await deliver(links, text, `MSA-exam-${input.chapterId}.pdf`, text);
}

export async function notifyCertificateIssued(input: {
  studentId: string;
  name: string;
  serial: string;
  verifyCode: string;
  average: number;
}): Promise<void> {
  const links = await listTelegramLinks(input.studentId);
  if (!links.length) return;
  const verifyUrl = `${siteUrl()}/verify/${input.serial}`;
  const text = `ولي أمر ${input.name}\nاتصدرت شهادة إتمام موثقة — ${BRAND.nameAr}\nالرقم المسلسل: ${input.serial}\nختم التوثيق: ${input.verifyCode}\nالمتوسط: ${input.average}%\nالتحقق: ${verifyUrl}\n${BRAND.teacherAr}`;
  await deliver(links, text, `MSA-certificate-${input.serial}.pdf`, text);
}

export async function notifyWeeklyReport(studentId: string, locale: "ar" | "en"): Promise<number> {
  const links = await listTelegramLinks(studentId);
  if (!links.length) return 0;
  const row = await rosterRow(studentId);
  if (!row) return 0;
  const text = parentWeeklyWhatsappText(row, locale);
  return deliver(links, text, `MSA-report-${row.phone}.pdf`, text);
}

export async function notifyAllWeeklyReports(locale: "ar" | "en"): Promise<number> {
  const [codes, exams, homework, attendance, payments, links] = await Promise.all([
    listCodes(),
    listExams(),
    listHomeworkResults(),
    listAttendance(),
    listPayments(),
    listTelegramLinks(),
  ]);
  const roster = buildClassRoster(codes, exams, homework, attendance, payments);
  const byStudent = new Map(roster.map((row) => [row.id, row]));
  let sent = 0;
  for (const link of links) {
    const row = byStudent.get(link.studentId);
    if (!row) continue;
    sent += await deliver([link], parentWeeklyWhatsappText(row, locale), `MSA-report-${row.phone}.pdf`, parentWeeklyWhatsappText(row, locale));
  }
  return sent;
}

export async function notifySessionParents(session: ClassSession): Promise<number> {
  const links = await listTelegramLinks();
  if (!links.length) return 0;
  const byStudent = new Map<string, TelegramLink[]>();
  for (const link of links) {
    const rows = byStudent.get(link.studentId) ?? [];
    rows.push(link);
    byStudent.set(link.studentId, rows);
  }
  let sent = 0;
  for (const student of session.students) {
    const studentLinks = byStudent.get(student.studentId);
    if (!studentLinks?.length) continue;
    if (student.present !== true && student.present !== false) continue;
    const score = student.examScore
      ? `الدرجة: ${student.examScore}${student.examPercent != null ? ` (${student.examPercent}%)` : ""}`
      : "مفيش امتحان متسجل";
    const text =
      student.present === false
        ? `ولي أمر ${student.name}\nغاب النهاردة عن الحصة — ${BRAND.nameAr}\nالتاريخ: ${session.date}\n${BRAND.teacherAr}`
        : `ولي أمر ${student.name}\nحضر الحصة — ${BRAND.nameAr}\nالتاريخ: ${session.date}\n${score}\n${BRAND.teacherAr}`;
    for (const link of studentLinks) {
      if (await sendTelegramMessage(link.chatId, text)) sent += 1;
    }
  }
  return sent;
}

export async function notifyUpcomingGroups(): Promise<number> {
  const [groups, codes, teacherChatId] = await Promise.all([
    listClassGroups(),
    listCodes(),
    getTeacherTelegramChatId(),
  ]);
  if (!teacherChatId) return 0;
  const today = cairoDate();
  const due = groupsOnWeekday(groups, cairoWeekday()).filter((row) => row.remindedOn !== today);
  if (!due.length) return 0;
  const names = new Map(codes.map((row) => [row.id, row.name]));
  let sent = 0;
  const reminded = new Set<string>();
  for (const group of due) {
    const students = group.studentIds.map((id) => names.get(id) || id).filter(Boolean);
    const text = [
      `تنبيه: في حصة النهاردة — ${BRAND.nameAr}`,
      group.name,
      `${weekdayName("ar", group.weekday)} الساعة ${group.startTime}`,
      group.place ? `المكان: ${group.place}` : "",
      group.nextLesson ? `الدرس الجاي: ${group.nextLesson}` : "",
      students.length ? `الطلاب: ${students.join("، ")}` : "لسه مفيش أسماء على المجموعة.",
    ]
      .filter(Boolean)
      .join("\n");
    if (await sendTelegramMessage(teacherChatId, text)) {
      sent += 1;
      reminded.add(group.id);
    }
  }
  if (reminded.size) {
    await persistClassGroups(
      groups.map((row) => (reminded.has(row.id) ? { ...row, remindedOn: today } : row)),
    );
  }
  return sent;
}

