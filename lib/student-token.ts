import { signToken, verifyToken } from "@/lib/crypto-token";

export type StudentSession = {
  id: string;
  name: string;
  phone: string;
};

export function encodeStudentSession(payload: StudentSession): string {
  return signToken(payload);
}

export function readStudentToken(token: string | undefined): StudentSession | null {
  if (!token) return null;
  return verifyToken<StudentSession>(token);
}
