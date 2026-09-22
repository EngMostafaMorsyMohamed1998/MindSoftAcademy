import path from "path";
import { createCanvas, GlobalFonts, loadImage, type Image, type SKRSContext2D } from "@napi-rs/canvas";
import { PDFDocument } from "pdf-lib";
import { BRAND } from "@/lib/brand";
import { CHAPTER_FIGURES } from "@/components/booklet-figures";
import { artFor, bookletSafe, lessonArtMap } from "@/lib/booklet-lang";
import { assessLessonId, assessLessonTitle } from "@/lib/assessments";
import { assessBlocksForLesson, periodLabelAr, periodLabelEn } from "@/lib/assessments-bank";
import { assessGuide, assessOptions, assessPrompt } from "@/lib/assessments-helpers";
import {
  bookletAnswerMark,
  bookletFaizHomework,
  bookletFaizPack,
  bookletFaizPacks,
  bookletHomeworkForChapter,
  bookletLessonPack,
  bookletLetters,
  bookletOptions,
  bookletPrompt,
  faizUnitId,
  homeworkChapterId,
  type BookletFaizPack,
  type BookletHomeworkPack,
  type BookletLessonPack,
  type BookletMcq,
  type BookletScope,
} from "@/lib/booklet-pack";
import { getChapter, getLesson } from "@/lib/curriculum";
import type { Locale } from "@/lib/locale";
import { mindMapForFaiz, type MindNode } from "@/lib/mind-maps";
import { existsSync } from "fs";
import { textbookPageFor } from "@/lib/textbook-pages";
import { bundleExplains } from "@/lib/lesson-explains";
import { renderBookPage } from "@/lib/book-page-image";

const ARABIC_FONT = "NotoNaskh";
const LATIN_FONT = "LatinSans";
const FONT_NAME = ARABIC_FONT;
let latinOnly = false;
const PAGE_W = 595;
const PAGE_H = 842;
const SCALE = 2.5;
const LETTERS = ["أ", "ب", "ج", "د"];

let fontReady = false;

function ensureFont() {
  if (fontReady) return;
  GlobalFonts.registerFromPath(path.join(process.cwd(), "fonts/NotoNaskhArabic-Regular.ttf"), ARABIC_FONT);
  const latinFiles = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial.ttf",
    path.join(process.cwd(), "fonts/Geist-Regular.ttf"),
  ];
  for (const file of latinFiles) {
    if (!existsSync(/* turbopackIgnore: true */ file)) continue;
    GlobalFonts.registerFromPath(file, LATIN_FONT);
    break;
  }
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
type BannerBlock = { kind: "banner"; text: string; color: string };
type SectionBlock = { kind: "section"; text: string };
type QuestionBlock = { kind: "question"; n: number; prompt: string; options: string[]; letters: string[] };
type EssayBlock = { kind: "essay"; n: number; prompt: string };
type FigureBlock = { kind: "figure"; id: string; color: string; title: string };
type MapBlock = { kind: "map"; root: MindNode; color: string; accent: string };
type SceneItem = { term: string; scene: string; art: string; src?: string };
type SceneBlock = { kind: "scene"; color: string; term: string; scene: string; art: string; src?: string };
type ScenesBlock = { kind: "scenes"; color: string; items: SceneItem[] };
type AskBlock = { kind: "ask"; text: string };
type PhotoBlock = { kind: "photo"; src?: string; art: string; title: string; intro: string };
type TableBlock = { kind: "table"; headers: string[]; rows: { cells: string[]; example?: string }[] };
type TermsBlock = { kind: "terms"; color: string; items: { term: string; meaning: string; art: string }[] };
type ExplainBlock = { kind: "explain"; title: string; body: string; example: string; art: string; color: string };
type PointsBlock = { kind: "points"; items: string[] };
type TakeawayBlock = { kind: "takeaway"; text: string };
type BreakBlock = { kind: "break" };
type Block =
  | TextBlock
  | BannerBlock
  | SectionBlock
  | QuestionBlock
  | EssayBlock
  | FigureBlock
  | MapBlock
  | SceneBlock
  | ScenesBlock
  | AskBlock
  | PhotoBlock
  | TableBlock
  | TermsBlock
  | ExplainBlock
  | PointsBlock
  | TakeawayBlock
  | BreakBlock;

function hasArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function fontPx(ctx: SKRSContext2D): number {
  const match = /(\d+(?:\.\d+)?)px/.exec(ctx.font);
  return match ? Number(match[1]) : 14;
}

function applyFace(ctx: SKRSContext2D, text: string) {
  const size = fontPx(ctx);
  const bold = /\bbold\b/i.test(ctx.font);
  const latin = latinOnly || !hasArabic(text);
  ctx.font = `${bold ? "bold " : ""}${size}px ${latin ? LATIN_FONT : ARABIC_FONT}`;
}

function textWidth(ctx: SKRSContext2D, text: string): number {
  applyFace(ctx, text);
  return ctx.measureText(text).width;
}

function wrap(ctx: SKRSContext2D, text: string, maxWidth: number): string[] {
  applyFace(ctx, text);
  ctx.direction = hasArabic(text) ? "rtl" : "ltr";
  const paragraphs = text.replace(/\r/g, "").split("\n").map((row) => row.replace(/[^\S\n]+/g, " ").trim()).filter(Boolean);
  if (!paragraphs.length) return [""];
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ");
    let current = words[0] ?? "";
    for (const word of words.slice(1)) {
      const next = `${current} ${word}`;
      if (textWidth(ctx, next) <= maxWidth) current = next;
      else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
  }
  return lines.length ? lines : [""];
}

function paintText(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  align: "left" | "right" | "center",
) {
  applyFace(ctx, text);
  ctx.textBaseline = "top";
  ctx.direction = hasArabic(text) ? "rtl" : "ltr";
  ctx.textAlign = align;
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

function drawFigure(
  ctx: SKRSContext2D,
  id: string,
  color: string,
  title: string,
  x: number,
  y: number,
  w: number,
  ar = true,
): number {
  const h = 168;
  roundRect(ctx, x, y, w, h, 16, fade(color, 0.08));
  ctx.fillStyle = color;
  ctx.font = `13px ${FONT_NAME}`;
  paintText(ctx, title, ar ? x + w - 14 : x + 14, y + 10, ar ? "right" : "left");

  const innerTop = y + 34;
  const tr = (arabic: string, english: string) => (ar ? arabic : english);
  if (id === "ai-life") {
    [tr("اقتراح فيديو", "Video suggest"), tr("فرز المصنع", "Factory sort"), tr("مراجعة الكتاب", "Check the book")].forEach(
      (label, index) => {
        boxLabel(ctx, label, x + 20 + index * ((w - 40) / 3), innerTop + 28, (w - 56) / 3, 44, color, 13);
      },
    );
  } else if (id === "it-timeline") {
    const steps = ar
      ? ["حاسوب", "إنترنت", "محمول", "سحابة", "ذكاء"]
      : ["Computer", "Internet", "Mobile", "Cloud", "AI"];
    const bw = (w - 40) / steps.length - 8;
    steps.forEach((step, index) => {
      const bx = ar
        ? x + w - 16 - (index + 1) * bw - index * 10
        : x + 16 + index * (bw + 10);
      boxLabel(ctx, step, bx, innerTop + 28, bw, 36, color, 12);
    });
  } else if (id === "ai-nest") {
    [tr("ذكاء اصطناعي", "AI"), tr("تعلم آلي", "Machine learning"), tr("تعلم عميق", "Deep learning"), tr("توليدي", "Generative")].forEach(
      (label, index) => {
        boxLabel(ctx, label, x + 24 + index * 10, innerTop + index * 22, w - 48 - index * 20, 20, color, 11);
      },
    );
  } else if (id === "encrypt") {
    boxLabel(ctx, tr("نص واضح", "Plain text"), x + 20, innerTop + 28, 110, 36, color, 13);
    arrow(ctx, x + 136, innerTop + 46, x + 168, innerTop + 46, color);
    boxLabel(ctx, tr("المفتاح", "Key"), x + 172, innerTop + 24, 90, 44, "#111827", 13);
    arrow(ctx, x + 268, innerTop + 46, x + 300, innerTop + 46, color);
    boxLabel(ctx, tr("نص مشفّر", "Cipher"), x + 304, innerTop + 28, 110, 36, color, 13);
  } else if (id === "auth") {
    boxLabel(ctx, tr("تحقق بخطوتين", "Two-step check"), x + w / 2 - 52, innerTop + 4, 104, 28, "#111827", 12);
    [tr("تعرفه", "Know"), tr("تملكه", "Have"), tr("أنت عليه", "Are")].forEach((label, index) => {
      boxLabel(ctx, label, x + 24 + index * ((w - 48) / 3 + 4), innerTop + 44, (w - 64) / 3, 32, color, 12);
    });
  } else if (id === "firewall") {
    boxLabel(ctx, tr("إنترنت", "Internet"), x + 18, innerTop + 28, 90, 36, color, 12);
    boxLabel(ctx, tr("جدار الحماية", "Firewall"), x + 140, innerTop + 20, 120, 52, "#111827", 12);
    boxLabel(ctx, tr("داخلية", "LAN"), x + 290, innerTop + 8, 90, 24, color, 11);
    boxLabel(ctx, tr("ضيوف", "Guest"), x + 290, innerTop + 36, 90, 24, color, 11);
    boxLabel(ctx, tr("حساسة", "Secure"), x + 290, innerTop + 64, 90, 24, color, 11);
  } else if (id === "web-stack") {
    [tr("واجهة أمامية", "Frontend"), tr("خادم / خلفية", "Backend"), tr("بيانات", "Data")].forEach((label, index) => {
      boxLabel(ctx, label, x + 40, innerTop + 4 + index * 28, w - 80, 24, color, 12);
    });
  } else if (id === "http") {
    boxLabel(ctx, tr("المتصفح", "Browser"), x + 24, innerTop + 28, 110, 36, color, 13);
    ctx.fillStyle = color;
    ctx.font = `14px ${FONT_NAME}`;
    paintText(ctx, tr("قراءة / إرسال", "Read / send"), x + w / 2, innerTop + 36, "center");
    boxLabel(ctx, tr("الخادم", "Server"), x + w - 134, innerTop + 28, 110, 36, "#111827", 13);
  } else if (id === "html-css-js") {
    [
      [tr("هيكل الصفحة", "Page structure"), tr("البنية", "bones")],
      [tr("تنسيق الصفحة", "Page style"), tr("الشكل", "look")],
      [tr("لغة التفاعل", "Page action"), tr("التفاعل", "action")],
    ].forEach(([name, hint], index) => {
      const bx = x + 18 + index * ((w - 36) / 3);
      boxLabel(ctx, `${name} — ${hint}`, bx, innerTop + 20, (w - 48) / 3, 52, color, 12);
    });
  } else if (id === "media") {
    [tr("صورة مضغوطة", "Compressed photo"), tr("صورة شفافة", "Clear-background photo"), tr("نص للمراجعة", "Text to check")].forEach(
      (label, index) => {
        boxLabel(ctx, label, x + 20 + index * ((w - 40) / 3), innerTop + 24, (w - 56) / 3, 48, color, 12);
      },
    );
  } else if (id === "ux") {
    [tr("هدف", "Goal"), tr("خطوات", "Steps"), tr("قياس", "Measure"), tr("تعديل", "Change")].forEach((label, index) => {
      boxLabel(ctx, label, x + 16 + index * ((w - 32) / 4), innerTop + 28, (w - 48) / 4, 36, color, 12);
    });
  } else if (id === "collect") {
    boxLabel(ctx, tr("أولية: استطلاع", "Primary: survey"), x + 24, innerTop + 24, w / 2 - 36, 48, color, 13);
    boxLabel(ctx, tr("ثانوية: تقرير", "Secondary: report"), x + w / 2 + 12, innerTop + 24, w / 2 - 36, 48, "#111827", 13);
  } else if (id === "clean") {
    [tr("تواريخ موحّدة", "Unified dates"), tr("قيم ناقصة", "Missing values"), tr("قيم شاذة", "Outliers")].forEach(
      (label, index) => {
        boxLabel(ctx, label, x + 18 + index * ((w - 36) / 3), innerTop + 24, (w - 48) / 3, 44, color, 12);
      },
    );
  } else if (id === "api") {
    boxLabel(ctx, tr("تطبيقك", "Your app"), x + 24, innerTop + 28, 110, 36, color, 13);
    boxLabel(ctx, tr("واجهة برمجية", "Data door"), x + w / 2 - 52, innerTop + 28, 104, 36, "#111827", 12);
    boxLabel(ctx, tr("بيانات", "Data"), x + w - 134, innerTop + 28, 110, 36, color, 13);
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
    [tr("بإشراف", "Supervised"), tr("بلا إشراف", "Unsupervised"), tr("تعزيز", "Reinforcement")].forEach((label, index) => {
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
    boxLabel(ctx, tr("سؤال", "Question"), x + 20, innerTop + 28, 110, 36, color, 13);
    boxLabel(ctx, tr("نموذج", "Model"), x + w / 2 - 45, innerTop + 28, 90, 36, "#111827", 13);
    boxLabel(ctx, tr("الكتاب", "Book"), x + w - 130, innerTop + 28, 110, 36, color, 13);
  }
  return h + 10;
}

function wrapFit(ctx: SKRSContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const lines = wrap(ctx, text, maxWidth);
  if (lines.length <= maxLines) return lines.length ? lines : [""];
  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1] ?? "";
  while (last.length > 1 && textWidth(ctx, `${last}…`) > maxWidth) {
    last = last.slice(0, -1).trimEnd();
  }
  kept[maxLines - 1] = `${last}…`;
  return kept;
}

function paintClipped(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  align: "left" | "right" | "center",
) {
  ctx.save();
  const left = align === "right" ? x - maxWidth : align === "center" ? x - maxWidth / 2 : x;
  ctx.beginPath();
  ctx.rect(left, y - 2, maxWidth, 22);
  ctx.clip();
  paintText(ctx, text, x, y, align);
  ctx.restore();
}

function mapCard(
  ctx: SKRSContext2D,
  branch: MindNode,
  colW: number,
  ar: boolean,
): { titleLines: string[]; leaves: { label: string }[]; h: number } {
  ctx.font = `12px ${FONT_NAME}`;
  const titleLines = wrapFit(
    ctx,
    bookletSafe(ar ? "ar" : "en", ar ? branch.labelAr : branch.labelEn),
    colW - 20,
    2,
  );
  const leaves = branch.children.slice(0, 3).map((leaf) => ({
    label: bookletSafe(ar ? "ar" : "en", ar ? leaf.labelAr : leaf.labelEn),
  }));
  return { titleLines, leaves, h: 14 + titleLines.length * 15 + 8 + leaves.length * 20 + 10 };
}

function mapHeight(ctx: SKRSContext2D, root: MindNode, w: number, ar: boolean): number {
  ctx.font = `14px ${FONT_NAME}`;
  const title = bookletSafe(ar ? "ar" : "en", ar ? root.labelAr : root.labelEn);
  const titleH = Math.max(32, wrapFit(ctx, title, w - 24, 2).length * 18 + 12);
  const colW = (w - 12) / 2;
  const cards = root.children.slice(0, 4).map((branch) => mapCard(ctx, branch, colW, ar));
  let used = titleH + 12;
  for (let row = 0; row < 2; row += 1) {
    const pair = cards.slice(row * 2, row * 2 + 2);
    if (!pair.length) break;
    used += Math.max(...pair.map((card) => card.h)) + 12;
  }
  return used;
}

function drawMap(ctx: SKRSContext2D, root: MindNode, color: string, accent: string, x: number, y: number, w: number, ar: boolean): number {
  const title = bookletSafe(ar ? "ar" : "en", ar ? root.labelAr : root.labelEn);
  ctx.font = `14px ${FONT_NAME}`;
  const titleLines = wrapFit(ctx, title, w - 24, 2);
  const titleH = Math.max(32, titleLines.length * 18 + 12);
  roundRect(ctx, x, y, w, titleH, 10, color);
  ctx.fillStyle = "#ffffff";
  titleLines.forEach((line, index) => {
    paintText(ctx, line, x + w / 2, y + 6 + index * 18, "center");
  });
  const gap = 12;
  const colW = (w - gap) / 2;
  const cards = root.children.slice(0, 4).map((branch) => mapCard(ctx, branch, colW, ar));
  let used = titleH + 12;
  for (let row = 0; row < 2; row += 1) {
    const pair = cards.slice(row * 2, row * 2 + 2);
    if (!pair.length) break;
    const rowH = Math.max(...pair.map((card) => card.h));
    pair.forEach((card, col) => {
      const bx = ar ? x + w - (col + 1) * colW - col * gap : x + col * (colW + gap);
      const by = y + used;
      roundRect(ctx, bx, by, colW, rowH, 12, fade(color, 0.08));
      ctx.fillStyle = color;
      ctx.font = `12px ${FONT_NAME}`;
      card.titleLines.forEach((line, lineIndex) => {
        paintClipped(
          ctx,
          line,
          ar ? bx + colW - 10 : bx + 10,
          by + 8 + lineIndex * 15,
          colW - 20,
          ar ? "right" : "left",
        );
      });
      const leafTop = by + 10 + card.titleLines.length * 15 + 6;
      card.leaves.forEach((leaf, leafIndex) => {
        const ly = leafTop + leafIndex * 20;
        roundRect(ctx, bx + 8, ly, colW - 16, 17, 7, accent);
        ctx.fillStyle = "#071c45";
        ctx.font = `11px ${FONT_NAME}`;
        paintClipped(
          ctx,
          wrapFit(ctx, leaf.label, colW - 28, 1)[0] ?? leaf.label,
          ar ? bx + colW - 16 : bx + 14,
          ly + 2,
          colW - 28,
          ar ? "right" : "left",
        );
      });
    });
    used += rowH + gap;
  }
  return used;
}

function bannerSize(ctx: SKRSContext2D, text: string, w: number) {
  ctx.font = `20px ${FONT_NAME}`;
  const lines = wrap(ctx, text, w - 32);
  const h = Math.max(46, lines.length * 24 + 18);
  return { lines, h, gap: h + 14 };
}

function sectionSize(ctx: SKRSContext2D, text: string, w: number) {
  ctx.font = `15px ${FONT_NAME}`;
  const lines = wrap(ctx, text, w - 28);
  const h = Math.max(32, lines.length * 18 + 14);
  return { lines, h, gap: h + 12 };
}

function drawBanner(ctx: SKRSContext2D, text: string, color: string, x: number, y: number, w: number, ar: boolean): number {
  const { lines, h, gap } = bannerSize(ctx, text, w);
  roundRect(ctx, x, y, w, h, 8, color);
  ctx.fillStyle = "#ffffff";
  ctx.font = `20px ${FONT_NAME}`;
  lines.forEach((line, index) => {
    paintText(ctx, line, ar ? x + w - 16 : x + 16, y + 10 + index * 24, ar ? "right" : "left");
  });
  return gap;
}

function drawSection(ctx: SKRSContext2D, text: string, x: number, y: number, w: number, ar: boolean): number {
  const { lines, h, gap } = sectionSize(ctx, text, w);
  roundRect(ctx, x, y, w, h, 6, "#0c2d6b");
  ctx.fillStyle = "#ffffff";
  ctx.font = `15px ${FONT_NAME}`;
  lines.forEach((line, index) => {
    paintText(ctx, line, ar ? x + w - 14 : x + 14, y + 8 + index * 18, ar ? "right" : "left");
  });
  return gap;
}

function questionLines(ctx: SKRSContext2D, block: QuestionBlock, w: number) {
  const pad = 14;
  const inner = w - pad * 2;
  ctx.font = `15px ${FONT_NAME}`;
  const promptLines = wrap(ctx, `${block.n}. ${block.prompt}`, inner);
  ctx.font = `14px ${FONT_NAME}`;
  const optionLines = block.options.slice(0, 4).map((option, optionIndex) =>
    wrap(ctx, `${block.letters[optionIndex] ?? LETTERS[optionIndex]}  ${option}`, inner - 26),
  );
  const optionsH = optionLines.reduce((sum, lines) => sum + lines.length * 20 + 10, 0);
  return { pad, promptLines, optionLines, h: pad + promptLines.length * 22 + 12 + optionsH + pad };
}

function drawQuestionCard(
  ctx: SKRSContext2D,
  block: QuestionBlock,
  x: number,
  y: number,
  w: number,
  ar: boolean,
): number {
  const { pad, promptLines, optionLines, h } = questionLines(ctx, block, w);
  roundRect(ctx, x, y, w, h, 12, "#f4f7fb");
  ctx.strokeStyle = "#d5deea";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#111827";
  ctx.font = `15px ${FONT_NAME}`;
  promptLines.forEach((line, index) => {
    paintText(ctx, line, ar ? x + w - pad : x + pad, y + pad + index * 22, ar ? "right" : "left");
  });
  let oy = y + pad + promptLines.length * 22 + 10;
  optionLines.forEach((lines) => {
    ctx.beginPath();
    ctx.strokeStyle = "#0c2d6b";
    ctx.lineWidth = 1.8;
    ctx.arc(ar ? x + w - pad - 8 : x + pad + 8, oy + 9, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#111827";
    ctx.font = `14px ${FONT_NAME}`;
    lines.forEach((line, lineIndex) => {
      paintText(
        ctx,
        line,
        ar ? x + w - pad - 26 : x + pad + 26,
        oy + lineIndex * 20,
        ar ? "right" : "left",
      );
    });
    oy += lines.length * 20 + 10;
  });
  return h + 14;
}

function essayHeight(ctx: SKRSContext2D, block: EssayBlock, w: number): number {
  const pad = 14;
  ctx.font = `15px ${FONT_NAME}`;
  return pad + wrap(ctx, `${block.n}) ${block.prompt}`, w - pad * 2).length * 22 + 76;
}

function drawEssayCard(ctx: SKRSContext2D, block: EssayBlock, x: number, y: number, w: number, ar: boolean): number {
  const pad = 14;
  ctx.font = `15px ${FONT_NAME}`;
  const lines = wrap(ctx, `${block.n}) ${block.prompt}`, w - pad * 2);
  const h = essayHeight(ctx, block, w);
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
  ctx.fillStyle = "#111827";
  lines.forEach((line, index) => {
    paintText(ctx, line, ar ? x + w - pad : x + pad, y + pad + index * 22, ar ? "right" : "left");
  });
  for (let i = 0; i < 3; i += 1) {
    const ly = y + pad + lines.length * 20 + 18 + i * 16;
    ctx.strokeStyle = "#d5deea";
    ctx.beginPath();
    ctx.moveTo(x + pad, ly);
    ctx.lineTo(x + w - pad, ly);
    ctx.stroke();
  }
  return h + 14;
}

function drawAsk(ctx: SKRSContext2D, text: string, x: number, y: number, w: number, ar: boolean): number {
  ctx.font = `15px ${FONT_NAME}`;
  const lines = wrap(ctx, text, w - 40);
  const h = lines.length * 22 + 20;
  roundRect(ctx, x, y, w, h, 4, "#fff4cc");
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 1.6;
  ctx.stroke();
  const icon = ar ? x + w - 22 : x + 18;
  fillCircle(ctx, icon, y + 18, 10, "#b45309");
  ctx.fillStyle = "#fff7ed";
  ctx.font = `16px ${FONT_NAME}`;
  paintText(ctx, "?", icon, y + 10, "center");
  ctx.fillStyle = "#111827";
  lines.forEach((line, index) => {
    paintText(ctx, line, ar ? x + w - 40 : x + 36, y + 10 + index * 22, ar ? "right" : "left");
  });
  return h + 14;
}

function fillCircle(ctx: SKRSContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

function strokeLine(
  ctx: SKRSContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function artLabel(ctx: SKRSContext2D, text: string, x: number, y: number, align: "left" | "right" | "center") {
  ctx.fillStyle = "#111827";
  ctx.font = `11px ${FONT_NAME}`;
  paintText(ctx, text, x, y, align);
}

function drawLessonArt(
  ctx: SKRSContext2D,
  art: string,
  x: number,
  y: number,
  w: number,
  h: number,
  ar = true,
) {
  ctx.fillStyle = "#e8eef6";
  ctx.fillRect(x, y, w, h);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const wide = w >= 90;

  if (art === "lock") {
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(x + w * 0.32, y + h * 0.48, w * 0.36, h * 0.32);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = Math.max(3, w * 0.05);
    ctx.beginPath();
    ctx.arc(cx, y + h * 0.46, w * 0.12, Math.PI, 0);
    ctx.stroke();
    fillCircle(ctx, cx, y + h * 0.62, Math.max(3, w * 0.04), "#fde68a");
    return;
  }
  if (art === "firewall") {
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(x + 8, y + 12, w * 0.28, h * 0.22);
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(x + w * 0.72 - 8, y + 12, w * 0.28, h * 0.22);
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + 12, y + h * 0.48, w - 24, h * 0.28);
    strokeLine(ctx, x + w * 0.22, y + h * 0.34, x + w * 0.22, y + h * 0.48, "#334155", 3);
    strokeLine(ctx, x + w * 0.78, y + h * 0.34, x + w * 0.78, y + h * 0.48, "#334155", 3);
    return;
  }
  if (art === "nest") {
    const rings = ar
      ? ["ذكاء اصطناعي", "تعلم آلي", "عميق", "توليدي"]
      : ["AI", "ML", "Deep", "Gen"];
    const colors = ["#0c2d6b", "#1d4ed8", "#3b82f6", "#c4a35a"];
    rings.forEach((label, index) => {
      const top = y + 6 + index * ((h - 12) / 4);
      const inset = 6 + index * 8;
      roundRect(ctx, x + inset, top, w - inset * 2, (h - 16) / 4 - 3, 7, colors[index]!);
      if (wide) {
        ctx.fillStyle = index === 3 ? "#111827" : "#ffffff";
        ctx.font = `11px ${FONT_NAME}`;
        paintText(ctx, label, cx, top + 4, "center");
      }
    });
    return;
  }
  if (art === "ai") {
    roundRect(ctx, cx - w * 0.16, y + h * 0.18, w * 0.32, h * 0.36, 10, "#0c2d6b");
    fillCircle(ctx, cx - w * 0.06, y + h * 0.34, Math.max(3, w * 0.035), "#fde68a");
    fillCircle(ctx, cx + w * 0.06, y + h * 0.34, Math.max(3, w * 0.035), "#fde68a");
    roundRect(ctx, cx - w * 0.22, y + h * 0.6, w * 0.44, h * 0.22, 8, "#1d4ed8");
    return;
  }
  if (art === "web" || art === "http" || art === "html") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 8, y + 10, w - 16, h - 20);
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + 8, y + 10, w - 16, 16);
    fillCircle(ctx, x + 18, y + 18, 3, "#f87171");
    fillCircle(ctx, x + 28, y + 18, 3, "#fbbf24");
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(x + 16, y + 36, w * 0.5, 8);
    ctx.fillRect(x + 16, y + 50, w * 0.68, 6);
    ctx.fillRect(x + 16, y + 62, w * 0.4, 6);
    return;
  }
  if (art === "arvr") {
    roundRect(ctx, x + 8, y + h * 0.28, w * 0.4, h * 0.44, 10, "#111827");
    roundRect(ctx, x + w * 0.14, y + h * 0.36, w * 0.1, h * 0.2, 4, "#60a5fa");
    roundRect(ctx, x + w * 0.28, y + h * 0.36, w * 0.1, h * 0.2, 4, "#60a5fa");
    roundRect(ctx, x + w * 0.58, y + h * 0.22, w * 0.34, h * 0.58, 10, "#0c2d6b");
    roundRect(ctx, x + w * 0.64, y + h * 0.3, w * 0.22, h * 0.32, 6, "#93c5fd");
    return;
  }
  if (art === "edge") {
    roundRect(ctx, x + 8, y + h * 0.48, w * 0.42, h * 0.28, 8, "#0c2d6b");
    fillCircle(ctx, x + w * 0.16, y + h * 0.8, Math.max(4, w * 0.05), "#111827");
    fillCircle(ctx, x + w * 0.36, y + h * 0.8, Math.max(4, w * 0.05), "#111827");
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.ellipse(x + w * 0.78, y + h * 0.3, w * 0.14, h * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    strokeLine(ctx, x + w * 0.52, y + h * 0.48, x + w * 0.68, y + h * 0.36, "#cbd5e1", 3);
    strokeLine(ctx, x + w * 0.72, y + h * 0.2, x + w * 0.86, y + h * 0.4, "#7f1d1d", 4);
    strokeLine(ctx, x + w * 0.86, y + h * 0.2, x + w * 0.72, y + h * 0.4, "#7f1d1d", 4);
    return;
  }
  if (art === "cloud") {
    ctx.fillStyle = "#0c2d6b";
    ctx.beginPath();
    ctx.ellipse(cx, y + h * 0.52, w * 0.28, h * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.32, y + h * 0.54, w * 0.14, h * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.68, y + h * 0.54, w * 0.13, h * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (art === "ux") {
    [0.12, 0.34, 0.56, 0.78].forEach((px, index) => {
      const heights = [0.36, 0.48, 0.58, 0.36];
      roundRect(ctx, x + w * px, y + h * (0.72 - heights[index]!), w * 0.16, h * heights[index]!, 6, ["#0c2d6b", "#1d4ed8", "#3b82f6", "#c4a35a"][index]!);
    });
    return;
  }
  if (art === "chart") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 8, y + 8, w - 16, h - 16);
    const base = y + h - 22;
    const bars = [
      [0.18, 0.28, "#0c2d6b"],
      [0.38, 0.45, "#1d4ed8"],
      [0.58, 0.62, "#c4a35a"],
      [0.78, 0.38, "#0c2d6b"],
    ] as const;
    bars.forEach(([px, ph, color]) => {
      ctx.fillStyle = color;
      ctx.fillRect(x + w * px, base - h * ph, w * 0.1, h * ph);
    });
    strokeLine(ctx, x + 16, base, x + w - 16, base, "#94a3b8", 2);
    return;
  }
  if (art === "regress") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 8, y + 8, w - 16, h - 16);
    strokeLine(ctx, x + 16, y + h - 20, x + w - 16, y + h - 20, "#111827", 2);
    strokeLine(ctx, x + 16, y + h - 20, x + 16, y + 16, "#111827", 2);
    strokeLine(ctx, x + 22, y + h - 28, x + w - 22, y + 28, "#1d4ed8", 3);
    [
      [0.28, 0.68],
      [0.44, 0.55],
      [0.6, 0.42],
      [0.76, 0.32],
    ].forEach(([px, py]) => fillCircle(ctx, x + w * px, y + h * py, 4, "#0c2d6b"));
    return;
  }
  if (art === "data") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 10, y + 12, w - 20, h - 24);
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + 10, y + 12, w - 20, 16);
    strokeLine(ctx, x + w * 0.38, y + 12, x + w * 0.38, y + h - 12, "#93c5fd", 2);
    strokeLine(ctx, x + 10, y + h * 0.5, x + w - 10, y + h * 0.5, "#cbd5e1", 2);
    return;
  }
  if (art === "clean") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 8, y + 14, w * 0.55, h - 28);
    ctx.strokeStyle = "#0c2d6b";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 8, y + 14, w * 0.55, h - 28);
    fillCircle(ctx, x + w * 0.78, cy, Math.max(8, w * 0.1), "#16a34a");
    return;
  }
  if (art === "sample") {
    fillCircle(ctx, x + w * 0.28, y + h * 0.32, 7, "#94a3b8");
    fillCircle(ctx, cx, y + h * 0.28, 7, "#0c2d6b");
    fillCircle(ctx, x + w * 0.72, y + h * 0.32, 7, "#94a3b8");
    fillCircle(ctx, x + w * 0.22, y + h * 0.7, 7, "#94a3b8");
    fillCircle(ctx, cx, y + h * 0.66, 9, "#c4a35a");
    fillCircle(ctx, x + w * 0.78, y + h * 0.7, 7, "#94a3b8");
    return;
  }
  if (art === "api") {
    roundRect(ctx, x + 8, y + h * 0.3, w * 0.24, h * 0.4, 6, "#0c2d6b");
    roundRect(ctx, x + w * 0.38, y + h * 0.22, w * 0.24, h * 0.56, 6, "#111827");
    roundRect(ctx, x + w * 0.68, y + h * 0.3, w * 0.24, h * 0.4, 6, "#c4a35a");
    return;
  }
  if (art === "neural") {
    const left = [
      [x + w * 0.18, y + h * 0.28],
      [x + w * 0.18, y + h * 0.72],
    ] as const;
    const mid = [
      [x + w * 0.5, y + h * 0.22],
      [x + w * 0.5, y + h * 0.5],
      [x + w * 0.5, y + h * 0.78],
    ] as const;
    const right = [[x + w * 0.82, y + h * 0.5]] as const;
    left.forEach(([lx, ly]) => {
      mid.forEach(([mx, my]) => strokeLine(ctx, lx, ly, mx, my, "#94a3b8", 2));
    });
    mid.forEach(([mx, my]) => strokeLine(ctx, mx, my, right[0][0], right[0][1], "#94a3b8", 2));
    left.forEach(([lx, ly]) => fillCircle(ctx, lx, ly, Math.max(4, w * 0.045), "#0c2d6b"));
    mid.forEach(([mx, my]) => fillCircle(ctx, mx, my, Math.max(4, w * 0.045), "#1d4ed8"));
    fillCircle(ctx, right[0][0], right[0][1], Math.max(5, w * 0.05), "#c4a35a");
    return;
  }
  if (art === "ml") {
    roundRect(ctx, x + 8, y + h * 0.28, w * 0.24, h * 0.48, 6, "#0c2d6b");
    roundRect(ctx, x + w * 0.38, y + h * 0.18, w * 0.24, h * 0.64, 6, "#1d4ed8");
    roundRect(ctx, x + w * 0.68, y + h * 0.3, w * 0.24, h * 0.4, 6, "#c4a35a");
    return;
  }
  if (art === "llm") {
    roundRect(ctx, x + 8, y + 12, w * 0.46, h * 0.38, 8, "#0c2d6b");
    roundRect(ctx, x + w * 0.42, y + h * 0.52, w * 0.46, h * 0.3, 8, "#c4a35a");
    fillCircle(ctx, x + w * 0.78, y + h * 0.28, Math.max(6, w * 0.08), "#f59e0b");
    return;
  }
  if (art === "glass") {
    ctx.strokeStyle = "#0c2d6b";
    ctx.lineWidth = Math.max(4, w * 0.06);
    ctx.beginPath();
    ctx.ellipse(cx, cy, w * 0.22, h * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
    fillCircle(ctx, cx, cy, Math.max(5, w * 0.07), "#93c5fd");
    return;
  }
  if (art === "account") {
    fillCircle(ctx, x + w * 0.32, y + h * 0.32, Math.max(8, w * 0.08), "#0c2d6b");
    roundRect(ctx, x + w * 0.2, y + h * 0.42, w * 0.24, h * 0.32, 8, "#0c2d6b");
    roundRect(ctx, x + w * 0.54, y + h * 0.3, w * 0.32, h * 0.4, 8, "#c4a35a");
    return;
  }
  if (art === "ethics") {
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(cx - 4, y + 12, 8, h - 24);
    ctx.fillStyle = "#111827";
    ctx.fillRect(x + 14, cy - 4, w - 28, 8);
    ctx.fillStyle = "#c4a35a";
    ctx.fillRect(x + 14, y + 22, w * 0.22, h * 0.22);
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(x + w - 14 - w * 0.22, y + 22, w * 0.22, h * 0.22);
    return;
  }
  if (art === "asymmetric") {
    ctx.fillStyle = "#c4a35a";
    ctx.fillRect(x + w * 0.12, y + h * 0.46, w * 0.3, h * 0.28);
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(x + w * 0.58, y + h * 0.46, w * 0.3, h * 0.28);
    ctx.strokeStyle = "#0c2d6b";
    ctx.lineWidth = Math.max(3, w * 0.04);
    ctx.beginPath();
    ctx.arc(x + w * 0.27, y + h * 0.46, w * 0.08, Math.PI, 0);
    ctx.stroke();
    ctx.strokeStyle = "#7f1d1d";
    ctx.beginPath();
    ctx.arc(x + w * 0.73, y + h * 0.46, w * 0.08, Math.PI, 0);
    ctx.stroke();
    return;
  }
  if (art === "cert") {
    roundRect(ctx, x + w * 0.22, y + 10, w * 0.56, h - 20, 8, "#ffffff");
    ctx.strokeStyle = "#0c2d6b";
    ctx.lineWidth = 3;
    ctx.strokeRect(x + w * 0.22, y + 10, w * 0.56, h - 20);
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + w * 0.3, y + h * 0.22, w * 0.4, 6);
    fillCircle(ctx, cx, y + h * 0.68, Math.max(7, w * 0.08), "#c4a35a");
    return;
  }
  if (art === "preserve") {
    roundRect(ctx, x + 10, y + 12, w - 20, h - 24, 8, "#0c2d6b");
    ctx.fillStyle = "#c4a35a";
    ctx.fillRect(x + 18, y + h * 0.28, w * 0.4, 8);
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(x + w * 0.62, y + h * 0.42, w * 0.22, h * 0.32);
    return;
  }
  if (art === "mask") {
    fillCircle(ctx, x + w * 0.32, y + h * 0.38, Math.max(10, w * 0.12), "#0c2d6b");
    roundRect(ctx, x + w * 0.2, y + h * 0.58, w * 0.24, h * 0.22, 6, "#1d4ed8");
    roundRect(ctx, x + w * 0.52, y + h * 0.22, w * 0.36, h * 0.52, 8, "#ffffff");
    ctx.strokeStyle = "#7f1d1d";
    ctx.lineWidth = Math.max(2, w * 0.03);
    ctx.strokeRect(x + w * 0.52, y + h * 0.22, w * 0.36, h * 0.52);
    ctx.beginPath();
    ctx.moveTo(x + w * 0.78, y + h * 0.26);
    ctx.lineTo(x + w * 0.86, y + h * 0.38);
    ctx.moveTo(x + w * 0.86, y + h * 0.26);
    ctx.lineTo(x + w * 0.78, y + h * 0.38);
    ctx.stroke();
    return;
  }
  if (art === "incident" || art === "phish" || art === "fake") {
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.moveTo(cx, y + 10);
    ctx.lineTo(x + w - 12, y + h - 12);
    ctx.lineTo(x + 12, y + h - 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#111827";
    ctx.fillRect(cx - 4, y + h * 0.38, 8, h * 0.28);
    fillCircle(ctx, cx, y + h * 0.78, 5, "#111827");
    return;
  }
  if (art === "life") {
    roundRect(ctx, x + 10, y + 14, w * 0.28, h * 0.28, 6, "#0c2d6b");
    roundRect(ctx, x + w * 0.36, y + 14, w * 0.28, h * 0.28, 6, "#1d4ed8");
    roundRect(ctx, x + w * 0.62, y + 14, w * 0.28, h * 0.28, 6, "#c4a35a");
    if (wide) {
      artLabel(ctx, ar ? "فيديو" : "Video", x + 10 + w * 0.14, y + 22, "center");
      artLabel(ctx, ar ? "مصنع" : "Factory", x + w * 0.5, y + 22, "center");
      artLabel(ctx, ar ? "كتاب" : "Book", x + w * 0.76, y + 22, "center");
    }
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + 16, y + h * 0.56, w - 32, h * 0.28);
    return;
  }
  if (art === "media") {
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + 12, y + 16, w * 0.36, h * 0.36);
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath();
    ctx.moveTo(x + w * 0.22, y + 28);
    ctx.lineTo(x + w * 0.38, y + 34);
    ctx.lineTo(x + w * 0.22, y + 40);
    ctx.fill();
    ctx.fillStyle = "#c4a35a";
    ctx.fillRect(x + w * 0.56, y + 18, w * 0.32, 10);
    ctx.fillRect(x + w * 0.56, y + 34, w * 0.24, 8);
    return;
  }
  if (art === "hash") {
    roundRect(ctx, x + 10, y + 12, w - 20, h - 24, 8, "#111827");
    ctx.fillStyle = "#fde68a";
    ctx.font = `${Math.max(16, w * 0.28)}px ${FONT_NAME}`;
    paintText(ctx, "#", cx, cy - 10, "center");
    return;
  }
  if (art === "mfa") {
    roundRect(ctx, x + 8, y + 16, w * 0.32, h * 0.64, 8, "#0c2d6b");
    [0.18, 0.4, 0.62].forEach((py, index) => {
      roundRect(ctx, x + w * 0.48, y + h * py, w * 0.42, h * 0.16, 5, ["#1d4ed8", "#c4a35a", "#16a34a"][index]!);
    });
    return;
  }
  if (art === "auth") {
    fillCircle(ctx, x + w * 0.32, y + h * 0.36, Math.max(8, w * 0.1), "#0c2d6b");
    roundRect(ctx, x + w * 0.2, y + h * 0.5, w * 0.24, h * 0.28, 8, "#1d4ed8");
    roundRect(ctx, x + w * 0.56, y + h * 0.32, w * 0.3, h * 0.36, 8, "#16a34a");
    return;
  }
  if (art === "vpn") {
    roundRect(ctx, x + 8, y + h * 0.32, w * 0.28, h * 0.36, 8, "#0c2d6b");
    roundRect(ctx, x + w * 0.64, y + h * 0.32, w * 0.28, h * 0.36, 8, "#1d4ed8");
    roundRect(ctx, x + w * 0.34, y + h * 0.42, w * 0.32, h * 0.16, 6, "#c4a35a");
    return;
  }
  if (art === "css") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 8, y + 10, w - 16, h - 20);
    ctx.fillStyle = "#7c3aed";
    ctx.fillRect(x + 8, y + 10, w - 16, 16);
    ctx.fillRect(x + w * 0.62, y + h * 0.42, w * 0.22, h * 0.28);
    return;
  }
  if (art === "js") {
    roundRect(ctx, x + 12, y + 12, w - 24, h - 24, 10, "#f59e0b");
    return;
  }
  if (art === "https") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 8, y + 10, w - 16, h - 20);
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(x + 8, y + 10, w - 16, 16);
    roundRect(ctx, x + 14, y + h * 0.42, w * 0.16, h * 0.32, 5, "#166534");
    return;
  }
  if (art === "symmetric") {
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + w * 0.12, y + h * 0.48, w * 0.28, h * 0.28);
    ctx.fillRect(x + w * 0.6, y + h * 0.48, w * 0.28, h * 0.28);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = Math.max(3, w * 0.04);
    ctx.beginPath();
    ctx.arc(x + w * 0.26, y + h * 0.48, w * 0.08, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + w * 0.74, y + h * 0.48, w * 0.08, Math.PI, 0);
    ctx.stroke();
    return;
  }
  if (art === "note") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 10, y + 10, w - 20, h - 20);
    ctx.strokeStyle = "#0c2d6b";
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + 16, y + 18, w * 0.5, 6);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(x + 16, y + 32, w * 0.42, 5);
    return;
  }
  const stampColors = ["#0c2d6b", "#1d4ed8", "#7f1d1d", "#c4a35a", "#0f766e", "#7c3aed", "#b45309", "#334155"];
  let hash = 2166136261;
  for (let index = 0; index < art.length; index += 1) {
    hash = Math.imul(hash ^ art.charCodeAt(index), 16777619);
  }
  const color = stampColors[(hash >>> 0) % stampColors.length]!;
  const shape = (hash >>> 0) % 4;
  if (shape === 0) {
    fillCircle(ctx, cx, cy, Math.max(10, w * 0.22), color);
    return;
  }
  if (shape === 1) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, y + 10);
    ctx.lineTo(x + w - 10, y + h - 12);
    ctx.lineTo(x + 10, y + h - 12);
    ctx.closePath();
    ctx.fill();
    return;
  }
  if (shape === 2) {
    roundRect(ctx, x + 10, y + h * 0.28, w * 0.24, h * 0.48, 6, color);
    roundRect(ctx, x + w * 0.38, y + h * 0.18, w * 0.24, h * 0.64, 6, "#1d4ed8");
    roundRect(ctx, x + w * 0.66, y + h * 0.3, w * 0.24, h * 0.4, 6, "#c4a35a");
    return;
  }
  ctx.fillStyle = color;
  ctx.fillRect(x + w * 0.28, y + h * 0.48, w * 0.44, h * 0.3);
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = Math.max(3, w * 0.05);
  ctx.beginPath();
  ctx.arc(cx, y + h * 0.48, w * 0.14, Math.PI, 0);
  ctx.stroke();
}

function drawTermIcon(ctx: SKRSContext2D, art: string, x: number, y: number, size: number, color: string, ar = true) {
  roundRect(ctx, x, y, size, size, 10, fade(color, 0.14));
  drawLessonArt(ctx, art, x + 6, y + 6, size - 12, size - 12, ar);
}

function drawTerms(
  ctx: SKRSContext2D,
  block: TermsBlock,
  x: number,
  y: number,
  w: number,
  ar: boolean,
  from: number,
  limit: number,
): { h: number; next: number } {
  const gap = 10;
  const colW = (w - gap) / 2;
  const icon = 52;
  let used = 0;
  let index = from;
  let col = 0;
  let rowH = 0;
  while (index < block.items.length && index < from + limit) {
    const item = block.items[index]!;
    ctx.font = `14px ${FONT_NAME}`;
    const meaningLines = wrap(ctx, item.meaning, colW - icon - 20);
    const h = Math.max(68, 18 + meaningLines.length * 18 + 16);
    const cx = x + (ar ? (col === 0 ? colW + gap : 0) : col * (colW + gap));
    const cy = y + used;
    roundRect(ctx, cx, cy, colW, h, 12, "#f4f7fb");
    ctx.strokeStyle = "#d5deea";
    ctx.strokeRect(cx, cy, colW, h);
    drawTermIcon(ctx, item.art, ar ? cx + colW - 10 - icon : cx + 10, cy + 8, icon, block.color, ar);
    const textX = ar ? cx + colW - icon - 18 : cx + icon + 18;
    ctx.fillStyle = block.color;
    ctx.font = `15px ${FONT_NAME}`;
    paintText(ctx, item.term, textX, cy + 8, ar ? "right" : "left");
    ctx.fillStyle = "#111827";
    ctx.font = `14px ${FONT_NAME}`;
    meaningLines.forEach((line, lineIndex) => {
      paintText(ctx, line, textX, cy + 30 + lineIndex * 18, ar ? "right" : "left");
    });
    rowH = Math.max(rowH, h);
    col += 1;
    index += 1;
    if (col === 2 || index === block.items.length || index === from + limit) {
      used += rowH + gap;
      col = 0;
      rowH = 0;
    }
  }
  return { h: used, next: index };
}

async function drawPhoto(
  ctx: SKRSContext2D,
  block: PhotoBlock,
  x: number,
  y: number,
  w: number,
  ar: boolean,
  images: Map<string, Image>,
): Promise<number> {
  const imgH = Math.round(w * 0.78);
  ctx.fillStyle = "#f4f7fb";
  ctx.fillRect(x, y, w, imgH);
  ctx.strokeStyle = "#d5deea";
  ctx.strokeRect(x, y, w, imgH);
  if (block.src && images.has(block.src)) {
    const image = images.get(block.src)!;
    const scale = Math.min(w / image.width, imgH / image.height);
    const dw = image.width * scale;
    const dh = image.height * scale;
    ctx.drawImage(image, x + (w - dw) / 2, y + (imgH - dh) / 2, dw, dh);
  } else {
    drawLessonArt(ctx, block.art, x + 24, y + 16, w - 48, imgH - 32, ar);
  }
  ctx.fillStyle = "#0c2d6b";
  ctx.font = `16px ${FONT_NAME}`;
  paintText(ctx, `1  ${block.title}`, ar ? x + w : x, y + imgH + 10, ar ? "right" : "left");
  ctx.fillStyle = "#111827";
  ctx.font = `14px ${FONT_NAME}`;
  const introLines = wrap(ctx, block.intro, w);
  introLines.forEach((line, index) => {
    paintText(ctx, line, ar ? x + w : x, y + imgH + 34 + index * 20, ar ? "right" : "left");
  });
  return imgH + 34 + introLines.length * 20 + 16;
}

function photoHeight(ctx: SKRSContext2D, block: PhotoBlock, w: number): number {
  ctx.font = `14px ${FONT_NAME}`;
  return Math.round(w * 0.78) + 34 + wrap(ctx, block.intro, w).length * 20 + 16;
}

function colWidths(count: number, w: number): number[] {
  if (count <= 2) return [w * 0.3, w * 0.7];
  return [w * 0.22, w * 0.4, w * 0.38];
}

function tableRowHeight(ctx: SKRSContext2D, cells: string[], widths: number[]): number {
  ctx.font = `14px ${FONT_NAME}`;
  const lines = cells.map((cell, index) => wrap(ctx, cell, (widths[index] ?? widths[0]!) - 14).length);
  return Math.max(36, Math.max(...lines) * 19 + 14);
}

function drawTable(
  ctx: SKRSContext2D,
  block: TableBlock,
  x: number,
  y: number,
  w: number,
  ar: boolean,
  drawHeader: boolean,
  from: number,
  limit: number,
): { h: number; next: number } {
  const widths = colWidths(block.headers.length, w);
  let used = 0;
  if (drawHeader) {
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x, y, w, 30);
    ctx.fillStyle = "#ffffff";
    ctx.font = `14px ${FONT_NAME}`;
    let ox = 0;
    const order = ar ? block.headers.map((_, i) => i).reverse() : block.headers.map((_, i) => i);
    const wOrder = ar ? [...widths].reverse() : widths;
    order.forEach((headerIndex, visual) => {
      const cx = x + ox;
      const cw = wOrder[visual]!;
      paintText(ctx, block.headers[headerIndex]!, ar ? cx + cw - 7 : cx + 7, y + 8, ar ? "right" : "left");
      ox += cw;
    });
    used += 30;
  }
  let index = from;
  while (index < block.rows.length && index < from + limit) {
    const row = block.rows[index]!;
    const rh = tableRowHeight(ctx, row.cells, widths);
    const rowY = y + used;
    ctx.fillStyle = index % 2 ? "#f4f7fb" : "#ffffff";
    ctx.fillRect(x, rowY, w, rh);
    let ox = 0;
    const cells = ar ? [...row.cells].reverse() : row.cells;
    const wOrder = ar ? [...widths].reverse() : widths;
    cells.forEach((cell, visual) => {
      const cx = x + ox;
      const cw = wOrder[visual]!;
      ctx.strokeStyle = "#c5d0de";
      ctx.strokeRect(cx, rowY, cw, rh);
      ctx.fillStyle = "#111827";
      ctx.font = `14px ${FONT_NAME}`;
      wrap(ctx, cell, cw - 14).forEach((line, lineIndex) => {
        paintText(ctx, line, ar ? cx + cw - 7 : cx + 7, rowY + 8 + lineIndex * 19, ar ? "right" : "left");
      });
      ox += cw;
    });
    used += rh;
    if (row.example) {
      ctx.font = `14px ${FONT_NAME}`;
      const exampleLines = wrap(ctx, row.example, w - 16);
      const eh = exampleLines.length * 19 + 14;
      ctx.fillStyle = "#fff4cc";
      ctx.fillRect(x, y + used, w, eh);
      ctx.strokeStyle = "#d4a017";
      ctx.strokeRect(x, y + used, w, eh);
      ctx.fillStyle = "#111827";
      exampleLines.forEach((line, lineIndex) => {
        paintText(ctx, line, ar ? x + w - 8 : x + 8, y + used + 7 + lineIndex * 19, ar ? "right" : "left");
      });
      used += eh;
    }
    index += 1;
  }
  return { h: used + 8, next: index };
}

function drawExplain(
  ctx: SKRSContext2D,
  block: ExplainBlock,
  x: number,
  y: number,
  w: number,
  ar: boolean,
): number {
  const icon = 52;
  ctx.font = `14px ${FONT_NAME}`;
  const bodyLines = wrap(ctx, block.body, w - icon - 28);
  const exampleLines = block.example ? wrap(ctx, `${ar ? "مثال:" : "Example:"} ${block.example}`, w - 20) : [];
  const h = Math.max(72, 28 + bodyLines.length * 18 + (exampleLines.length ? exampleLines.length * 18 + 22 : 8));
  roundRect(ctx, x, y, w, h, 10, "#eef3fb");
  ctx.strokeStyle = "#d5deea";
  ctx.strokeRect(x, y, w, h);
  drawTermIcon(ctx, block.art, ar ? x + w - 10 - icon : x + 10, y + 10, icon, block.color, ar);
  const textX = ar ? x + w - icon - 20 : x + icon + 20;
  ctx.fillStyle = block.color;
  ctx.font = `15px ${FONT_NAME}`;
  paintText(ctx, block.title, textX, y + 10, ar ? "right" : "left");
  ctx.fillStyle = "#111827";
  ctx.font = `14px ${FONT_NAME}`;
  bodyLines.forEach((line, index) => {
    paintText(ctx, line, textX, y + 32 + index * 18, ar ? "right" : "left");
  });
  if (exampleLines.length) {
    const ey = y + 36 + bodyLines.length * 18;
    ctx.fillStyle = "#fff4cc";
    ctx.fillRect(x + 8, ey, w - 16, exampleLines.length * 18 + 12);
    ctx.strokeStyle = "#d4a017";
    ctx.strokeRect(x + 8, ey, w - 16, exampleLines.length * 18 + 12);
    ctx.fillStyle = "#111827";
    exampleLines.forEach((line, index) => {
      paintText(ctx, line, ar ? x + w - 16 : x + 16, ey + 6 + index * 18, ar ? "right" : "left");
    });
  }
  return h + 10;
}

function drawPoints(ctx: SKRSContext2D, items: string[], x: number, y: number, w: number, ar: boolean): number {
  ctx.font = `14px ${FONT_NAME}`;
  let used = 0;
  items.forEach((item, index) => {
    const lines = wrap(ctx, `${index + 1}. ${item}`, w - 8);
    ctx.fillStyle = "#111827";
    lines.forEach((line, lineIndex) => {
      paintText(ctx, line, ar ? x + w : x, y + used + lineIndex * 20, ar ? "right" : "left");
    });
    used += lines.length * 20 + 8;
  });
  return used + 10;
}

function drawTakeaway(ctx: SKRSContext2D, text: string, x: number, y: number, w: number, ar: boolean): number {
  ctx.font = `14px ${FONT_NAME}`;
  const lines = wrap(ctx, text, w - 20);
  const h = lines.length * 20 + 20;
  roundRect(ctx, x, y, w, h, 4, "#fff4cc");
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#111827";
  lines.forEach((line, index) => {
    paintText(ctx, line, ar ? x + w - 10 : x + 10, y + 10 + index * 20, ar ? "right" : "left");
  });
  return h + 14;
}

function sceneCardHeight(ctx: SKRSContext2D, scene: string, cardW: number): number {
  ctx.font = `12px ${FONT_NAME}`;
  const lines = wrap(ctx, scene, cardW - 16);
  return 126 + 22 + lines.length * 15 + 16;
}

function drawSceneCard(
  ctx: SKRSContext2D,
  item: SceneItem,
  color: string,
  x: number,
  y: number,
  w: number,
  h: number,
  ar: boolean,
  images: Map<string, Image>,
) {
  roundRect(ctx, x, y, w, h, 10, "#ffffff");
  ctx.strokeStyle = "#d6deea";
  ctx.strokeRect(x, y, w, h);
  const picture = item.src ? images.get(item.src) : undefined;
  if (picture) {
    const boxW = w - 16;
    const boxH = 110;
    const scale = Math.min(boxW / picture.width, boxH / picture.height);
    const dw = picture.width * scale;
    const dh = picture.height * scale;
    ctx.drawImage(picture, x + 8 + (boxW - dw) / 2, y + 8 + (boxH - dh) / 2, dw, dh);
  } else {
    drawLessonArt(ctx, item.art, x + 8, y + 8, w - 16, 110, ar);
  }
  ctx.fillStyle = color;
  ctx.font = `13px ${FONT_NAME}`;
  paintText(ctx, item.term, ar ? x + w - 10 : x + 10, y + 124, ar ? "right" : "left");
  ctx.fillStyle = "#334155";
  ctx.font = `12px ${FONT_NAME}`;
  wrap(ctx, item.scene, w - 16).forEach((line, index) => {
    paintText(ctx, line, ar ? x + w - 10 : x + 10, y + 144 + index * 15, ar ? "right" : "left");
  });
}

function drawScenesGrid(
  ctx: SKRSContext2D,
  items: SceneItem[],
  color: string,
  x: number,
  y: number,
  w: number,
  ar: boolean,
  from: number,
  limit: number,
  images: Map<string, Image>,
): { h: number; next: number } {
  const gap = 10;
  const cols = 2;
  const cardW = (w - gap) / cols;
  let used = 0;
  let index = from;
  while (index < items.length && index < from + limit) {
    const rowItems = items.slice(index, Math.min(index + cols, from + limit, items.length));
    const rowH = Math.max(...rowItems.map((item) => sceneCardHeight(ctx, item.scene, cardW)));
    rowItems.forEach((item, col) => {
      const cx = ar ? x + w - (col + 1) * cardW - col * gap : x + col * (cardW + gap);
      drawSceneCard(ctx, item, color, cx, y + used, cardW, rowH, ar, images);
    });
    used += rowH + gap;
    index += rowItems.length;
  }
  return { h: used, next: index };
}

function explainHeight(ctx: SKRSContext2D, block: ExplainBlock, w: number, ar: boolean): number {
  const icon = 52;
  ctx.font = `14px ${FONT_NAME}`;
  const bodyLines = wrap(ctx, block.body, w - icon - 28);
  const exampleLines = block.example ? wrap(ctx, `${ar ? "مثال:" : "Example:"} ${block.example}`, w - 20) : [];
  return Math.max(72, 28 + bodyLines.length * 18 + (exampleLines.length ? exampleLines.length * 18 + 22 : 8)) + 10;
}

function tableSliceHeight(
  ctx: SKRSContext2D,
  block: TableBlock,
  w: number,
  from: number,
  count: number,
  withHeader: boolean,
): number {
  const widths = colWidths(block.headers.length, w);
  let h = withHeader ? 30 : 0;
  for (let i = 0; i < count; i += 1) {
    const row = block.rows[from + i];
    if (!row) break;
    h += tableRowHeight(ctx, row.cells, widths);
    if (row.example) {
      ctx.font = `14px ${FONT_NAME}`;
      h += wrap(ctx, row.example, w - 16).length * 19 + 14;
    }
  }
  return h + 8;
}

function figureTitle(id: string, ar: boolean): string {
  const titles: Record<string, [string, string]> = {
    "it-timeline": ["شكل — خط زمن التقنية", "Figure — IT timeline"],
    "ai-nest": ["شكل — درجات الذكاء", "Figure — levels of AI"],
    "ai-life": ["شكل — أين يظهر الذكاء", "Figure — where AI appears"],
    encrypt: ["شكل — التشفير", "Figure — encryption"],
    auth: ["شكل — المصادقة", "Figure — authentication"],
    firewall: ["شكل — جدار الحماية", "Figure — firewall"],
    "web-stack": ["شكل — طبقات التطبيق", "Figure — app layers"],
    http: ["شكل — المتصفح والخادم", "Figure — browser and server"],
    "html-css-js": ["شكل — هيكل الصفحة وتنسيقها وتفاعلها", "Figure — page structure, style, and action"],
    media: ["شكل — اختيار الوسيط", "Figure — choose a medium"],
    ux: ["شكل — دورة التجربة", "Figure — UX cycle"],
    collect: ["شكل — جمع البيانات", "Figure — collect data"],
    clean: ["شكل — تنظيف الجدول", "Figure — clean a table"],
    api: ["شكل — الواجهة البرمجية", "Figure — the data door"],
    charts: ["شكل — اختر الرسم", "Figure — choose a chart"],
    regress: ["شكل — خط الانحدار", "Figure — regression line"],
    "ml-types": ["شكل — أنواع التعلم", "Figure — types of learning"],
    neural: ["شكل — شبكة عصبونية", "Figure — neural net"],
    llm: ["شكل — راجع المساعد", "Figure — check the assistant"],
  };
  const pair = titles[id];
  if (!pair) return ar ? "شكل" : "Figure";
  return ar ? pair[0] : pair[1];
}

function pushQuestions(blocks: Block[], locale: Locale, rows: BookletMcq[], start = 1) {
  const letters = bookletLetters(locale);
  rows.forEach((question, index) => {
    blocks.push({
      kind: "question",
      n: start + index,
      prompt: bookletPrompt(locale, question.promptAr, question.promptEn),
      options: bookletOptions(locale, question.optionsAr, question.optionsEn),
      letters,
    });
  });
}

function pushLesson(blocks: Block[], pack: BookletLessonPack, locale: Locale) {
  const ar = locale === "ar";
  const chapter = pack.chapter;
  const page = textbookPageFor(pack.lessonId);
  if (!page) return;
  blocks.push({
    kind: "banner",
    text: bookletSafe(locale, `${ar ? "الدرس" : "Lesson"} ${page.id}  ${ar ? page.titleAr : page.titleEn}`),
    color: chapter.color,
  });
  blocks.push({
    kind: "text",
    text: bookletSafe(locale, `${ar ? "الفصل" : "Chapter"} ${chapter.id} — ${ar ? chapter.titleAr : chapter.titleEn}`),
    size: 14,
    gap: 12,
  });
  blocks.push({
    kind: "ask",
    text: bookletSafe(locale, `${ar ? "السؤال الرئيسي:" : "Main question:"} ${ar ? page.questionAr : page.questionEn}`),
  });
  blocks.push({ kind: "section", text: bookletSafe(locale, ar ? page.sectionAr : page.sectionEn) });
  blocks.push({
    kind: "text",
    text: bookletSafe(locale, ar ? page.introAr : page.introEn),
    size: 14,
  });
  const points = (ar ? page.pointsAr : page.pointsEn).map((item) => bookletSafe(locale, item));
  if (points.length) blocks.push({ kind: "points", items: points });
  const termTable = page.headersAr[0] === "المصطلح" || page.headersEn[0] === "Term";
  const pageArts = lessonArtMap([
    ...(termTable
      ? page.rows.map((row) => ({
          term: bookletSafe(locale, ar ? (row.cellsAr[0] ?? "") : (row.cellsEn[0] ?? "")),
          meaning: bookletSafe(locale, ar ? (row.cellsAr[1] ?? "") : (row.cellsEn[1] ?? "")),
        }))
      : []),
    ...page.explains.map((item) => ({
      term: bookletSafe(locale, ar ? item.termAr : item.termEn),
      meaning: bookletSafe(locale, ar ? item.bodyAr : item.bodyEn),
    })),
    ...pack.scenes.map((scene) => ({
      term: bookletSafe(locale, ar ? scene.termAr : scene.termEn),
      meaning: bookletSafe(locale, ar ? scene.sceneAr : scene.sceneEn),
    })),
  ]);
  if (termTable) {
    blocks.push({
      kind: "terms",
      color: chapter.color,
      items: page.rows.map((row) => {
        const term = bookletSafe(locale, ar ? (row.cellsAr[0] ?? "") : (row.cellsEn[0] ?? ""));
        const meaning = bookletSafe(locale, ar ? (row.cellsAr[1] ?? "") : (row.cellsEn[1] ?? ""));
        return { term, meaning, art: artFor(pageArts, term, meaning) };
      }),
    });
  } else {
    blocks.push({
      kind: "table",
      headers: (ar ? page.headersAr : page.headersEn).map((header) => bookletSafe(locale, header)),
      rows: page.rows.map((row) => ({
        cells: (ar ? [...row.cellsAr] : [...row.cellsEn]).map((cell) => bookletSafe(locale, cell)),
        example: row.exampleAr || row.exampleEn ? bookletSafe(locale, (ar ? row.exampleAr : row.exampleEn) ?? "") : undefined,
      })),
    });
  }
  if (page.explains.length) {
    blocks.push({ kind: "section", text: ar ? "شرح المصطلحات — اقرأ قبل التدريبات" : "Term explanations — read before the drills" });
    for (const bundle of bundleExplains(page.explains)) {
      const title = bookletSafe(locale, ar ? bundle.titleAr : bundle.titleEn);
      const body = bundle.items
        .map((item, index) => {
          const name = bookletSafe(locale, ar ? item.termAr : item.termEn);
          const text = bookletSafe(locale, ar ? item.bodyAr : item.bodyEn);
          return bundle.items.length > 1 ? `${index + 1}) ${name} — ${text}` : text;
        })
        .join("\n");
      const lead = bundle.items[0];
      blocks.push({
        kind: "explain",
        title,
        body,
        example: lead ? bookletSafe(locale, ar ? lead.exampleAr : lead.exampleEn) : "",
        art: artFor(pageArts, title, body),
        color: chapter.color,
      });
    }
  }
  blocks.push({
    kind: "takeaway",
    text: bookletSafe(locale, `${ar ? "الخلاصة:" : "Takeaway:"} ${ar ? page.takeawayAr : page.takeawayEn}`),
  });
  if (pack.practice.length) {
    blocks.push({ kind: "section", text: ar ? `اختيار من متعدد — الدرس ${page.id}` : `Multiple choice — lesson ${page.id}` });
    pushQuestions(blocks, locale, pack.practice);
  }
  if (pack.tf.length) {
    blocks.push({ kind: "section", text: ar ? "صح وغلط" : "True or false" });
    pushQuestions(blocks, locale, pack.tf);
  }
  if (pack.essays.length) {
    blocks.push({ kind: "section", text: ar ? "أسئلة مقالي" : "Essay questions" });
    pack.essays.forEach((essay, index) => {
      blocks.push({
        kind: "essay",
        n: index + 1,
        prompt: bookletPrompt(locale, essay.promptAr, essay.promptEn),
      });
    });
  }
}

function pushEssayGuides(
  blocks: Block[],
  locale: Locale,
  title: string,
  essays: { guideAr: string; guideEn: string }[],
) {
  if (!essays.length) return;
  const ar = locale === "ar";
  blocks.push({ kind: "section", text: title });
  essays.forEach((essay, index) => {
    const guide = (ar ? essay.guideAr : essay.guideEn).trim();
    if (!guide) return;
    blocks.push({
      kind: "text",
      text: `${ar ? "مقالي" : "Essay"} ${index + 1}: ${bookletSafe(locale, guide)}`,
      size: 14,
      gap: 12,
    });
  });
}

function pushAnswerKey(
  blocks: Block[],
  locale: Locale,
  rows: {
    title: string;
    answers: { index: number; promptAr: string; promptEn: string; choiceAr: string; choiceEn: string }[];
  }[],
) {
  const ar = locale === "ar";
  blocks.push({ kind: "banner", text: ar ? "مفتاح الإجابة" : "Answer key", color: "#0c2d6b" });
  for (const block of rows) {
    blocks.push({ kind: "section", text: block.title });
    for (const [index, row] of block.answers.entries()) {
      const choice = bookletSafe(locale, ar ? row.choiceAr : row.choiceEn);
      const prompt = bookletSafe(locale, ar ? row.promptAr : row.promptEn);
      blocks.push({
        kind: "text",
        text: `${index + 1}-${bookletAnswerMark(locale, row.index)}  ${choice}  —  ${prompt}`,
        size: 14,
        gap: 8,
      });
    }
  }
}

function faizColors(id: string) {
  return id === "f2"
    ? { color: "#7f1d1d", accent: "#f59e0b" }
    : id === "f3"
      ? { color: "#134e4a", accent: "#2dd4bf" }
      : id === "f4"
        ? { color: "#4a1942", accent: "#e879f9" }
        : { color: "#0c2d6b", accent: "#c4a35a" };
}

function coverCopy(locale: Locale, scope: BookletScope) {
  const ar = locale === "ar";
  const assessId = assessLessonId(scope);
  if (assessId) {
    const title = assessLessonTitle(assessId);
    const lesson = getLesson(assessId);
    const chapter = lesson ? getChapter(lesson.chapterId) : undefined;
    return {
      kicker: ar ? "الأداءات والتقييمات" : "Assessments",
      title: ar ? `${assessId} — ${title.titleAr}` : `${assessId} — ${title.titleEn}`,
      color: chapter?.color ?? "#0c2d6b",
    };
  }
  if (scope === "faiz") {
    return {
      kicker: ar ? "كتاب الفائز" : "Al-Faiz",
      title: ar ? "ملزمة كتاب الفائز" : "Al-Faiz booklet",
      color: "#0c2d6b",
    };
  }
  if (scope === "faiz-hw") {
    const homework = bookletFaizHomework();
    return {
      kicker: ar ? "كتاب الفائز" : "Al-Faiz",
      title: ar ? homework.titleAr : homework.titleEn,
      color: "#92400e",
    };
  }
  const unit = faizUnitId(scope);
  if (unit) {
    const pack = bookletFaizPack(unit);
    const { color } = faizColors(unit);
    return {
      kicker: ar ? "كتاب الفائز" : "Al-Faiz",
      title: pack ? (ar ? pack.note.titleAr : pack.note.titleEn) : unit,
      color,
    };
  }
  const homeworkId = homeworkChapterId(scope);
  if (homeworkId) {
    const chapter = getChapter(homeworkId);
    const pack = chapter ? bookletHomeworkForChapter(chapter) : null;
    return {
      kicker: ar ? `الفصل ${homeworkId}` : `Chapter ${homeworkId}`,
      title: pack ? (ar ? pack.titleAr : pack.titleEn) : "",
      color: chapter?.color ?? "#0c2d6b",
    };
  }
  const pack = bookletLessonPack(scope);
  if (!pack) {
    return { kicker: ar ? `الفصل ${scope}` : `Chapter ${scope}`, title: "", color: "#0c2d6b" };
  }
  return {
    kicker: ar ? `الفصل ${pack.chapter.id} · الدرس ${scope}` : `Chapter ${pack.chapter.id} · Lesson ${scope}`,
    title: ar ? pack.titleAr : pack.titleEn,
    color: pack.chapter.color,
  };
}

function drawCoverPage(ctx: SKRSContext2D, locale: Locale, scope: BookletScope) {
  const ar = locale === "ar";
  const copy = coverCopy(locale, scope);
  ctx.fillStyle = copy.color;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  ctx.fillStyle = "#d4a017";
  ctx.fillRect(0, 0, PAGE_W, 12);
  ctx.fillRect(0, PAGE_H - 12, PAGE_W, 12);

  const cardX = 36;
  const cardY = 148;
  const cardW = PAGE_W - 72;
  const cardH = 540;
  roundRect(ctx, cardX, cardY, cardW, cardH, 12, "#ffffff");

  const cx = PAGE_W / 2;
  ctx.fillStyle = copy.color;
  ctx.font = `16px ${FONT_NAME}`;
  paintText(ctx, ar ? BRAND.nameAr : BRAND.nameEn, cx, cardY + 28, "center");

  ctx.fillStyle = "#b45309";
  ctx.font = `15px ${FONT_NAME}`;
  paintText(ctx, copy.kicker, cx, cardY + 64, "center");

  ctx.fillStyle = "#0c2d6b";
  ctx.font = `28px ${FONT_NAME}`;
  paintText(ctx, ar ? "ملزمة الطالب" : "Student booklet", cx, cardY + 96, "center");

  ctx.fillStyle = "#111827";
  ctx.font = `20px ${FONT_NAME}`;
  const titleLines = wrap(ctx, copy.title, cardW - 56);
  titleLines.forEach((line, index) => {
    paintText(ctx, line, cx, cardY + 148 + index * 28, "center");
  });

  const afterTitle = cardY + 148 + titleLines.length * 28 + 18;
  ctx.fillStyle = "#374151";
  ctx.font = `15px ${FONT_NAME}`;
  paintText(ctx, ar ? BRAND.subjectAr : BRAND.subjectEn, cx, afterTitle, "center");
  paintText(ctx, ar ? BRAND.gradeAr : BRAND.gradeEn, cx, afterTitle + 24, "center");

  ctx.fillStyle = "#111827";
  ctx.font = `18px ${FONT_NAME}`;
  paintText(ctx, ar ? BRAND.teacherAr : BRAND.teacherEn, cx, afterTitle + 66, "center");
  ctx.fillStyle = "#0c2d6b";
  ctx.font = `16px ${FONT_NAME}`;
  paintText(ctx, BRAND.phone, cx, afterTitle + 92, "center");
  ctx.fillStyle = "#374151";
  ctx.font = `14px ${FONT_NAME}`;
  paintText(ctx, BRAND.year, cx, afterTitle + 116, "center");

  const fields = ar ? ["المجموعة", "رقم التليفون", "الاسم"] : ["Name", "Phone", "Group"];
  const fieldY = cardY + cardH - 96;
  const fieldW = (cardW - 56) / 3;
  fields.forEach((label, index) => {
    const fx = cardX + 28 + index * (fieldW + 8);
    ctx.fillStyle = "#6b7280";
    ctx.font = `13px ${FONT_NAME}`;
    paintText(ctx, label, ar ? fx + fieldW : fx, fieldY, ar ? "right" : "left");
    ctx.strokeStyle = "#0c2d6b";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(fx, fieldY + 34);
    ctx.lineTo(fx + fieldW, fieldY + 34);
    ctx.stroke();
  });
}

function pushFaizUnit(blocks: Block[], pack: BookletFaizPack, locale: Locale) {
  const ar = locale === "ar";
  const { color, accent } = faizColors(pack.note.id);
  blocks.push({ kind: "banner", text: ar ? pack.note.titleAr : pack.note.titleEn, color });
  const map = mindMapForFaiz(pack.note.id);
  if (map) blocks.push({ kind: "map", root: map, color, accent });
  for (const id of CHAPTER_FIGURES[pack.note.id] ?? []) {
    blocks.push({ kind: "figure", id, color, title: figureTitle(id, ar) });
  }
  for (const section of pack.note.sections) {
    blocks.push({ kind: "section", text: ar ? section.headingAr : section.headingEn });
    for (const body of ar ? section.bodyAr : section.bodyEn) {
      blocks.push({ kind: "text", text: `• ${bookletSafe(locale, body)}`, size: 14, gap: 10 });
    }
  }
  pushQuestions(blocks, locale, pack.practice);
}

function pushHomeworkBlocks(blocks: Block[], pack: BookletHomeworkPack, locale: Locale) {
  const ar = locale === "ar";
  blocks.push({ kind: "banner", text: ar ? pack.titleAr : pack.titleEn, color: "#92400e" });
  pushQuestions(blocks, locale, pack.mcq);
  pack.essays.forEach((essay, index) => {
    blocks.push({ kind: "essay", n: index + 1, prompt: bookletPrompt(locale, essay.promptAr, essay.promptEn) });
  });
}

function buildBlocks(locale: Locale, scope: BookletScope): Block[] {
  const ar = locale === "ar";
  const blocks: Block[] = [];
  const assessId = assessLessonId(scope);
  if (assessId) {
    const typed = assessBlocksForLesson(assessId);
    const letters = ar ? ["أ", "ب", "ج", "د"] : ["A", "B", "C", "D"];
    if (typed.length) {
      blocks.push({
        kind: "banner",
        text: ar ? "أسئلة الوزارة — سطور للحل ثم المفتاح" : "Ministry questions — write, then check the key",
        color: "#0c2d6b",
      });
    }
    for (const block of typed) {
      const heading = ar
        ? `${periodLabelAr(block.period)} — ${block.titleAr}`
        : `${periodLabelEn(block.period)} — ${block.titleEn}`;
      blocks.push({ kind: "section", text: heading });
      block.essays.forEach((row, index) => {
        blocks.push({ kind: "essay", n: index + 1, prompt: assessPrompt(row, locale) });
      });
      block.mcq.forEach((row, index) => {
        blocks.push({
          kind: "question",
          n: index + 1,
          prompt: assessPrompt(row, locale),
          options: assessOptions(row, locale),
          letters,
        });
      });
      blocks.push({ kind: "section", text: ar ? "إجابات هذا الأداء" : "Answers for this task" });
      block.mcq.forEach((row, index) => {
        const mark = letters[row.correctIndex ?? 0] ?? "";
        const choice = assessOptions(row, locale)[row.correctIndex ?? 0] ?? "";
        blocks.push({
          kind: "text",
          text: `${index + 1}-${mark}  ${choice}`,
          size: 14,
          gap: 8,
        });
      });
      block.essays.forEach((row, index) => {
        const guide = assessGuide(row, locale);
        if (!guide) return;
        blocks.push({
          kind: "text",
          text: `${ar ? "مقالي" : "Essay"} ${index + 1}: ${guide}`,
          size: 14,
          gap: 12,
        });
      });
    }
    return blocks;
  }

  if (scope === "faiz-hw") {
    const homework = bookletFaizHomework();
    pushHomeworkBlocks(blocks, homework, locale);
    pushAnswerKey(blocks, locale, [{ title: ar ? homework.titleAr : homework.titleEn, answers: homework.answers }]);
    pushEssayGuides(blocks, locale, ar ? "مقالي واجب الفائز" : "Al-Faiz essays", homework.essays);
    return blocks;
  }

  const unit = faizUnitId(scope);
  if (unit) {
    const pack = bookletFaizPack(unit);
    if (!pack) return blocks;
    pushFaizUnit(blocks, pack, locale);
    pushAnswerKey(blocks, locale, [{ title: ar ? pack.note.titleAr : pack.note.titleEn, answers: pack.answers }]);
    return blocks;
  }

  const homeworkId = homeworkChapterId(scope);
  if (homeworkId) {
    const chapter = getChapter(homeworkId);
    if (!chapter) return blocks;
    const pack = bookletHomeworkForChapter(chapter);
    pushHomeworkBlocks(blocks, pack, locale);
    pushAnswerKey(blocks, locale, [{ title: ar ? pack.titleAr : pack.titleEn, answers: pack.answers }]);
    pushEssayGuides(blocks, locale, ar ? "مقالي الواجب" : "Homework essays", pack.essays);
    return blocks;
  }

  if (scope === "faiz") {
    blocks.push({ kind: "text", text: ar ? "ملزمة كتاب الفائز" : "Al-Faiz booklet", size: 16, gap: 16 });
    for (const pack of bookletFaizPacks()) {
      const color =
        pack.note.id === "f2" ? "#7f1d1d" : pack.note.id === "f3" ? "#134e4a" : pack.note.id === "f4" ? "#4a1942" : "#0c2d6b";
      const accent =
        pack.note.id === "f2" ? "#f59e0b" : pack.note.id === "f3" ? "#2dd4bf" : pack.note.id === "f4" ? "#e879f9" : "#c4a35a";
      blocks.push({ kind: "banner", text: ar ? pack.note.titleAr : pack.note.titleEn, color });
      const map = mindMapForFaiz(pack.note.id);
      if (map) blocks.push({ kind: "map", root: map, color, accent });
      for (const id of CHAPTER_FIGURES[pack.note.id] ?? []) {
        blocks.push({ kind: "figure", id, color, title: figureTitle(id, ar) });
      }
      for (const section of pack.note.sections) {
        blocks.push({ kind: "section", text: ar ? section.headingAr : section.headingEn });
        for (const body of ar ? section.bodyAr : section.bodyEn) {
          blocks.push({ kind: "text", text: `• ${bookletSafe(locale, body)}`, size: 14, gap: 10 });
        }
      }
      pushQuestions(blocks, locale, pack.practice);
    }
    const homework = bookletFaizHomework();
    blocks.push({ kind: "banner", text: ar ? homework.titleAr : homework.titleEn, color: "#92400e" });
    pushQuestions(blocks, locale, homework.mcq);
    homework.essays.forEach((essay, index) => {
      blocks.push({ kind: "essay", n: index + 1, prompt: bookletPrompt(locale, essay.promptAr, essay.promptEn) });
    });
    pushAnswerKey(blocks, locale, [
      ...bookletFaizPacks().map((pack) => ({
        title: ar ? pack.note.titleAr : pack.note.titleEn,
        answers: pack.answers,
      })),
      { title: ar ? homework.titleAr : homework.titleEn, answers: homework.answers },
    ]);
    pushEssayGuides(blocks, locale, ar ? "مقالي واجب الفائز" : "Al-Faiz essays", homework.essays);
    return blocks;
  }

  const pack = bookletLessonPack(scope);
  if (!pack) return blocks;
  blocks.push({
    kind: "text",
    text: ar
      ? `ملزمة الدرس ${pack.lessonId} — ${pack.titleAr}`
      : `Lesson ${pack.lessonId} booklet — ${pack.titleEn}`,
    size: 16,
    gap: 16,
  });
  pushLesson(blocks, pack, locale);
  pushAnswerKey(blocks, locale, [
    {
      title: ar ? `اختيار من متعدد — الدرس ${pack.lessonId}` : `Multiple choice — lesson ${pack.lessonId}`,
      answers: pack.practice.map((row) => ({
        index: row.correctIndex,
        promptAr: row.promptAr,
        promptEn: row.promptEn,
        choiceAr: row.optionsAr[row.correctIndex] ?? "",
        choiceEn: row.optionsEn[row.correctIndex] ?? "",
      })),
    },
    {
      title: ar ? "صح وغلط" : "True or false",
      answers: pack.tf.map((row) => ({
        index: row.correctIndex,
        promptAr: row.promptAr,
        promptEn: row.promptEn,
        choiceAr: row.optionsAr[row.correctIndex] ?? "",
        choiceEn: row.optionsEn[row.correctIndex] ?? "",
      })),
    },
  ]);
  pushEssayGuides(blocks, locale, ar ? "المقالي" : "Essays", pack.essays);
  return blocks;
}

export async function buildBookletPdf(locale: Locale, scope: BookletScope): Promise<Uint8Array> {
  ensureFont();
  latinOnly = locale === "en";
  const ar = locale === "ar";
  const margin = 40;
  const foot = 32;
  const maxWidth = PAGE_W - margin * 2;
  const canvas = createCanvas(PAGE_W * SCALE, PAGE_H * SCALE);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const pdf = await PDFDocument.create();
  const blocks = buildBlocks(locale, scope);

  const reset = () => {
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
    ctx.fillStyle = "#0b1220";
  };

  let pageNo = 1;

  const drawFooter = (n: number) => {
    ctx.strokeStyle = "#e4e4e7";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, PAGE_H - foot);
    ctx.lineTo(PAGE_W - margin, PAGE_H - foot);
    ctx.stroke();
    const badge = ar ? "البكالوريا" : "Baccalaureate";
    ctx.font = `12px ${FONT_NAME}`;
    const badgeW = Math.max(80, ctx.measureText(badge).width + 16);
    const badgeX = ar ? PAGE_W - margin - badgeW : margin;
    roundRect(ctx, badgeX, PAGE_H - 24, badgeW, 16, 3, "#047857");
    ctx.fillStyle = "#ffffff";
    ctx.font = `12px ${FONT_NAME}`;
    paintText(ctx, badge, badgeX + badgeW / 2, PAGE_H - 22, "center");
    ctx.fillStyle = "#111827";
    ctx.font = `13px ${FONT_NAME}`;
    paintText(ctx, String(n), ar ? margin : PAGE_W - margin, PAGE_H - 22, ar ? "left" : "right");
    paintText(ctx, BRAND.phone, PAGE_W / 2, PAGE_H - 22, "center");
  };

  const flush = async () => {
    drawFooter(pageNo);
    pageNo += 1;
    const page = pdf.addPage([PAGE_W, PAGE_H]);
    const image = await pdf.embedJpg(canvas.toBuffer("image/jpeg", 96));
    page.drawImage(image, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
  };

  const need = (h: number, y: number) => {
    return y + h > PAGE_H - margin - foot;
  };

  const textX = ar ? PAGE_W - margin : margin;
  const textAlign = ar ? "right" : "left";
  const images = new Map<string, Image>();
  const bookKeys = new Set<string>();
  for (const block of blocks) {
    if (block.kind === "photo" && block.src) bookKeys.add(block.src);
    if (block.kind === "scenes") {
      for (const item of block.items) {
        if (item.src) bookKeys.add(item.src);
      }
    }
  }
  for (const key of bookKeys) {
    if (images.has(key)) continue;
    const match = /^book:([^:]+):(\d+)$/.exec(key);
    if (match) {
      const png = await renderBookPage(locale, match[1]!, Number(match[2]));
      if (png) images.set(key, await loadImage(png));
      continue;
    }
    if (key.startsWith("/")) {
      images.set(key, await loadImage(path.join(process.cwd(), "public", key.replace(/^\//, ""))));
    }
  }

  reset();
  drawCoverPage(ctx, locale, scope);
  const coverPage = pdf.addPage([PAGE_W, PAGE_H]);
  const coverImage = await pdf.embedJpg(canvas.toBuffer("image/jpeg", 96));
  coverPage.drawImage(coverImage, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });

  reset();
  let y = margin;
  for (const block of blocks) {
    if (block.kind === "text") {
      const size = block.size;
      ctx.font = `${size}px ${FONT_NAME}`;
      ctx.fillStyle = "#0b1220";
      const chunks = block.text ? wrap(ctx, block.text, maxWidth) : [""];
      for (const chunk of chunks) {
        if (need(size + 10, y)) {
          await flush();
          reset();
          y = margin;
        }
        if (chunk) paintText(ctx, chunk, textX, y, textAlign);
        y += size + (block.gap ?? 8);
      }
      continue;
    }
    if (block.kind === "banner") {
      const needed = bannerSize(ctx, block.text, maxWidth).gap;
      if (need(needed, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawBanner(ctx, block.text, block.color, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "section") {
      const next = blocks[blocks.indexOf(block) + 1];
      let needed = sectionSize(ctx, block.text, maxWidth).gap;
      if (next?.kind === "explain") needed += explainHeight(ctx, next, maxWidth, ar);
      else if (next?.kind === "scenes") {
        const cardW = (maxWidth - 10) / 2;
        needed += sceneCardHeight(ctx, next.items[0]?.scene ?? "", cardW) + 20;
      } else if (next?.kind === "table") {
        needed += tableSliceHeight(ctx, next, maxWidth, 0, Math.min(2, next.rows.length), true);
      } else if (next?.kind === "terms") {
        needed += 90;
      } else if (next?.kind === "question") {
        needed += questionLines(ctx, next, maxWidth).h + 14;
      } else if (next?.kind === "figure") {
        needed += 180;
      } else if (next?.kind === "map") {
        needed += mapHeight(ctx, next.root, maxWidth, ar);
      } else {
        needed += 48;
      }
      if (need(needed, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawSection(ctx, block.text, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "question") {
      const h = questionLines(ctx, block, maxWidth).h + 14;
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawQuestionCard(ctx, block, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "essay") {
      const h = essayHeight(ctx, block, maxWidth) + 14;
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawEssayCard(ctx, block, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "figure") {
      const h = 180;
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawFigure(ctx, block.id, block.color, block.title, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "map") {
      const h = mapHeight(ctx, block.root, maxWidth, ar);
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawMap(ctx, block.root, block.color, block.accent, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "break") {
      if (y > margin + 8) {
        await flush();
        reset();
        y = margin;
      }
      continue;
    }
    if (block.kind === "ask") {
      ctx.font = `15px ${FONT_NAME}`;
      const h = wrap(ctx, block.text, maxWidth - 40).length * 22 + 32;
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawAsk(ctx, block.text, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "points") {
      ctx.font = `14px ${FONT_NAME}`;
      const h = block.items.reduce((sum, item) => sum + wrap(ctx, item, maxWidth).length * 20 + 8, 16);
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawPoints(ctx, block.items, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "takeaway") {
      ctx.font = `14px ${FONT_NAME}`;
      const h = wrap(ctx, block.text, maxWidth - 20).length * 20 + 32;
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawTakeaway(ctx, block.text, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "photo") {
      if (need(photoHeight(ctx, block, maxWidth), y)) {
        await flush();
        reset();
        y = margin;
      }
      y += await drawPhoto(ctx, block, margin, y, maxWidth, ar, images);
      continue;
    }
    if (block.kind === "explain") {
      const h = explainHeight(ctx, block, maxWidth, ar);
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawExplain(ctx, block, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "terms") {
      const gap = 10;
      const colW = (maxWidth - gap) / 2;
      const icon = 52;
      let from = 0;
      while (from < block.items.length) {
        const pair = block.items.slice(from, from + 2);
        ctx.font = `14px ${FONT_NAME}`;
        const rowH =
          Math.max(
            ...pair.map((item) => {
              const meaningLines = wrap(ctx, item.meaning, colW - icon - 20);
              return Math.max(68, 18 + meaningLines.length * 18 + 16);
            }),
          ) + gap;
        if (need(rowH, y)) {
          await flush();
          reset();
          y = margin;
        }
        const drawn = drawTerms(ctx, block, margin, y, maxWidth, ar, from, 2);
        y += drawn.h;
        from = drawn.next;
      }
      continue;
    }
    if (block.kind === "table") {
      const firstChunk = tableSliceHeight(ctx, block, maxWidth, 0, Math.min(2, block.rows.length), true);
      if (need(firstChunk, y)) {
        await flush();
        reset();
        y = margin;
      }
      let from = 0;
      while (from < block.rows.length) {
        const header = from === 0 || y === margin;
        let take = 0;
        while (from + take < block.rows.length) {
          const nextH = tableSliceHeight(ctx, block, maxWidth, from, take + 1, header);
          if (y + nextH > PAGE_H - margin - foot && take > 0) break;
          if (y + nextH > PAGE_H - margin - foot && take === 0) {
            if (y === margin) {
              take = 1;
              break;
            }
            await flush();
            reset();
            y = margin;
            break;
          }
          take += 1;
        }
        if (!take) continue;
        const drawn = drawTable(ctx, block, margin, y, maxWidth, ar, header, from, take);
        y += drawn.h;
        from = drawn.next;
      }
      continue;
    }
    if (block.kind === "scenes") {
      const gap = 10;
      const cardW = (maxWidth - gap) / 2;
      if (need(sceneCardHeight(ctx, block.items[0]?.scene ?? "", cardW) + 20, y)) {
        await flush();
        reset();
        y = margin;
      }
      let from = 0;
      while (from < block.items.length) {
        let take = 0;
        while (from + take < block.items.length) {
          const next = block.items.slice(from, from + take + 2);
          const rows = Math.ceil(next.length / 2);
          let rowH = 0;
          for (let r = 0; r < rows; r += 1) {
            const pair = next.slice(r * 2, r * 2 + 2);
            rowH += Math.max(...pair.map((item) => sceneCardHeight(ctx, item.scene, cardW))) + gap;
          }
          if (y + rowH > PAGE_H - margin - foot && take > 0) break;
          if (y + rowH > PAGE_H - margin - foot && take === 0) {
            if (y === margin) {
              take = Math.min(2, block.items.length - from);
              break;
            }
            await flush();
            reset();
            y = margin;
            break;
          }
          take = Math.min(block.items.length - from, take + 2);
        }
        if (!take) continue;
        const drawn = drawScenesGrid(ctx, block.items, block.color, margin, y, maxWidth, ar, from, take, images);
        y += drawn.h;
        from = drawn.next;
      }
      continue;
    }
  }
  await flush();
  return pdf.save();
}

export function bookletFileName(locale: Locale, scope: BookletScope): string {
  const assessId = assessLessonId(scope);
  if (assessId) {
    return locale === "ar" ? `ملزمة-أداءات-${assessId}-MindSoft-2027.pdf` : `MindSoft-assessments-${assessId}-2027.pdf`;
  }
  if (scope === "faiz") return locale === "ar" ? "ملزمة-الفائز-MindSoft-2027.pdf" : "MindSoft-faiz-2027.pdf";
  if (scope === "faiz-hw") return locale === "ar" ? "ملزمة-واجب-الفائز-MindSoft-2027.pdf" : "MindSoft-faiz-homework-2027.pdf";
  if (faizUnitId(scope)) {
    return locale === "ar" ? `ملزمة-الفائز-${scope}-MindSoft-2027.pdf` : `MindSoft-faiz-${scope}-2027.pdf`;
  }
  if (homeworkChapterId(scope)) {
    return locale === "ar"
      ? `ملزمة-واجب-الفصل-${homeworkChapterId(scope)}-MindSoft-2027.pdf`
      : `MindSoft-homework-${homeworkChapterId(scope)}-2027.pdf`;
  }
  return locale === "ar" ? `ملزمة-الدرس-${scope}-MindSoft-2027.pdf` : `MindSoft-lesson-${scope}-2027.pdf`;
}
