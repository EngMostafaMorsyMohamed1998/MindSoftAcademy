import { signToken, verifyToken } from "@/lib/crypto-token";

type TeacherPayload = { role: "teacher"; at: number };

export function teacherToken(): string {
  return signToken({ role: "teacher", at: Date.now() } satisfies TeacherPayload);
}

export function isTeacherToken(token: string | undefined): boolean {
  if (!token) return false;
  const payload = verifyToken<TeacherPayload>(token);
  return payload?.role === "teacher";
}
