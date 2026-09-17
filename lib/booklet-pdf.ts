import { readFileSync } from "fs";
import path from "path";
// The package ships without types.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error -- no bundled types
import { ArabicShaper } from "arabic-persian-reshaper";
import fontkit from "@pdf-lib/fontkit";
import bidiFactory from "bidi-js";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { BRAND } from "@/lib/brand";
import { buildBookletDocument } from "@/lib/booklet-pack";
import { LESSON_NOTES } from "@/lib/lessons";
import type { Locale } from "@/lib/locale";

const PAGE = { w: 595, h: 842, margin: 44 };
const LETTERS = ["أ", "ب", "ج", "د"];
const bidi = bidiFactory();

type PdfLine = {
  text: string;
  size: number;
  gap?: number;
};

function hasArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function shape(text: string): string {
  if (!hasArabic(text)) return text;
  const converted = ArabicShaper.convertArabic(text);
  const levels = bidi.getEmbeddingLevels(converted, "rtl");
  return bidi.getReorderedString(converted, levels);
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  if (!words[0]) return [];
  const lines: string[] = [];
  let current = words[0]!;
  for (const word of words.slice(1)) {
    const next = `${current} ${word}`;
    if (font.widthOfTextAtSize(shape(next), size) <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }
  lines.push(current);
  return lines;
}

class Writer {
  private readonly doc: PDFDocument;
  private page: PDFPage;
  private y: number;
  constructor(
    doc: PDFDocument,
    private readonly font: PDFFont,
    private readonly rtl: boolean,
  ) {
    this.doc = doc;
    this.page = doc.addPage([PAGE.w, PAGE.h]);
    this.y = PAGE.h - PAGE.margin;
  }

  private ensure(size: number) {
    if (this.y - size < PAGE.margin) {
      this.page = this.doc.addPage([PAGE.w, PAGE.h]);
      this.y = PAGE.h - PAGE.margin;
    }
  }

  add(lines: PdfLine[]) {
    const maxWidth = PAGE.w - PAGE.margin * 2;
    for (const line of lines) {
      const chunks = line.text ? wrap(line.text, this.font, line.size, maxWidth) : [""];
      for (const chunk of chunks) {
        this.ensure(line.size + 4);
        if (chunk) {
          const drawn = shape(chunk);
          const width = this.font.widthOfTextAtSize(drawn, line.size);
          const x = this.rtl && hasArabic(chunk) ? PAGE.w - PAGE.margin - width : PAGE.margin;
          this.page.drawText(drawn, {
            x,
            y: this.y - line.size,
            size: line.size,
            font: this.font,
            color: rgb(0.04, 0.11, 0.27),
          });
        }
        this.y -= line.size + (line.gap ?? 6);
      }
    }
  }

  space(amount = 10) {
    this.y -= amount;
    if (this.y < PAGE.margin) {
      this.page = this.doc.addPage([PAGE.w, PAGE.h]);
      this.y = PAGE.h - PAGE.margin;
    }
  }
}

function buildLines(locale: Locale): PdfLine[] {
  const ar = locale === "ar";
  const doc = buildBookletDocument();
  const lines: PdfLine[] = [
    { text: ar ? BRAND.nameAr : BRAND.nameEn, size: 11, gap: 4 },
    { text: ar ? "ملزمة الطالب — البرمجة والذكاء الاصطناعي" : "Student booklet — Programming & AI", size: 18, gap: 8 },
    { text: `${ar ? BRAND.teacherAr : BRAND.teacherEn} · 2026–2027`, size: 11, gap: 16 },
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
      lines.push({ text: ar ? chapter.blurbAr : chapter.blurbEn, size: 10, gap: 8 });
      for (const note of LESSON_NOTES.filter((row) => row.chapterId === chapter.id)) {
        const lesson = chapter.lessons.find((item) => item.id === note.id);
        lines.push({
          text: `${note.id} — ${ar ? lesson?.titleAr ?? "" : lesson?.titleEn ?? ""}`,
          size: 12,
          gap: 6,
        });
        for (const body of ar ? note.bodyAr : note.bodyEn) {
          lines.push({ text: `• ${body}`, size: 10, gap: 4 });
        }
        for (const term of ar ? note.termsAr : note.termsEn) {
          lines.push({ text: `${term.term}: ${term.meaning}`, size: 10, gap: 3 });
        }
        lines.push({
          text: `${ar ? "الخلاصة" : "Takeaway"}: ${ar ? note.takeawayAr : note.takeawayEn}`,
          size: 10,
          gap: 10,
        });
      }
      lines.push({ text: ar ? "تدريبات الفصل" : "Chapter practice", size: 12, gap: 8 });
      pack.practice.forEach((question, index) => {
        lines.push({ text: `${index + 1}. ${ar ? question.promptAr : question.promptEn}`, size: 10, gap: 4 });
        (ar ? question.optionsAr : question.optionsEn).slice(0, 4).forEach((option, optionIndex) => {
          lines.push({ text: `${LETTERS[optionIndex]}) ${option}`, size: 10, gap: 3 });
        });
        lines.push({ text: "", size: 6, gap: 4 });
      });
      lines.push({ text: ar ? "حلّل واكتب" : "Analyse and write", size: 12, gap: 8 });
      pack.essays.forEach((essay, index) => {
        lines.push({ text: `${ar ? "مقالي" : "Essay"} ${index + 1}. ${ar ? essay.promptAr : essay.promptEn}`, size: 10, gap: 14 });
      });
    }
    lines.push({ text: ar ? part.homework.titleAr : part.homework.titleEn, size: 14, gap: 8 });
    part.homework.mcq.forEach((question, index) => {
      lines.push({ text: `${index + 1}. ${ar ? question.promptAr : question.promptEn}`, size: 10, gap: 4 });
      (ar ? question.optionsAr : question.optionsEn).slice(0, 4).forEach((option, optionIndex) => {
        lines.push({ text: `${LETTERS[optionIndex]}) ${option}`, size: 10, gap: 3 });
      });
      lines.push({ text: "", size: 6, gap: 4 });
    });
    part.homework.essays.forEach((essay, index) => {
      lines.push({ text: `${ar ? "مقالي" : "Essay"} ${index + 1}. ${ar ? essay.promptAr : essay.promptEn}`, size: 10, gap: 14 });
    });
  }

  lines.push({ text: ar ? "كتاب الفائز" : "Al-Faiz", size: 16, gap: 10 });
  for (const pack of doc.faiz) {
    lines.push({ text: ar ? pack.note.titleAr : pack.note.titleEn, size: 13, gap: 6 });
    for (const section of pack.note.sections) {
      lines.push({ text: ar ? section.headingAr : section.headingEn, size: 11, gap: 5 });
      for (const body of ar ? section.bodyAr : section.bodyEn) {
        lines.push({ text: body, size: 10, gap: 4 });
      }
    }
    pack.practice.forEach((question, index) => {
      lines.push({ text: `${index + 1}. ${ar ? question.promptAr : question.promptEn}`, size: 10, gap: 4 });
      (ar ? question.optionsAr : question.optionsEn).slice(0, 4).forEach((option, optionIndex) => {
        lines.push({ text: `${LETTERS[optionIndex]}) ${option}`, size: 10, gap: 3 });
      });
    });
  }
  lines.push({ text: ar ? doc.faizHomework.titleAr : doc.faizHomework.titleEn, size: 14, gap: 8 });
  doc.faizHomework.mcq.forEach((question, index) => {
    lines.push({ text: `${index + 1}. ${ar ? question.promptAr : question.promptEn}`, size: 10, gap: 4 });
    (ar ? question.optionsAr : question.optionsEn).slice(0, 4).forEach((option, optionIndex) => {
      lines.push({ text: `${LETTERS[optionIndex]}) ${option}`, size: 10, gap: 3 });
    });
  });
  doc.faizHomework.essays.forEach((essay, index) => {
    lines.push({ text: `${ar ? "مقالي" : "Essay"} ${index + 1}. ${ar ? essay.promptAr : essay.promptEn}`, size: 10, gap: 14 });
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
      size: 10,
      gap: 5,
    });
  }
  return lines;
}

export async function buildBookletPdf(locale: Locale): Promise<Uint8Array> {
  const bytes = readFileSync(path.join(process.cwd(), "fonts/NotoNaskhArabic-Regular.ttf"));
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(bytes, { subset: true });
  const writer = new Writer(pdf, font, locale === "ar");
  writer.add(buildLines(locale));
  return pdf.save();
}

export function bookletFileName(locale: Locale): string {
  return locale === "ar" ? "ملزمة-MindSoft-2027.pdf" : "MindSoft-booklet-2027.pdf";
}
