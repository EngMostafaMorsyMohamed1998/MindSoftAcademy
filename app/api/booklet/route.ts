import { NextResponse } from "next/server";
import { bookletFileName, buildBookletPdf } from "@/lib/booklet-pdf";
import { isBookletScope } from "@/lib/booklet-pack";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale, isLocale } from "@/lib/locale";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const asked = url.searchParams.get("lang");
  const locale = isLocale(asked) ? asked : await getLocale();
  const scope = url.searchParams.get("chapter");
  if (!isBookletScope(scope)) {
    return NextResponse.json({ error: "اختر فصل الملزمة" }, { status: 400 });
  }
  const pdf = await buildBookletPdf(locale, scope);
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(bookletFileName(locale, scope))}`,
      "Cache-Control": "private, no-store",
    },
  });
}
