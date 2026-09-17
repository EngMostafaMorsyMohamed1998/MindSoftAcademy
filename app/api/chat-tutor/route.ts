import { NextResponse } from "next/server";
import { getBook } from "@/lib/library";
import { askTutor, TutorError } from "@/lib/tutor";

export const runtime = "nodejs";

function asOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body === null || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const message = asOptionalString(payload.message);
  const bookSlug = asOptionalString(payload.bookSlug);
  const currentTopic = asOptionalString(payload.currentTopic);
  const bookContext = asOptionalString(payload.bookContext);

  if (!message) {
    return NextResponse.json(
      { error: "message is required." },
      { status: 400 },
    );
  }

  if (bookSlug && !getBook(bookSlug)) {
    return NextResponse.json(
      { error: "Unknown bookSlug." },
      { status: 404 },
    );
  }

  try {
    const reply = await askTutor({
      message,
      bookSlug,
      currentTopic,
      bookContext,
    });
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("POST /api/chat-tutor failed", error);

    if (error instanceof TutorError) {
      return NextResponse.json(
        { error: error.message, code: error.kind },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "حدث خطأ أثناء التواصل مع المعلم الذكي." },
      { status: 500 },
    );
  }
}
