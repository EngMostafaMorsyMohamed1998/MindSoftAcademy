import { NextResponse } from "next/server";
import { bookletFileName, buildBookletPdf } from "@/lib/booklet-pdf";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale, isLocale } from "@/lib/locale";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const asked = new URL(request.url).searchParams.get("lang");
  const locale = isLocale(asked) ? asked : await getLocale();
  const pdf = await buildBookletPdf(locale);
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(bookletFileName(locale))}`,
      "Cache-Control": "private, no-store",
    },
  });
}
