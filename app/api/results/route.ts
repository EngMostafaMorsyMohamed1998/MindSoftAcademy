import { NextResponse } from "next/server";
import { getRecommendedCapsule } from "@/lib/adaptive-learning";
import { getCurrentUser } from "@/lib/current-user";
import { gradeQuiz, type AnswerRecord } from "@/lib/grade-quiz";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }
  return value.trim();
}

function parseAnswers(value: unknown): AnswerRecord | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const answers: AnswerRecord = {};
  for (const [questionId, selected] of Object.entries(value)) {
    const id = questionId.trim();
    if (!id) return null;
    if (typeof selected === "number" && Number.isFinite(selected)) {
      answers[id] = String(selected);
      continue;
    }
    if (typeof selected !== "string" || selected.trim().length === 0) {
      return null;
    }
    answers[id] = selected.trim();
  }

  return Object.keys(answers).length > 0 ? answers : null;
}

function isPrismaNotFound(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  const code = "code" in error ? error.code : undefined;
  return code === "P2025" || code === "P2003";
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

  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const userId = sessionUser.id;

  const payload = body as Record<string, unknown>;
  const capsuleId = asNonEmptyString(payload.capsuleId);
  const answers = parseAnswers(payload.answers);

  if (capsuleId === null || answers === null) {
    return NextResponse.json(
      {
        error:
          "capsuleId and answers (a non-empty { [questionId]: selectedOption } map) are required.",
      },
      { status: 400 },
    );
  }

  if (typeof prisma.user?.findUnique !== "function") {
    return NextResponse.json(
      {
        error:
          "Prisma client is out of date. Stop the Next.js server, run `npx prisma generate`, and start it again.",
      },
      { status: 503 },
    );
  }

  try {
    const [user, capsule] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      }),
      prisma.capsule.findUnique({
        where: { id: capsuleId },
        select: {
          id: true,
          questions: {
            select: { id: true, options: true, correctAnswer: true },
          },
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found." }, { status: 404 });
    }

    if (capsule.questions.length === 0) {
      return NextResponse.json(
        { error: "This capsule has no questions to grade." },
        { status: 400 },
      );
    }

    const knownIds = new Set(
      capsule.questions.map((question: { id: string }) => question.id),
    );
    const unknownId = Object.keys(answers).find((id) => !knownIds.has(id));
    if (unknownId) {
      return NextResponse.json(
        {
          error: "One or more answers do not belong to this capsule.",
          questionId: unknownId,
        },
        { status: 400 },
      );
    }

    const graded = gradeQuiz(capsule.questions, answers);

    await prisma.$transaction([
      prisma.quizResult.create({
        data: {
          userId,
          capsuleId,
          score: graded.score,
          totalQuestions: graded.total,
        } as never,
      }),
      prisma.user.update({
        where: { id: userId },
        data: { points: { increment: graded.pointsEarned } },
      }),
    ]);

    const nextRecommendation = await getRecommendedCapsule(
      userId,
      capsuleId,
      graded.percentage,
    );

    return NextResponse.json(
      {
        score: graded.score,
        total: graded.total,
        percentage: graded.percentage,
        pointsEarned: graded.pointsEarned,
        nextRecommendation,
      },
      { status: 201 },
    );
  } catch (error) {
    if (isPrismaNotFound(error)) {
      return NextResponse.json(
        { error: "User or capsule no longer exists." },
        { status: 404 },
      );
    }

    console.error("POST /api/results failed", error);
    return NextResponse.json(
      { error: "Could not save quiz result." },
      { status: 500 },
    );
  }
}
