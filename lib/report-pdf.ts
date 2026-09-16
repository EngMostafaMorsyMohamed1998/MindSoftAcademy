import { readFileSync } from "fs";
import path from "path";
import reshaper from "arabic-persian-reshaper";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";

const arabicRe = /[\u0600-\u06FF]/;
const latinRe = /[A-Za-z]/;

function rtlGlyphs(text: string): string {
  return [...reshaper.ArabicShaper.convertArabic(text)].reverse().join("");
}

function splitMixed(line: string): { rtl: string; ltr: string } {
  if (!arabicRe.test(line)) return { rtl: "", ltr: line };
  if (!latinRe.test(line)) return { rtl: line, ltr: "" };
  const match = line.match(/^(.*?)([A-Za-z][A-Za-z0-9 ._-]*)$/);
  if (match?.[1]?.trim() && match[2]?.trim()) {
    return { rtl: match[1].replace(/[—–-]\s*$/, "").trim(), ltr: match[2].trim() };
  }
  return { rtl: line, ltr: "" };
}

function wrapLines(text: string): string[] {
  const lines: string[] = [];
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw || " ";
    if (line.length <= 52) {
      lines.push(line);
      continue;
    }
    const words = line.split(/\s+/);
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length > 52 && current) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
  }
  return lines.slice(0, 60);
}

function drawLine(
  page: PDFPage,
  font: PDFFont,
  y: number,
  raw: string,
  pageWidth: number,
  margin: number,
  size: number,
) {
  const ink = rgb(0.05, 0.08, 0.15);
  const { rtl, ltr } = splitMixed(raw);
  if (ltr) {
    page.drawText(ltr, { x: margin, y, size, font, color: ink });
  }
  if (rtl) {
    const visual = rtlGlyphs(rtl);
    const width = font.widthOfTextAtSize(visual, size);
    page.drawText(visual, {
      x: Math.max(margin, pageWidth - margin - width),
      y,
      size,
      font,
      color: ink,
    });
  }
}

export async function buildReportPdf(title: string, body: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const fontBytes = readFileSync(path.join(process.cwd(), "fonts/NotoNaskhArabic-Regular.ttf"));
  const font = await pdf.embedFont(fontBytes, { subset: false });
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 48;
  const size = 15;
  const lineHeight = 26;
  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  for (const raw of [title, "", ...wrapLines(body)]) {
    if (y < margin) {
      page = pdf.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    if (raw) drawLine(page, font, y, raw, pageWidth, margin, raw === title ? 20 : size);
    y -= lineHeight;
  }
  return pdf.save();
}
