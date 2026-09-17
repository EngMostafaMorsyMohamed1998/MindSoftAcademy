import path from "path";
import { createCanvas, GlobalFonts, loadImage, type Image, type SKRSContext2D } from "@napi-rs/canvas";
import { PDFDocument } from "pdf-lib";
import { BRAND } from "@/lib/brand";
import { CHAPTER_FIGURES } from "@/components/booklet-figures";
import {
  bookletAnswerMark,
  bookletChapterPack,
  bookletFaizHomework,
  bookletFaizPacks,
  bookletHomeworkForChapter,
  bookletLetters,
  bookletOptions,
  type BookletChapterPack,
  type BookletScope,
} from "@/lib/booklet-pack";
import { getChapter } from "@/lib/curriculum";
import { LESSON_NOTES } from "@/lib/lessons";
import type { Locale } from "@/lib/locale";
import { mindMapForChapter, mindMapForFaiz, type MindNode } from "@/lib/mind-maps";
import { textbookPageFor } from "@/lib/textbook-pages";

const FONT_NAME = "NotoNaskh";
const PAGE_W = 595;
const PAGE_H = 842;
const SCALE = 2.2;
const LETTERS = ["أ", "ب", "ج", "د"];

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
type BannerBlock = { kind: "banner"; text: string; color: string };
type SectionBlock = { kind: "section"; text: string };
type QuestionBlock = { kind: "question"; n: number; prompt: string; options: string[]; letters: string[] };
type EssayBlock = { kind: "essay"; n: number; prompt: string };
type FigureBlock = { kind: "figure"; id: string; color: string; title: string };
type MapBlock = { kind: "map"; root: MindNode; color: string; accent: string };
type SceneBlock = { kind: "scene"; color: string; term: string; scene: string; art: string };
type AskBlock = { kind: "ask"; text: string };
type PhotoBlock = { kind: "photo"; src?: string; art: string; title: string; intro: string };
type TableBlock = { kind: "table"; headers: string[]; rows: { cells: string[]; example?: string }[] };
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
  | AskBlock
  | PhotoBlock
  | TableBlock
  | PointsBlock
  | TakeawayBlock
  | BreakBlock;

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
  ctx.direction = "ltr";
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
    boxLabel(ctx, "2FA", x + w / 2 - 40, innerTop + 4, 80, 28, "#111827", 13);
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
    paintText(ctx, "GET / POST", x + w / 2, innerTop + 36, "center");
    boxLabel(ctx, tr("الخادم", "Server"), x + w - 134, innerTop + 28, 110, 36, "#111827", 13);
  } else if (id === "html-css-js") {
    [
      ["HTML", tr("البنية", "structure")],
      ["CSS", tr("الشكل", "look")],
      ["JavaScript", tr("التفاعل", "action")],
    ].forEach(([name, hint], index) => {
      const bx = x + 18 + index * ((w - 36) / 3);
      boxLabel(ctx, `${name} — ${hint}`, bx, innerTop + 20, (w - 48) / 3, 52, color, 12);
    });
  } else if (id === "media") {
    [tr("JPEG صورة", "JPEG photo"), tr("PNG شفافية", "PNG clear"), tr("نص للمراجعة", "Text to check")].forEach(
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
    boxLabel(ctx, "API", x + w / 2 - 40, innerTop + 28, 80, 36, "#111827", 13);
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

function drawBanner(ctx: SKRSContext2D, text: string, color: string, x: number, y: number, w: number, ar: boolean): number {
  roundRect(ctx, x, y, w, 40, 10, color);
  ctx.fillStyle = "#ffffff";
  ctx.font = `18px ${FONT_NAME}`;
  paintText(ctx, text, ar ? x + w - 16 : x + 16, y + 10, ar ? "right" : "left");
  return 54;
}

function drawSection(ctx: SKRSContext2D, text: string, x: number, y: number, w: number, ar: boolean): number {
  roundRect(ctx, x, y, w, 28, 8, "#0c2d6b");
  ctx.fillStyle = "#ffffff";
  ctx.font = `13px ${FONT_NAME}`;
  paintText(ctx, text, ar ? x + w - 14 : x + 14, y + 7, ar ? "right" : "left");
  return 40;
}

function questionLines(ctx: SKRSContext2D, block: QuestionBlock, w: number) {
  const pad = 12;
  const inner = w - pad * 2;
  ctx.font = `13px ${FONT_NAME}`;
  const promptLines = wrap(ctx, `${block.n}. ${block.prompt}`, inner);
  ctx.font = `12px ${FONT_NAME}`;
  const optionLines = block.options.slice(0, 4).map((option, optionIndex) =>
    wrap(ctx, `${block.letters[optionIndex] ?? LETTERS[optionIndex]}  ${option}`, inner - 22),
  );
  const optionsH = optionLines.reduce((sum, lines) => sum + lines.length * 18 + 8, 0);
  return { pad, promptLines, optionLines, h: pad + promptLines.length * 20 + 10 + optionsH + pad };
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
  ctx.fillStyle = "#0b1220";
  ctx.font = `13px ${FONT_NAME}`;
  promptLines.forEach((line, index) => {
    paintText(ctx, line, ar ? x + w - pad : x + pad, y + pad + index * 20, ar ? "right" : "left");
  });
  let oy = y + pad + promptLines.length * 20 + 8;
  optionLines.forEach((lines) => {
    ctx.beginPath();
    ctx.strokeStyle = "#0c2d6b";
    ctx.lineWidth = 1.4;
    ctx.arc(ar ? x + w - pad - 7 : x + pad + 7, oy + 8, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#0c2d6b";
    ctx.font = `12px ${FONT_NAME}`;
    lines.forEach((line, lineIndex) => {
      paintText(
        ctx,
        line,
        ar ? x + w - pad - 22 : x + pad + 22,
        oy + lineIndex * 18,
        ar ? "right" : "left",
      );
    });
    oy += lines.length * 18 + 8;
  });
  return h + 14;
}

function essayHeight(ctx: SKRSContext2D, block: EssayBlock, w: number): number {
  const pad = 12;
  ctx.font = `13px ${FONT_NAME}`;
  return pad + wrap(ctx, `${block.n}) ${block.prompt}`, w - pad * 2).length * 20 + 72;
}

function drawEssayCard(ctx: SKRSContext2D, block: EssayBlock, x: number, y: number, w: number, ar: boolean): number {
  const pad = 12;
  ctx.font = `13px ${FONT_NAME}`;
  const lines = wrap(ctx, `${block.n}) ${block.prompt}`, w - pad * 2);
  const h = essayHeight(ctx, block, w);
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
  ctx.fillStyle = "#0b1220";
  lines.forEach((line, index) => {
    paintText(ctx, line, ar ? x + w - pad : x + pad, y + pad + index * 20, ar ? "right" : "left");
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
  ctx.font = `13px ${FONT_NAME}`;
  const lines = wrap(ctx, text, w - 36);
  const h = lines.length * 20 + 16;
  roundRect(ctx, x, y, w, h, 6, "#fff8e8");
  ctx.strokeStyle = "#f3d48a";
  ctx.stroke();
  ctx.fillStyle = "#ca8a04";
  paintText(ctx, "؟؟", ar ? x + w - 10 : x + 10, y + 8, ar ? "right" : "left");
  ctx.fillStyle = "#0b1220";
  lines.forEach((line, index) => {
    paintText(ctx, line, ar ? x + w - 32 : x + 32, y + 8 + index * 20, ar ? "right" : "left");
  });
  return h + 12;
}

function drawLessonArt(ctx: SKRSContext2D, art: string, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = "#e8eef6";
  ctx.fillRect(x, y, w, h);
  if (art === "lock") {
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(x + w * 0.32, y + h * 0.46, w * 0.36, h * 0.36);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.46, w * 0.12, Math.PI, 0);
    ctx.stroke();
    return;
  }
  if (art === "firewall") {
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(x + 10, y + 16, 46, 28);
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(x + w - 56, y + 16, 46, 28);
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + 20, y + h * 0.55, w - 40, 28);
    return;
  }
  if (art === "nest") {
    ctx.beginPath();
    ctx.fillStyle = "#0c2d6b";
    ctx.arc(x + w / 2, y + h / 2, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "#1d4ed8";
    ctx.arc(x + w / 2, y + h / 2, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "#c4a35a";
    ctx.arc(x + w / 2, y + h / 2, 12, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (art === "web" || art === "http" || art === "html") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 8, y + 12, w - 16, h - 24);
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + 8, y + 12, w - 16, 18);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(x + 16, y + 40, w * 0.55, 8);
    ctx.fillRect(x + 16, y + 54, w * 0.7, 6);
    return;
  }
  if (art === "chart" || art === "regress" || art === "data" || art === "clean") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 8, y + 10, w - 16, h - 20);
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + 22, y + h - 38, 14, 18);
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(x + 42, y + h - 52, 14, 32);
    ctx.fillStyle = "#c4a35a";
    ctx.fillRect(x + 62, y + h - 66, 14, 46);
    return;
  }
  if (art === "neural" || art === "ml" || art === "llm") {
    ctx.fillStyle = "#0c2d6b";
    ctx.beginPath();
    ctx.arc(x + 24, y + 28, 7, 0, Math.PI * 2);
    ctx.arc(x + 24, y + h - 28, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 28, 7, 0, Math.PI * 2);
    ctx.arc(x + w / 2, y + h / 2, 7, 0, Math.PI * 2);
    ctx.arc(x + w / 2, y + h - 28, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c4a35a";
    ctx.beginPath();
    ctx.arc(x + w - 24, y + h / 2, 7, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (art === "ethics") {
    ctx.fillStyle = "#0c2d6b";
    ctx.fillRect(x + w / 2 - 4, y + 16, 8, h - 32);
    ctx.fillStyle = "#111827";
    ctx.fillRect(x + 16, y + h / 2 - 4, w - 32, 8);
    ctx.fillStyle = "#c4a35a";
    ctx.fillRect(x + 16, y + 28, 28, 20);
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(x + w - 44, y + 28, 28, 20);
    return;
  }
  if (art === "incident") {
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + 14);
    ctx.lineTo(x + w - 16, y + h - 16);
    ctx.lineTo(x + 16, y + h - 16);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#111827";
    ctx.fillRect(x + w / 2 - 4, y + 36, 8, 28);
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h - 30, 5, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  [10, 34, 58, 82, 106].forEach((px, index) => {
    ctx.fillStyle = index % 2 ? "#1e293b" : "#334155";
    ctx.fillRect(x + px, y + 14 + (index % 2) * 4, 18, h - 36);
  });
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(x, y + h - 16, w, 16);
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
  const imgW = 168;
  const imgH = 126;
  const imgX = ar ? x + w - imgW : x;
  const textX = ar ? x : x + imgW + 14;
  const textW = w - imgW - 14;
  if (block.src && images.has(block.src)) {
    ctx.drawImage(images.get(block.src)!, imgX, y, imgW, imgH);
  } else {
    drawLessonArt(ctx, block.art, imgX, y, imgW, imgH);
  }
  ctx.fillStyle = "#0c2d6b";
  ctx.font = `14px ${FONT_NAME}`;
  paintText(ctx, `1  ${block.title}`, ar ? textX + textW : textX, y, ar ? "right" : "left");
  ctx.fillStyle = "#334155";
  ctx.font = `12px ${FONT_NAME}`;
  wrap(ctx, block.intro, textW).slice(0, 5).forEach((line, index) => {
    paintText(ctx, line, ar ? textX + textW : textX, y + 28 + index * 18, ar ? "right" : "left");
  });
  return imgH + 16;
}

function colWidths(count: number, w: number): number[] {
  if (count <= 2) return [w * 0.3, w * 0.7];
  return [w * 0.22, w * 0.4, w * 0.38];
}

function tableRowHeight(ctx: SKRSContext2D, cells: string[], widths: number[]): number {
  ctx.font = `12px ${FONT_NAME}`;
  const lines = cells.map((cell, index) => wrap(ctx, cell, (widths[index] ?? widths[0]!) - 14).length);
  return Math.max(32, Math.max(...lines) * 17 + 12);
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
    ctx.font = `12px ${FONT_NAME}`;
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
      ctx.font = `12px ${FONT_NAME}`;
      wrap(ctx, cell, cw - 14).forEach((line, lineIndex) => {
        paintText(ctx, line, ar ? cx + cw - 7 : cx + 7, rowY + 7 + lineIndex * 17, ar ? "right" : "left");
      });
      ox += cw;
    });
    used += rh;
    if (row.example) {
      ctx.font = `12px ${FONT_NAME}`;
      const exampleLines = wrap(ctx, row.example, w - 16);
      const eh = exampleLines.length * 17 + 12;
      ctx.fillStyle = "#fff8e8";
      ctx.fillRect(x, y + used, w, eh);
      ctx.strokeStyle = "#f3d48a";
      ctx.strokeRect(x, y + used, w, eh);
      ctx.fillStyle = "#3f3f46";
      exampleLines.forEach((line, lineIndex) => {
        paintText(ctx, line, ar ? x + w - 8 : x + 8, y + used + 6 + lineIndex * 17, ar ? "right" : "left");
      });
      used += eh;
    }
    index += 1;
  }
  return { h: used + 8, next: index };
}

function drawPoints(ctx: SKRSContext2D, items: string[], x: number, y: number, w: number, ar: boolean): number {
  ctx.font = `12px ${FONT_NAME}`;
  let used = 0;
  items.forEach((item, index) => {
    const lines = wrap(ctx, `${index + 1}. ${item}`, w - 8);
    ctx.fillStyle = "#0b1220";
    lines.forEach((line, lineIndex) => {
      paintText(ctx, line, ar ? x + w : x, y + used + lineIndex * 18, ar ? "right" : "left");
    });
    used += lines.length * 18 + 6;
  });
  return used + 8;
}

function drawTakeaway(ctx: SKRSContext2D, text: string, x: number, y: number, w: number, ar: boolean): number {
  ctx.font = `12px ${FONT_NAME}`;
  const lines = wrap(ctx, text, w - 20);
  const h = lines.length * 18 + 16;
  roundRect(ctx, x, y, w, h, 6, "#fff8e8");
  ctx.strokeStyle = "#f3d48a";
  ctx.stroke();
  ctx.fillStyle = "#0b1220";
  lines.forEach((line, index) => {
    paintText(ctx, line, ar ? x + w - 10 : x + 10, y + 8 + index * 18, ar ? "right" : "left");
  });
  return h + 12;
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
    "html-css-js": ["شكل — HTML و CSS و JavaScript", "Figure — HTML, CSS, JavaScript"],
    media: ["شكل — اختيار الوسيط", "Figure — choose a medium"],
    ux: ["شكل — دورة التجربة", "Figure — UX cycle"],
    collect: ["شكل — جمع البيانات", "Figure — collect data"],
    clean: ["شكل — تنظيف الجدول", "Figure — clean a table"],
    api: ["شكل — API", "Figure — API"],
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

function pushQuestions(blocks: Block[], locale: Locale, rows: BookletChapterPack["practice"]) {
  const letters = bookletLetters(locale);
  rows.forEach((question, index) => {
    blocks.push({
      kind: "question",
      n: index + 1,
      prompt: locale === "ar" ? question.promptAr : question.promptEn,
      options: bookletOptions(locale, question.optionsAr, question.optionsEn),
      letters,
    });
  });
}

function pushChapter(blocks: Block[], pack: BookletChapterPack, locale: Locale) {
  const ar = locale === "ar";
  const chapter = pack.chapter;
  blocks.push({
    kind: "banner",
    text: `${chapter.id}. ${ar ? chapter.titleAr : chapter.titleEn}`,
    color: chapter.color,
  });
  blocks.push({ kind: "text", text: ar ? chapter.blurbAr : chapter.blurbEn, size: 12, gap: 14 });
  const map = mindMapForChapter(chapter.id);
  if (map) {
    blocks.push({ kind: "section", text: ar ? "1 — الخريطة الذهنية" : "1 — Mind map" });
    blocks.push({ kind: "map", root: map, color: chapter.color, accent: chapter.accent });
  }
  const figures = CHAPTER_FIGURES[chapter.id] ?? [];
  if (figures.length) {
    blocks.push({ kind: "section", text: ar ? "2 — الرسوم والأشكال" : "2 — Figures" });
    for (const id of figures) {
      blocks.push({ kind: "figure", id, color: chapter.color, title: figureTitle(id, ar) });
    }
  }
  if (pack.scenes.length) {
    blocks.push({ kind: "section", text: ar ? "3 — مواقف من الحياة" : "3 — Real-life scenes" });
    for (const scene of pack.scenes) {
      const term = ar ? scene.termAr : scene.termEn;
      const text = ar ? scene.sceneAr : scene.sceneEn;
      blocks.push({ kind: "scene", color: chapter.color, term, scene: text, art: sceneArt(term, text) });
    }
  }
  blocks.push({ kind: "section", text: ar ? "4 — شرح الدروس" : "4 — Lesson notes" });
  for (const note of LESSON_NOTES.filter((row) => row.chapterId === chapter.id)) {
    const page = textbookPageFor(note.id);
    if (!page) continue;
    blocks.push({ kind: "break" });
    blocks.push({
      kind: "banner",
      text: `${ar ? "الدرس" : "Lesson"} ${page.id}  ${ar ? page.titleAr : page.titleEn}`,
      color: chapter.color,
    });
    blocks.push({
      kind: "ask",
      text: `${ar ? "السؤال الرئيسي:" : "Main question:"} ${ar ? page.questionAr : page.questionEn}`,
    });
    blocks.push({
      kind: "photo",
      src: page.photo,
      art: page.art,
      title: ar ? page.sectionAr : page.sectionEn,
      intro: ar ? page.introAr : page.introEn,
    });
    const points = ar ? page.pointsAr : page.pointsEn;
    if (points.length) blocks.push({ kind: "points", items: points });
    blocks.push({
      kind: "table",
      headers: ar ? page.headersAr : page.headersEn,
      rows: page.rows.map((row) => ({
        cells: ar ? [...row.cellsAr] : [...row.cellsEn],
        example: ar ? row.exampleAr : row.exampleEn,
      })),
    });
    blocks.push({
      kind: "takeaway",
      text: `${ar ? "الخلاصة:" : "Takeaway:"} ${ar ? page.takeawayAr : page.takeawayEn}`,
    });
  }
  blocks.push({ kind: "section", text: ar ? "5 — تدريبات الفصل" : "5 — Chapter practice" });
  pushQuestions(blocks, locale, pack.practice);
  blocks.push({ kind: "section", text: ar ? "6 — حلّل واكتب" : "6 — Analyse and write" });
  pack.essays.forEach((essay, index) => {
    blocks.push({
      kind: "essay",
      n: index + 1,
      prompt: ar ? essay.promptAr : essay.promptEn,
    });
  });
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
      text: `${ar ? "مقالي" : "Essay"} ${index + 1}: ${guide}`,
      size: 12,
      gap: 10,
    });
  });
}

function pushAnswerKey(
  blocks: Block[],
  locale: Locale,
  rows: { title: string; answers: { index: number }[] }[],
) {
  const ar = locale === "ar";
  blocks.push({ kind: "banner", text: ar ? "مفتاح الإجابة" : "Answer key", color: "#0c2d6b" });
  for (const block of rows) {
    blocks.push({
      kind: "text",
      text: `${block.title}: ${block.answers.map((row, index) => `${index + 1}-${bookletAnswerMark(locale, row.index)}`).join("  ")}`,
      size: 12,
      gap: 10,
    });
  }
}

function buildBlocks(locale: Locale, scope: BookletScope): Block[] {
  const ar = locale === "ar";
  const blocks: Block[] = [
    { kind: "banner", text: ar ? BRAND.nameAr : BRAND.nameEn, color: "#0c2d6b" },
    { kind: "text", text: ar ? "ملزمة الطالب — البرمجة والذكاء الاصطناعي" : "Student booklet — Programming & AI", size: 20, gap: 10 },
    { kind: "text", text: `${ar ? BRAND.teacherAr : BRAND.teacherEn} · 2026–2027`, size: 13, gap: 12 },
  ];

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
          blocks.push({ kind: "text", text: `• ${body}`, size: 12, gap: 8 });
        }
      }
      pushQuestions(blocks, locale, pack.practice);
    }
    const homework = bookletFaizHomework();
    blocks.push({ kind: "banner", text: ar ? homework.titleAr : homework.titleEn, color: "#92400e" });
    pushQuestions(blocks, locale, homework.mcq);
    homework.essays.forEach((essay, index) => {
      blocks.push({ kind: "essay", n: index + 1, prompt: ar ? essay.promptAr : essay.promptEn });
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

  const chapter = getChapter(scope);
  if (!chapter) return blocks;
  const pack = bookletChapterPack(chapter);
  const homework = bookletHomeworkForChapter(chapter);
  blocks.push({
    kind: "text",
    text: ar ? `ملزمة الفصل ${chapter.id} — ${chapter.titleAr}` : `Chapter ${chapter.id} booklet — ${chapter.titleEn}`,
    size: 16,
    gap: 16,
  });
  pushChapter(blocks, pack, locale);
  blocks.push({ kind: "banner", text: ar ? homework.titleAr : homework.titleEn, color: "#92400e" });
  pushQuestions(blocks, locale, homework.mcq);
  homework.essays.forEach((essay, index) => {
    blocks.push({ kind: "essay", n: index + 1, prompt: ar ? essay.promptAr : essay.promptEn });
  });
  pushAnswerKey(blocks, locale, [
    { title: ar ? "تدريبات الفصل" : "Chapter practice", answers: pack.answers },
    { title: ar ? homework.titleAr : homework.titleEn, answers: homework.answers },
  ]);
  pushEssayGuides(blocks, locale, ar ? "مقالي التدريبات" : "Practice essays", pack.essays);
  pushEssayGuides(blocks, locale, ar ? "مقالي الواجب" : "Homework essays", homework.essays);
  return blocks;
}

export async function buildBookletPdf(locale: Locale, scope: BookletScope): Promise<Uint8Array> {
  ensureFont();
  const ar = locale === "ar";
  const margin = 40;
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

  const flush = async () => {
    const page = pdf.addPage([PAGE_W, PAGE_H]);
    const image = await pdf.embedJpg(canvas.toBuffer("image/jpeg", 92));
    page.drawImage(image, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
  };

  const need = (h: number, y: number) => {
    return y + h > PAGE_H - margin;
  };

  const textX = ar ? PAGE_W - margin : margin;
  const textAlign = ar ? "right" : "left";
  const images = new Map<string, Image>();
  for (const block of blocks) {
    if (block.kind === "photo" && block.src && !images.has(block.src)) {
      images.set(block.src, await loadImage(path.join(process.cwd(), "public", block.src.replace(/^\//, ""))));
    }
  }

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
      if (need(54, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawBanner(ctx, block.text, block.color, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "section") {
      if (need(40, y)) {
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
      const h = 230;
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
      ctx.font = `13px ${FONT_NAME}`;
      const h = wrap(ctx, block.text, maxWidth - 36).length * 20 + 28;
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawAsk(ctx, block.text, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "points") {
      ctx.font = `12px ${FONT_NAME}`;
      const h = block.items.reduce((sum, item) => sum + wrap(ctx, item, maxWidth).length * 18 + 6, 16);
      if (need(Math.min(h, 80), y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawPoints(ctx, block.items, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "takeaway") {
      ctx.font = `12px ${FONT_NAME}`;
      const h = wrap(ctx, block.text, maxWidth - 20).length * 18 + 28;
      if (need(h, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += drawTakeaway(ctx, block.text, margin, y, maxWidth, ar);
      continue;
    }
    if (block.kind === "photo") {
      if (need(150, y)) {
        await flush();
        reset();
        y = margin;
      }
      y += await drawPhoto(ctx, block, margin, y, maxWidth, ar, images);
      continue;
    }
    if (block.kind === "table") {
      let from = 0;
      let header = true;
      while (from < block.rows.length) {
        const row = block.rows[from]!;
        ctx.font = `12px ${FONT_NAME}`;
        const widths = colWidths(block.headers.length, maxWidth);
        const exampleH = row.example ? wrap(ctx, row.example, maxWidth - 16).length * 17 + 12 : 0;
        const h = (header ? 30 : 0) + tableRowHeight(ctx, row.cells, widths) + exampleH + 10;
        if (need(h, y)) {
          await flush();
          reset();
          y = margin;
          header = true;
        }
        const drawn = drawTable(ctx, block, margin, y, maxWidth, ar, header, from, 1);
        y += drawn.h;
        header = false;
        from = drawn.next;
      }
      continue;
    }
    if (need(96, y)) {
      await flush();
      reset();
      y = margin;
    }
    y += drawScene(ctx, block, margin, y, maxWidth);
  }
  await flush();
  return pdf.save();
}

export function bookletFileName(locale: Locale, scope: BookletScope): string {
  if (scope === "faiz") return locale === "ar" ? "ملزمة-الفائز-MindSoft-2027.pdf" : "MindSoft-faiz-2027.pdf";
  return locale === "ar" ? `ملزمة-الفصل-${scope}-MindSoft-2027.pdf` : `MindSoft-chapter-${scope}-2027.pdf`;
}
