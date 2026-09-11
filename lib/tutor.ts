import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import { getBook, SUBJECT } from "@/lib/library";

export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
const GEMINI_FALLBACK_MODEL = "gemini-2.0-flash";

export type TutorRequest = {
  message: string;
  bookSlug?: string;
  currentTopic?: string;
  bookContext?: string;
};

export type TutorErrorKind = "missing_key" | "rate_limited" | "unavailable";

export class TutorError extends Error {
  readonly kind: TutorErrorKind;
  readonly status: number;

  constructor(kind: TutorErrorKind, message: string, status: number) {
    super(message);
    this.name = "TutorError";
    this.kind = kind;
    this.status = status;
  }
}

export function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function tutorSystemPrompt(input: TutorRequest): string {
  const book = input.bookSlug ? getBook(input.bookSlug) : undefined;
  const bookLine = book
    ? `الطالب يقرأ «${book.title}» (${book.titleEn}) — ${SUBJECT.track}، ${SUBJECT.grade}، ${SUBJECT.year}.`
    : `الطالب يدرس منهج الثانية بكالوريا (${SUBJECT.year}) في ${SUBJECT.track}.`;
  const topicLine = input.currentTopic
    ? `الموضوع الحالي: ${input.currentTopic}.`
    : "لم يُحدد موضوع الصفحة — استنتجه من السؤال إن أمكن.";

  return [
    "أنت معلم ذكي ومحفز لمادة الثانية بكالوريا (2 Bac) على منصة Lumina.",
    "أجب بأسلوب بسيط ومباشر، واعتمد على السياق المرفق من الكتاب المدرسي.",
    "Prefer Arabic when the student writes in Arabic; otherwise reply in English.",
    "Stay inside the official syllabus. If you are unsure, say so and point to the relevant textbook section.",
    "Never invent exam marks, ministry circulars, or page numbers you cannot see.",
    bookLine,
    topicLine,
  ].join("\n");
}

export function bookContextFromRequest(input: TutorRequest): string {
  if (input.bookContext?.trim()) {
    return input.bookContext.trim();
  }

  const book = input.bookSlug ? getBook(input.bookSlug) : undefined;
  const lines = [
    `${SUBJECT.title} / ${SUBJECT.titleEn}`,
    `${SUBJECT.track} · ${SUBJECT.grade} · ${SUBJECT.year}`,
  ];

  if (book) {
    lines.push(`${book.title} / ${book.titleEn}`);
    lines.push(`Language: ${book.language === "ar" ? "Arabic" : "English"}`);
    lines.push(`Part ${book.part}`);
  }

  if (input.currentTopic?.trim()) {
    lines.push(`Topic: ${input.currentTopic.trim()}`);
  }

  return lines.join("\n");
}

function geminiHttpStatus(error: unknown): number | undefined {
  if (error instanceof GoogleGenerativeAIFetchError) {
    return error.status;
  }
  return undefined;
}

function mapGeminiError(error: unknown): TutorError {
  const status = geminiHttpStatus(error);

  if (status === 429) {
    return new TutorError(
      "rate_limited",
      "وصلت إلى حد الاستخدام لـ Gemini. انتظر دقيقة ثم أعد المحاولة.",
      429,
    );
  }

  if (status === 401 || status === 403) {
    return new TutorError(
      "missing_key",
      "مفتاح GEMINI_API_KEY غير صالح. تحقق منه في ملف .env.",
      503,
    );
  }

  return new TutorError(
    "unavailable",
    "حدث خطأ أثناء التواصل مع المعلم الذكي.",
    502,
  );
}

async function generateWithModel(
  genAI: GoogleGenerativeAI,
  modelName: string,
  systemInstruction: string,
  prompt: string,
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  if (!text) {
    throw new TutorError(
      "unavailable",
      "حدث خطأ أثناء التواصل مع المعلم الذكي.",
      502,
    );
  }
  return text;
}

export async function askTutor(input: TutorRequest): Promise<string> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new TutorError(
      "missing_key",
      "مفتاح GEMINI_API_KEY غير مضبوط. أضفه إلى ملف .env ثم أعد تشغيل الخادم.",
      503,
    );
  }

  const genAI = new GoogleGenerativeAI(key);
  const systemInstruction = tutorSystemPrompt(input);
  const prompt = `سياق الدرس/الكتاب:\n${bookContextFromRequest(input)}\n\nسؤال الطالب:\n${input.message}`;

  try {
    return await generateWithModel(
      genAI,
      GEMINI_MODEL,
      systemInstruction,
      prompt,
    );
  } catch (error) {
    if (error instanceof TutorError) {
      throw error;
    }

    const status = geminiHttpStatus(error);
    if (status === 429 || status === 401 || status === 403) {
      throw mapGeminiError(error);
    }

    // gemini-1.5-flash is retired on some keys; retry once with a current Flash model.
    if (status === 404 && GEMINI_MODEL !== GEMINI_FALLBACK_MODEL) {
      try {
        return await generateWithModel(
          genAI,
          GEMINI_FALLBACK_MODEL,
          systemInstruction,
          prompt,
        );
      } catch (fallbackError) {
        throw fallbackError instanceof TutorError
          ? fallbackError
          : mapGeminiError(fallbackError);
      }
    }

    throw mapGeminiError(error);
  }
}
