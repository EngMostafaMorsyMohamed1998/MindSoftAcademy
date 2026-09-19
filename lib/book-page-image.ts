import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { createCanvas } from "@napi-rs/canvas";
import { getLesson } from "@/lib/curriculum";
import { lessonPdfPages } from "@/lib/book-pages";
import type { Locale } from "@/lib/locale";
import { BOOKS, FAIZ_BOOK } from "@/lib/library";

export { lessonPdfPages };

const cache = new Map<string, Buffer>();

function ministryFile(locale: Locale, part: 1 | 2): string {
  return `programming-ai-${locale}-part${part}.pdf`;
}

async function pdfBytes(fileName: string, remote: string): Promise<Buffer> {
  const cached = cache.get(fileName);
  if (cached) return cached;
  const local = path.join(process.cwd(), "public", "books", fileName);
  try {
    const bytes = await readFile(local);
    if (bytes.length > 0) {
      cache.set(fileName, bytes);
      return bytes;
    }
  } catch {
    /* fall through to remote */
  }
  const tmp = path.join("/tmp", "mindsoft-books", fileName);
  try {
    const bytes = await readFile(tmp);
    if (bytes.length > 0) {
      cache.set(fileName, bytes);
      return bytes;
    }
  } catch {
    /* download */
  }
  const response = await fetch(remote);
  if (!response.ok) throw new Error(`book ${fileName} ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await mkdir(path.dirname(tmp), { recursive: true });
  await writeFile(tmp, bytes);
  cache.set(fileName, bytes);
  return bytes;
}

async function sourceForLesson(locale: Locale, lessonId: string): Promise<{ file: string; remote: string; pages: number[] } | null> {
  const lesson = getLesson(lessonId);
  if (!lesson) return null;
  const file = ministryFile(locale, lesson.part);
  const book = BOOKS.find((item) => item.file.endsWith(file));
  return {
    file,
    remote: book?.sourceUrl ?? "",
    pages: lessonPdfPages(lessonId),
  };
}

export async function renderBookPage(locale: Locale, lessonId: string, offset = 0): Promise<Buffer | null> {
  try {
    return await rasterBookPage(locale, lessonId, offset);
  } catch {
    return null;
  }
}

async function rasterBookPage(locale: Locale, lessonId: string, offset = 0): Promise<Buffer | null> {
  const source = await sourceForLesson(locale, lessonId);
  if (!source || !source.pages.length || !source.remote) return null;
  const pageNo = source.pages[Math.min(offset, source.pages.length - 1)] ?? source.pages[0]!;
  const key = `${source.file}:${pageNo}`;
  const disk = path.join("/tmp", "mindsoft-book-pages", `${createHash("sha1").update(key).digest("hex")}.png`);
  try {
    const hit = await readFile(disk);
    if (hit.length > 0) return hit;
  } catch {
    /* render */
  }

  const bytes = await pdfBytes(source.file, source.remote);
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const task = pdfjs.getDocument({
    data: Uint8Array.from(bytes),
    disableFontFace: false,
    isOffscreenCanvasSupported: false,
    verbosity: 0,
  });
  const doc = await task.promise;
  try {
    if (pageNo < 1 || pageNo > doc.numPages) return null;
    const page = await doc.getPage(pageNo);
    const viewport = page.getViewport({ scale: 1.35 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({
      canvas: canvas as unknown as HTMLCanvasElement,
      canvasContext: ctx as unknown as CanvasRenderingContext2D,
      viewport,
    }).promise;
    const png = canvas.toBuffer("image/png");
    await mkdir(path.dirname(disk), { recursive: true });
    await writeFile(disk, png);
    return png;
  } finally {
    doc.cleanup?.();
  }
}

export async function faizBookPage(pageNo: number): Promise<Buffer | null> {
  const bytes = await pdfBytes(path.basename(FAIZ_BOOK.file), FAIZ_BOOK.sourceUrl);
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const task = pdfjs.getDocument({
    data: Uint8Array.from(bytes),
    isOffscreenCanvasSupported: false,
    verbosity: 0,
  });
  const doc = await task.promise;
  try {
    if (pageNo < 1 || pageNo > doc.numPages) return null;
    const page = await doc.getPage(pageNo);
    const viewport = page.getViewport({ scale: 1.2 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({
      canvas: canvas as unknown as HTMLCanvasElement,
      canvasContext: ctx as unknown as CanvasRenderingContext2D,
      viewport,
    }).promise;
    return canvas.toBuffer("image/png");
  } finally {
    doc.cleanup?.();
  }
}
