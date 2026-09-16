import { readFileSync } from "fs";
import path from "path";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { PDFDocument } from "pdf-lib";

const FONT_NAME = "NotoNaskh";
const arabicRe = /[\u0600-\u06FF]/;

let fontReady = false;

function ensureFont() {
  if (fontReady) return;
  GlobalFonts.registerFromPath(path.join(process.cwd(), "fonts/NotoNaskhArabic-Regular.ttf"), FONT_NAME);
  fontReady = true;
}

export async function buildReportPdf(title: string, body: string): Promise<Uint8Array> {
  ensureFont();
  const scale = 2;
  const width = 595 * scale;
  const height = 842 * scale;
  const margin = 48 * scale;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#0b1220";
  ctx.textBaseline = "top";

  const lines = [title, "", ...body.replace(/\r/g, "").split("\n")].slice(0, 28);
  let y = margin;
  for (const [index, line] of lines.entries()) {
    const arabic = arabicRe.test(line);
    const size = index === 0 ? 36 : 28;
    ctx.font = `${size}px ${FONT_NAME}`;
    if (!line) {
      y += 18;
      continue;
    }
    if (arabic) {
      ctx.direction = "rtl";
      ctx.textAlign = "right";
      ctx.fillText(line, width - margin, y, width - margin * 2);
    } else {
      ctx.direction = "ltr";
      ctx.textAlign = "left";
      ctx.fillText(line, margin, y, width - margin * 2);
    }
    y += size + 14;
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const image = await pdf.embedPng(canvas.toBuffer("image/png"));
  page.drawImage(image, { x: 0, y: 0, width: 595, height: 842 });
  return pdf.save();
}
