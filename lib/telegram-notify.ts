import {
  listAttendance,
  listCodes,
  listExams,
  listHomeworkResults,
  listPayments,
  listTelegramLinks,
} from "@/lib/access-store";
import { BRAND } from "@/lib/brand";
import { CHAPTERS } from "@/lib/curriculum";
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
  if (chapterId === "mix") return locale === "ar" ? "امتحان تجريبي مخلوط" : "Mixed mock exam";
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

