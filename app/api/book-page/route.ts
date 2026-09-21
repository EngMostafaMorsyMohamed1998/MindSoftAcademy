import { NextResponse } from "next/server";
import { ASSESS_PAGES } from "@/lib/assessments";
import { renderAssessmentsPage, renderBookPage } from "@/lib/book-page-image";
import { getCurrentUser } from "@/lib/current-user";
import { getLesson } from "@/lib/curriculum";
import type { Locale } from "@/lib/locale";

export const runtime = "nodejs";
export const maxDuration = 60;

const ASSESS_PAGE_SET = new Set(Object.values(ASSESS_PAGES).flat());

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  if (url.searchParams.get("book") === "assess") {
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "0") || 0);
    if (!ASSESS_PAGE_SET.has(page)) return NextResponse.json({ error: "page" }, { status: 400 });
    let png: Buffer | null = null;
    try {
      png = await renderAssessmentsPage(page);
    } catch {
      png = null;
    }
    if (!png) return NextResponse.json({ error: "page" }, { status: 404 });
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=86400",
      },
    });
  }
  const lessonId = url.searchParams.get("lesson") ?? "";
  if (!getLesson(lessonId)) return NextResponse.json({ error: "lesson" }, { status: 400 });
  const locale: Locale = url.searchParams.get("lang") === "en" ? "en" : "ar";
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? "0") || 0);
  let png: Buffer | null = null;
  try {
    png = await renderBookPage(locale, lessonId, offset);
  } catch {
    png = null;
  }
  if (!png) return NextResponse.json({ error: "page" }, { status: 404 });
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, max-age=86400",
    },
  });
}
