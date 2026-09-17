import path from "path";
import { createCanvas, GlobalFonts, type SKRSContext2D } from "@napi-rs/canvas";
import { PDFDocument } from "pdf-lib";
import { BRAND } from "@/lib/brand";
import { buildBookletDocument } from "@/lib/booklet-pack";
import { LESSON_NOTES } from "@/lib/lessons";
import type { Locale } from "@/lib/locale";

const FONT_NAME = "NotoNaskh";
const PAGE_W = 595;
const PAGE_H = 842;
const SCALE = 1.5;
const LETTERS = ["أ", "ب", "ج", "د"];
const arabicRe = /[\u0600-\u06FF]/;

let fontReady = false;

function ensureFont() {
  if (fontReady) return;
  GlobalFonts.registerFromPath(path.join(process.cwd(), "fonts/NotoNaskhArabic-Regular.ttf"), FONT_NAME);
  fontReady = true;
}

type PdfLine = {
  text: string;
  size: number;
  gap?: number;
};

function wrap(ctx: SKRSContext2D, text: string, maxWidth: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  if (!words[0]) return [""];
  const lines: string[] = [];
  let current = words[0]!;
  for (const word of words.slice(1)) {
    const next = `${current} ${word}`;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }
  lines.push(current);
  return lines;
}

function drawLine(ctx: SKRSContext2D, text: string, y: number, rtl: boolean, width: number, margin: number, maxWidth: number) {
  const arabic = rtl && arabicRe.test(text);
  if (arabic) {
    ctx.direction = "rtl";
    ctx.textAlign = "right";
    ctx.fillText(text, width - margin, y, maxWidth);
  } else {
    ctx.direction = "ltr";
    ctx.textAlign = "left";
    ctx.fillText(text, margin, y, maxWidth);
  }
}

function buildLines(locale: Locale): PdfLine[] {
  const ar = locale === "ar";
  const doc = buildBookletDocument();
  const lines: PdfLine[] = [
    { text: ar ? BRAND.nameAr : BRAND.nameEn, size: 12, gap: 6 },
    { text: ar ? "ملزمة الطالب — البرمجة والذكاء الاصطناعي" : "Student booklet — Programming & AI", size: 20, gap: 8 },
    { text: `${ar ? BRAND.teacherAr : BRAND.teacherEn} · 2026–2027`, size: 12, gap: 18 },
  ];

  for (const part of doc.parts) {
    lines.push({
      text: part.part === 1 ? (ar ? "الجزء الأول" : "Part 1") : ar ? "الجزء الثاني" : "Part 2",
      size: 16,
      gap: 12,
    });
    for (const pack of part.chapters) {
      const chapter = pack.chapter;
      lines.push({
        text: `${chapter.id}. ${ar ? chapter.titleAr : chapter.titleEn}`,
        size: 14,
        gap: 6,
      });
      lines.push({ text: ar ? chapter.blurbAr : chapter.blurbEn, size: 11, gap: 8 });
      for (const note of LESSON_NOTES.filter((row) => row.chapterId === chapter.id)) {
        const lesson = chapter.lessons.find((item) => item.id === note.id);
        lines.push({
          text: `${note.id} — ${ar ? lesson?.titleAr ?? "" : lesson?.titleEn ?? ""}`,
          size: 12,
          gap: 6,
        });
        for (const body of ar ? note.bodyAr : note.bodyEn) {
          lines.push({ text: `• ${body}`, size: 11, gap: 5 });
        }
        for (const term of ar ? note.termsAr : note.termsEn) {
          lines.push({ text: `${term.term}: ${term.meaning}`, size: 11, gap: 4 });
        }
        lines.push({
          text: `${ar ? "الخلاصة" : "Takeaway"}: ${ar ? note.takeawayAr : note.takeawayEn}`,
          size: 11,
          gap: 10,
        });
      }
      lines.push({ text: ar ? "تدريبات الفصل" : "Chapter practice", size: 13, gap: 8 });
      pack.practice.forEach((question, index) => {
        lines.push({ text: `${index + 1}. ${ar ? question.promptAr : question.promptEn}`, size: 11, gap: 4 });
        (ar ? question.optionsAr : question.optionsEn).slice(0, 4).forEach((option, optionIndex) => {
          lines.push({ text: `${LETTERS[optionIndex]}) ${option}`, size: 11, gap: 3 });
        });
        lines.push({ text: "", size: 6, gap: 4 });
      });
      lines.push({ text: ar ? "حلّل واكتب" : "Analyse and write", size: 13, gap: 8 });
      pack.essays.forEach((essay, index) => {
        lines.push({
          text: `${ar ? "مقالي" : "Essay"} ${index + 1}. ${ar ? essay.promptAr : essay.promptEn}`,
          size: 11,
          gap: 16,
        });
      });
    }
    lines.push({ text: ar ? part.homework.titleAr : part.homework.titleEn, size: 14, gap: 8 });
    part.homework.mcq.forEach((question, index) => {
      lines.push({ text: `${index + 1}. ${ar ? question.promptAr : question.promptEn}`, size: 11, gap: 4 });
      (ar ? question.optionsAr : question.optionsEn).slice(0, 4).forEach((option, optionIndex) => {
        lines.push({ text: `${LETTERS[optionIndex]}) ${option}`, size: 11, gap: 3 });
      });
      lines.push({ text: "", size: 6, gap: 4 });
    });
    part.homework.essays.forEach((essay, index) => {
      lines.push({
        text: `${ar ? "مقالي" : "Essay"} ${index + 1}. ${ar ? essay.promptAr : essay.promptEn}`,
        size: 11,
        gap: 16,
      });
    });
  }

  lines.push({ text: ar ? "كتاب الفائز" : "Al-Faiz", size: 16, gap: 10 });
  for (const pack of doc.faiz) {
    lines.push({ text: ar ? pack.note.titleAr : pack.note.titleEn, size: 13, gap: 6 });
    for (const section of pack.note.sections) {
      lines.push({ text: ar ? section.headingAr : section.headingEn, size: 12, gap: 5 });
      for (const body of ar ? section.bodyAr : section.bodyEn) {
        lines.push({ text: body, size: 11, gap: 4 });
      }
    }
    pack.practice.forEach((question, index) => {
      lines.push({ text: `${index + 1}. ${ar ? question.promptAr : question.promptEn}`, size: 11, gap: 4 });
      (ar ? question.optionsAr : question.optionsEn).slice(0, 4).forEach((option, optionIndex) => {
        lines.push({ text: `${LETTERS[optionIndex]}) ${option}`, size: 11, gap: 3 });
      });
    });
  }
  lines.push({ text: ar ? doc.faizHomework.titleAr : doc.faizHomework.titleEn, size: 14, gap: 8 });
  doc.faizHomework.mcq.forEach((question, index) => {
    lines.push({ text: `${index + 1}. ${ar ? question.promptAr : question.promptEn}`, size: 11, gap: 4 });
    (ar ? question.optionsAr : question.optionsEn).slice(0, 4).forEach((option, optionIndex) => {
      lines.push({ text: `${LETTERS[optionIndex]}) ${option}`, size: 11, gap: 3 });
    });
  });
  doc.faizHomework.essays.forEach((essay, index) => {
    lines.push({
      text: `${ar ? "مقالي" : "Essay"} ${index + 1}. ${ar ? essay.promptAr : essay.promptEn}`,
      size: 11,
      gap: 16,
    });
  });

  lines.push({ text: ar ? "مفتاح الإجابة" : "Answer key", size: 16, gap: 8 });
  const keys = [
    ...doc.parts.flatMap(({ chapters }) =>
      chapters.map((pack) => ({
        title: ar ? `الفصل ${pack.chapter.id}` : `Chapter ${pack.chapter.id}`,
        answers: pack.answers,
      })),
    ),
    ...doc.parts.map(({ homework }) => ({ title: ar ? homework.titleAr : homework.titleEn, answers: homework.answers })),
    ...doc.faiz.map((pack) => ({ title: ar ? pack.note.titleAr : pack.note.titleEn, answers: pack.answers })),
    { title: ar ? doc.faizHomework.titleAr : doc.faizHomework.titleEn, answers: doc.faizHomework.answers },
  ];
  for (const block of keys) {
    lines.push({
      text: `${block.title}: ${block.answers.map((row, index) => `${index + 1}${row.letter}`).join("  ")}`,
      size: 11,
      gap: 6,
    });
  }
  return lines;
}

export async function buildBookletPdf(locale: Locale): Promise<Uint8Array> {
  ensureFont();
  const rtl = locale === "ar";
  const width = PAGE_W * SCALE;
  const height = PAGE_H * SCALE;
  const margin = 42 * SCALE;
  const maxWidth = width - margin * 2;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";

  const pdf = await PDFDocument.create();
  const rows = buildLines(locale);

  const reset = () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#0b1220";
  };

  const flush = async () => {
    const page = pdf.addPage([PAGE_W, PAGE_H]);
    const image = await pdf.embedPng(canvas.toBuffer("image/png"));
    page.drawImage(image, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
  };

  reset();
  let y = margin;
  for (const row of rows) {
    const size = row.size * SCALE;
    ctx.font = `${size}px ${FONT_NAME}`;
    const chunks = row.text ? wrap(ctx, row.text, maxWidth) : [""];
    for (const chunk of chunks) {
      if (y + size > height - margin) {
        await flush();
        reset();
        y = margin;
      }
      if (chunk) drawLine(ctx, chunk, y, rtl, width, margin, maxWidth);
      y += size + (row.gap ?? 6) * (SCALE / 1.5);
    }
  }
  await flush();
  return pdf.save();
}

export function bookletFileName(locale: Locale): string {
  return locale === "ar" ? "ملزمة-MindSoft-2027.pdf" : "MindSoft-booklet-2027.pdf";
}
