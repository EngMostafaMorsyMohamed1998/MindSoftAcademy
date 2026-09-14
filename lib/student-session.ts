import { cookies } from "next/headers";
import { getCodeById, type AccessCode } from "@/lib/access-store";
import { STUDENT_COOKIE } from "@/lib/session-cookies";
import {
  encodeStudentSession,
  readStudentToken,
  type StudentSession,
} from "@/lib/student-token";

export { STUDENT_COOKIE, encodeStudentSession, readStudentToken };
export type { StudentSession };

export async function getStudentSession(): Promise<(StudentSession & { points: number }) | null> {
  const store = await cookies();
  const session = readStudentToken(store.get(STUDENT_COOKIE)?.value);
  if (!session) return null;
  const record = await getCodeById(session.id);
  if (!record) return null;
  return { ...session, name: record.name, phone: record.phone, points: record.points };
}

export async function setStudentCookie(record: AccessCode) {
  const store = await cookies();
  store.set(STUDENT_COOKIE, encodeStudentSession({
    id: record.id,
    name: record.name,
    phone: record.phone,
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
}

export async function clearStudentCookie() {
  const store = await cookies();
  store.delete(STUDENT_COOKIE);
}
