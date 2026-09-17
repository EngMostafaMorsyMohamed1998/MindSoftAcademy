import path from "path";
import { createCanvas, GlobalFonts, type SKRSContext2D } from "@napi-rs/canvas";
import { PDFDocument } from "pdf-lib";
import { BRAND } from "@/lib/brand";
import { CHAPTER_FIGURES } from "@/components/booklet-figures";
import { buildBookletDocument, type BookletChapterPack } from "@/lib/booklet-pack";
import { LESSON_NOTES } from "@/lib/lessons";
import type { Locale } from "@/lib/locale";
import { mindMapForChapter, mindMapForFaiz, type MindNode } from "@/lib/mind-maps";

const FONT_NAME = "NotoNaskh";
const PAGE_W = 595;
const PAGE_H = 842;
const SCALE = 1.45;
const LETTERS = ["أ", "ب", "ج", "د"];
const arabicRe = /[\u0600-\u06FF]/;

let fontReady = false;

function ensureFont() {
  if (fontReady) return;
  GlobalFonts.registerFromPath(path.join(process.cwd(), "fonts/NotoNaskhArabic-Regular.ttf"), FONT_NAME);
  fontReady = true;
}

function fade(color: string, alpha = 0.1): string {
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

type TextBlock = { kind: "text"; text: string; size: number; gap?: number };
type FigureBlock = { kind: "figure"; id: string; color: string; title: string };
type MapBlock = { kind: "map"; root: MindNode; color: string; accent: string };
type SceneBlock = { kind: "scene"; color: string; term: string; scene: string; art: string };
type Block = TextBlock | FigureBlock | MapBlock | SceneBlock;

function wrap(ctx: SKRSContext2D, text: string, maxWidth: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  if (!words[0]) return [""];
  const lines: string[] = [];
  let current = words[0]!;
  for (const word of words.slice(1)) {
    const next = `${current} ${word}`;
    if (ctx.measureText(next).width <= maxWidth) current = next;
    else {
      lines.push(current);
      current = word;
    }
  }
  lines.push(current);
  return lines;
}

function paintText(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  align: "left" | "right" | "center",
) {
  ctx.direction = arabicRe.test(text) ? "rtl" : "ltr";
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
}

function roundRect(ctx: SKRSContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function boxLabel(ctx: SKRSContext2D, label: string, x: number, y: number, w: number, h: number, fill: string, size: number) {
  roundRect(ctx, x, y, w, h, 10, fill);
  ctx.fillStyle = "#ffffff";
  ctx.font = `${size}px ${FONT_NAME}`;
  paintText(ctx, label, x + w / 2, y + h / 2 - size / 2, "center");
}

function arrow(ctx: SKRSContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawFigure(ctx: SKRSContext2D, id: string, color: string, title: string, x: number, y: number, w: number): number {
  const h = 168;
  roundRect(ctx, x, y, w, h, 16, fade(color, 0.08));
  ctx.fillStyle = color;
  ctx.font = `13px ${FONT_NAME}`;
  paintText(ctx, title, x + w - 14, y + 10, "right");

  const innerTop = y + 34;
  if (id === "ai-life") {
    ["اقتراح فيديو", "فرز المصنع", "مراجعة الكتاب"].forEach((label, index) => {
      boxLabel(ctx, label, x + 20 + index * ((w - 40) / 3), innerTop + 28, (w - 56) / 3, 44, color, 13);
    });
  } else if (id === "it-timeline") {
    const steps = ["حاسوب", "إنترنت", "محمول", "سحابة", "ذكاء"];
    const bw = (w - 40) / steps.length - 8;
    steps.forEach((step, index) => {
      boxLabel(ctx, step, x + 16 + index * (bw + 10), innerTop + 28, bw, 36, color, 12);
    });
  } else if (id === "ai-nest") {
    ["ذكاء اصطناعي", "تعلم آلي", "تعلم عميق", "توليدي"].forEach((label, index) => {
      boxLabel(ctx, label, x + 24 + index * 10, innerTop + index * 22, w - 48 - index * 20, 20, color, 11);
    });
  } else if (id === "encrypt") {
    boxLabel(ctx, "نص واضح", x + 20, innerTop + 28, 110, 36, color, 13);
    arrow(ctx, x + 136, innerTop + 46, x + 168, innerTop + 46, color);
    boxLabel(ctx, "المفتاح", x + 172, innerTop + 24, 90, 44, "#111827", 13);
    arrow(ctx, x + 268, innerTop + 46, x + 300, innerTop + 46, color);
    boxLabel(ctx, "نص مشفّر", x + 304, innerTop + 28, 110, 36, color, 13);
  } else if (id === "auth") {
    boxLabel(ctx, "2FA", x + w / 2 - 40, innerTop + 4, 80, 28, "#111827", 13);
    ["تعرفه", "تملكه", "أنت عليه"].forEach((label, index) => {
      boxLabel(ctx, label, x + 24 + index * ((w - 48) / 3 + 4), innerTop + 44, (w - 64) / 3, 32, color, 12);
    });
  } else if (id === "firewall") {
    boxLabel(ctx, "إنترنت", x + 18, innerTop + 28, 90, 36, color, 12);
    boxLabel(ctx, "جدار الحماية", x + 140, innerTop + 20, 120, 52, "#111827", 12);
    boxLabel(ctx, "داخلية", x + 290, innerTop + 8, 90, 24, color, 11);
    boxLabel(ctx, "ضيوف", x + 290, innerTop + 36, 90, 24, color, 11);
    boxLabel(ctx, "حساسة", x + 290, innerTop + 64, 90, 24, color, 11);
  } else if (id === "web-stack") {
    ["واجهة أمامية", "خادم / خلفية", "بيانات"].forEach((label, index) => {
      boxLabel(ctx, label, x + 40, innerTop + 4 + index * 28, w - 80, 24, color, 12);
    });
  } else if (id === "http") {
    boxLabel(ctx, "المتصفح", x + 24, innerTop + 28, 110, 36, color, 13);
    ctx.fillStyle = color;
    ctx.font = `14px ${FONT_NAME}`;
    paintText(ctx, "GET / POST", x + w / 2, innerTop + 36, "center");
    boxLabel(ctx, "الخادم", x + w - 134, innerTop + 28, 110, 36, "#111827", 13);
  } else if (id === "html-css-js") {
    [
      ["HTML", "البنية"],
      ["CSS", "الشكل"],
      ["JavaScript", "التفاعل"],
    ].forEach(([name, hint], index) => {
      const bx = x + 18 + index * ((w - 36) / 3);
      boxLabel(ctx, `${name} — ${hint}`, bx, innerTop + 20, (w - 48) / 3, 52, color, 12);
    });
  } else if (id === "media") {
    ["JPEG صورة", "PNG شفافية", "نص للمراجعة"].forEach((label, index) => {
      boxLabel(ctx, label, x + 20 + index * ((w - 40) / 3), innerTop + 24, (w - 56) / 3, 48, color, 12);
    });
  } else if (id === "ux") {
    ["هدف", "خطوات", "قياس", "تعديل"].forEach((label, index) => {
      boxLabel(ctx, label, x + 16 + index * ((w - 32) / 4), innerTop + 28, (w - 48) / 4, 36, color, 12);
    });
  } else if (id === "collect") {
    boxLabel(ctx, "أولية: استطلاع", x + 24, innerTop + 24, w / 2 - 36, 48, color, 13);
    boxLabel(ctx, "ثانوية: تقرير", x + w / 2 + 12, innerTop + 24, w / 2 - 36, 48, "#111827", 13);
  } else if (id === "clean") {
    ["تواريخ موحّدة", "قيم ناقصة", "قيم شاذة"].forEach((label, index) => {
      boxLabel(ctx, label, x + 18 + index * ((w - 36) / 3), innerTop + 24, (w - 48) / 3, 44, color, 12);
    });
  } else if (id === "api") {
    boxLabel(ctx, "تطبيقك", x + 24, innerTop + 28, 110, 36, color, 13);
    boxLabel(ctx, "API", x + w / 2 - 40, innerTop + 28, 80, 36, "#111827", 13);
    boxLabel(ctx, "بيانات", x + w - 134, innerTop + 28, 110, 36, color, 13);
  } else if (id === "charts") {
    ctx.fillStyle = color;
    [28, 48, 70].forEach((bar, index) => {
      ctx.fillRect(x + 40 + index * 22, innerTop + 80 - bar, 16, bar);
    });
    ctx.beginPath();
    ctx.moveTo(x + 140, innerTop + 70);
    ctx.lineTo(x + 180, innerTop + 40);
    ctx.lineTo(x + 220, innerTop + 50);
    ctx.lineTo(x + 260, innerTop + 22);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + w - 70, innerTop + 50, 28, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === "regress") {
    ctx.strokeStyle = "#111827";
    ctx.beginPath();
    ctx.moveTo(x + 30, innerTop + 80);
    ctx.lineTo(x + w - 24, innerTop + 80);
    ctx.moveTo(x + 30, innerTop + 80);
    ctx.lineTo(x + 30, innerTop + 8);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 40, innerTop + 70);
    ctx.lineTo(x + w - 40, innerTop + 16);
    ctx.stroke();
    [
      [70, 62],
      [130, 50],
      [190, 40],
      [250, 28],
    ].forEach(([px, py]) => {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x + px, innerTop + py, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (id === "ml-types") {
    ["بإشراف", "بلا إشراف", "تعزيز"].forEach((label, index) => {
      boxLabel(ctx, label, x + 18 + index * ((w - 36) / 3), innerTop + 24, (w - 48) / 3, 44, color, 13);
    });
  } else if (id === "neural") {
    [40, 120, 200, 280].forEach((cx, col) => {
      [18, 48, 78].slice(0, col === 0 || col === 3 ? 2 : 3).forEach((cy) => {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x + cx, innerTop + cy, 7, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  } else {
    boxLabel(ctx, "سؤال", x + 20, innerTop + 28, 110, 36, color, 13);
    boxLabel(ctx, "نموذج", x + w / 2 - 45, innerTop + 28, 90, 36, "#111827", 13);
    boxLabel(ctx, "الكتاب", x + w - 130, innerTop + 28, 110, 36, color, 13);
  }
  return h + 10;
}

function drawMap(ctx: SKRSContext2D, root: MindNode, color: string, accent: string, x: number, y: number, w: number, ar: boolean): number {
  const title = ar ? root.labelAr : root.labelEn;
  boxLabel(ctx, title, x, y, w, 32, color, 14);
  const colW = (w - 12) / 2;
  let maxH = 44;
  root.children.slice(0, 4).forEach((branch, index) => {
    const bx = x + (index % 2) * (colW + 12);
    const by = y + 42 + Math.floor(index / 2) * 92;
    roundRect(ctx, bx, by, colW, 84, 12, fade(color, 0.08));
    ctx.fillStyle = color;
    ctx.font = `12px ${FONT_NAME}`;
    paintText(ctx, ar ? branch.labelAr : branch.labelEn, bx + colW - 10, by + 8, "right");
    branch.children.slice(0, 3).forEach((leaf, leafIndex) => {
      roundRect(ctx, bx + 8, by + 28 + leafIndex * 17, colW - 16, 15, 7, accent);
      ctx.fillStyle = "#071c45";
      ctx.font = `10px ${FONT_NAME}`;
      paintText(ctx, ar ? leaf.labelAr : leaf.labelEn, bx + colW - 16, by + 29 + leafIndex * 17, "right");
    });
    maxH = Math.max(maxH, by + 92 - y);
  });
  return maxH + 8;
}

function drawScene(ctx: SKRSContext2D, block: SceneBlock, x: number, y: number, w: number): number {
  const h = 88;
  roundRect(ctx, x, y, w, h, 14, fade(block.color, 0.08));
  ctx.fillStyle = block.color;
  if (block.art === "lock") {
    roundRect(ctx, x + 18, y + 38, 36, 28, 6, block.color);
    ctx.strokeStyle = block.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x + 36, y + 36, 12, Math.PI, 0);
    ctx.stroke();
  } else if (block.art === "cloud") {
    ctx.beginPath();
    ctx.ellipse(x + 40, y + 48, 28, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (block.art === "phone") {
    roundRect(ctx, x + 24, y + 16, 28, 56, 6, block.color);
  } else {
    roundRect(ctx, x + 16, y + 28, 48, 34, 6, block.color);
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(x + 22, y + 34, 36, 18);
  }
  ctx.fillStyle = block.color;
  ctx.font = `12px ${FONT_NAME}`;
  paintText(ctx, block.term, x + w - 14, y + 14, "right");
  ctx.fillStyle = "#334155";
  ctx.font = `11px ${FONT_NAME}`;
  const lines = wrap(ctx, block.scene, w - 90);
  lines.slice(0, 3).forEach((line, index) => {
    paintText(ctx, line, x + w - 14, y + 34 + index * 15, "right");
  });
  return h + 8;
}

function sceneArt(term: string, scene: string): string {
  const hay = `${term} ${scene}`;
  if (/سحاب|cloud/.test(hay)) return "cloud";
  if (/تشفير|مرور|تصيد|جدار/.test(hay)) return "lock";
  if (/هاتف|واتس|محمول/.test(hay)) return "phone";
  return "lab";
}

function figureTitle(id: string): string {
  const titles: Record<string, string> = {
    "it-timeline": "شكل — خط زمن التقنية",
    "ai-nest": "شكل — درجات الذكاء",
    "ai-life": "شكل — أين يظهر الذكاء",
    encrypt: "شكل — التشفير",
    auth: "شكل — المصادقة",
    firewall: "شكل — جدار الحماية",
    "web-stack": "شكل — طبقات التطبيق",
    http: "شكل — المتصفح والخادم",
    "html-css-js": "شكل — HTML و CSS و JavaScript",
    media: "شكل — اختيار الوسيط",
    ux: "شكل — دورة التجربة",
    collect: "شكل — جمع البيانات",
    clean: "شكل — تنظيف الجدول",
    api: "شكل — API",
    charts: "شكل — اختر الرسم",
    regress: "شكل — خط الانحدار",
    "ml-types": "شكل — أنواع التعلم",
    neural: "شكل — شبكة عصبونية",
    llm: "شكل — راجع المساعد",
  };
  return titles[id] ?? "شكل";
}

function pushChapter(blocks: Block[], pack: BookletChapterPack, ar: boolean) {
  const chapter = pack.chapter;
  blocks.push({ kind: "text", text: `${chapter.id}. ${ar ? chapter.titleAr : chapter.titleEn}`, size: 16, gap: 8 });
  blocks.push({ kind: "text", text: ar ? chapter.blurbAr : chapter.blurbEn, size: 11, gap: 8 });
  const map = mindMapForChapter(chapter.id);
  if (map) blocks.push({ kind: "map", root: map, color: chapter.color, accent: chapter.accent });
  for (const id of CHAPTER_FIGURES[chapter.id] ?? []) {
    blocks.push({ kind: "figure", id, color: chapter.color, title: figureTitle(id) });
  }
  for (const scene of pack.scenes) {
    const term = ar ? scene.termAr : scene.termEn;
    const text = ar ? scene.sceneAr : scene.sceneEn;
    blocks.push({ kind: "scene", color: chapter.color, term, scene: text, art: sceneArt(term, text) });
  }
  for (const note of LESSON_NOTES.filter((row) => row.chapterId === chapter.id)) {
    const lesson = chapter.lessons.find((item) => item.id === note.id);
    blocks.push({
      kind: "text",
      text: `${note.id} — ${ar ? lesson?.titleAr ?? "" : lesson?.titleEn ?? ""}`,
      size: 13,
      gap: 6,
    });
    for (const body of ar ? note.bodyAr : note.bodyEn) {
      blocks.push({ kind: "text", text: `• ${body}`, size: 11, gap: 5 });
    }
    for (const term of ar ? note.termsAr : note.termsEn) {
      blocks.push({ kind: "text", text: `${term.term}: ${term.meaning}`, size: 11, gap: 4 });
    }
    blocks.push({
      kind: "text",
      text: `${ar ? "الخلاصة" : "Takeaway"}: ${ar ? note.takeawayAr : note.takeawayEn}`,
      size: 11,
      gap: 10,
    });
  }
  blocks.push({ kind: "text", text: ar ? "تدريبات الفصل" : "Chapter practice", size: 13, gap: 8 });
  pack.practice.forEach((question, index) => {
    blocks.push({ kind: "text", text: `${index + 1}. ${ar ? question.promptAr : question.promptEn}`, size: 11, gap: 4 });
    (ar ? question.optionsAr : question.optionsEn).slice(0, 4).forEach((option, optionIndex) => {
      blocks.push({ kind: "text", text: `${LETTERS[optionIndex]}) ${option}`, size: 11, gap: 3 });
    });
    blocks.push({ kind: "text", text: "", size: 6, gap: 4 });
  });
  blocks.push({ kind: "text", text: ar ? "حلّل واكتب" : "Analyse and write", size: 13, gap: 8 });
  pack.essays.forEach((essay, index) => {
    blocks.push({
      kind: "text",
      text: `${ar ? "مقالي" : "Essay"} ${index + 1}. ${ar ? essay.promptAr : essay.promptEn}`,
      size: 11,
      gap: 16,
    });
  });
}

function buildBlocks(locale: Locale): Block[] {
  const ar = locale === "ar";
  const doc = buildBookletDocument();
  const blocks: Block[] = [
    { kind: "text", text: ar ? BRAND.nameAr : BRAND.nameEn, size: 12, gap: 6 },
    { kind: "text", text: ar ? "ملزمة الطالب — البرمجة والذكاء الاصطناعي" : "Student booklet — Programming & AI", size: 20, gap: 8 },
    { kind: "text", text: `${ar ? BRAND.teacherAr : BRAND.teacherEn} · 2026–2027`, size: 12, gap: 16 },
  ];

  for (const part of doc.parts) {
    blocks.push({
      kind: "text",
      text: part.part === 1 ? (ar ? "الجزء الأول" : "Part 1") : ar ? "الجزء الثاني" : "Part 2",
      size: 16,
      gap: 10,
    });
    for (const pack of part.chapters) pushChapter(blocks, pack, ar);
    blocks.push({ kind: "text", text: ar ? part.homework.titleAr : part.homework.titleEn, size: 14, gap: 8 });
    part.homework.mcq.forEach((question, index) => {
      blocks.push({ kind: "text", text: `${index + 1}. ${ar ? question.promptAr : question.promptEn}`, size: 11, gap: 4 });
      (ar ? question.optionsAr : question.optionsEn).slice(0, 4).forEach((option, optionIndex) => {
        blocks.push({ kind: "text", text: `${LETTERS[optionIndex]}) ${option}`, size: 11, gap: 3 });
      });
    });
    part.homework.essays.forEach((essay, index) => {
      blocks.push({
        kind: "text",
        text: `${ar ? "مقالي" : "Essay"} ${index + 1}. ${ar ? essay.promptAr : essay.promptEn}`,
        size: 11,
        gap: 16,
      });
    });
  }

  blocks.push({ kind: "text", text: ar ? "كتاب الفائز" : "Al-Faiz", size: 16, gap: 10 });
  for (const pack of doc.faiz) {
    const color =
      pack.note.id === "f2" ? "#7f1d1d" : pack.note.id === "f3" ? "#134e4a" : pack.note.id === "f4" ? "#4a1942" : "#0c2d6b";
    const accent =
      pack.note.id === "f2" ? "#f59e0b" : pack.note.id === "f3" ? "#2dd4bf" : pack.note.id === "f4" ? "#e879f9" : "#c4a35a";
    blocks.push({ kind: "text", text: ar ? pack.note.titleAr : pack.note.titleEn, size: 14, gap: 6 });
    const map = mindMapForFaiz(pack.note.id);
    if (map) blocks.push({ kind: "map", root: map, color, accent });
    for (const id of CHAPTER_FIGURES[pack.note.id] ?? []) {
      blocks.push({ kind: "figure", id, color, title: figureTitle(id) });
    }
    for (const section of pack.note.sections) {
      blocks.push({ kind: "text", text: ar ? section.headingAr : section.headingEn, size: 12, gap: 5 });
      for (const body of ar ? section.bodyAr : section.bodyEn) {
        blocks.push({ kind: "text", text: body, size: 11, gap: 4 });
      }
    }
    pack.practice.forEach((question, index) => {
      blocks.push({ kind: "text", text: `${index + 1}. ${ar ? question.promptAr : question.promptEn}`, size: 11, gap: 4 });
      (ar ? question.optionsAr : question.optionsEn).slice(0, 4).forEach((option, optionIndex) => {
        blocks.push({ kind: "text", text: `${LETTERS[optionIndex]}) ${option}`, size: 11, gap: 3 });
      });
    });
  }

  blocks.push({ kind: "text", text: ar ? "مفتاح الإجابة" : "Answer key", size: 16, gap: 8 });
  const keys = [
    ...doc.parts.flatMap(({ chapters }) =>
      chapters.map((pack) => ({
        title: ar ? `الفصل ${pack.chapter.id}` : `Chapter ${pack.chapter.id}`,
        answers: pack.answers,
      })),
    ),
    ...doc.parts.map(({ homework }) => ({ title: ar ? homework.titleAr : homework.titleEn, answers: homework.answers })),
    ...doc.faiz.map((pack) => ({ title: ar ? pack.note.titleAr : pack.note.titleEn, answers: pack.answers })),
  ];
  for (const block of keys) {
    blocks.push({
      kind: "text",
      text: `${block.title}: ${block.answers.map((row, index) => `${index + 1}${row.letter}`).join("  ")}`,
      size: 11,
      gap: 6,
    });
  }
  return blocks;
}

export async function buildBookletPdf(locale: Locale): Promise<Uint8Array> {
  ensureFont();
  const ar = locale === "ar";
  const width = PAGE_W * SCALE;
  const height = PAGE_H * SCALE;
  const margin = 40 * SCALE;
  const maxWidth = width - margin * 2;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const pdf = await PDFDocument.create();
  const blocks = buildBlocks(locale);

  const reset = () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#0b1220";
  };

  const flush = async () => {
    const page = pdf.addPage([PAGE_W, PAGE_H]);
    const image = await pdf.embedJpg(canvas.toBuffer("image/jpeg", 80));
    page.drawImage(image, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
  };

  const need = (h: number, y: number) => {
    return y + h > height - margin;
  };

  reset();
  let y = margin;
  for (const block of blocks) {
    if (block.kind === "text") {
      const size = block.size * SCALE;
      ctx.font = `${size}px ${FONT_NAME}`;
      ctx.fillStyle = "#0b1220";
      const chunks = block.text ? wrap(ctx, block.text, maxWidth) : [""];
      for (const chunk of chunks) {
        if (need(size + 8, y)) {
          await flush();
          reset();
          y = margin;
        }
        if (chunk) paintText(ctx, chunk, width - margin, y, "right");
        y += size + (block.gap ?? 6);
      }
      continue;
    }
    if (block.kind === "figure") {
      const h = 180;
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawFigure(ctx, block.id, block.color, block.title, margin, y, maxWidth);
      continue;
    }
    if (block.kind === "map") {
      const h = 230;
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawMap(ctx, block.root, block.color, block.accent, margin, y, maxWidth, ar);
      continue;
    }
    const h = 96;
    if (need(h, y)) {
      await flush();
      reset();
      y = margin;
    }
    y += drawScene(ctx, block, margin, y, maxWidth);
  }
  await flush();
  return pdf.save();
}

export function bookletFileName(locale: Locale): string {
  return locale === "ar" ? "ملزمة-MindSoft-2027.pdf" : "MindSoft-booklet-2027.pdf";
}
