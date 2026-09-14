import { auth } from "@/auth";
import { getStudentSession } from "@/lib/student-session";
import { prisma } from "@/lib/prisma";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  points: number;
  image: string | null;
  phone?: string;
  via: "code" | "account";
};

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  points: true,
  image: true,
} as const;

export async function getSessionUserId(): Promise<string | null> {
  const student = await getStudentSession();
  if (student) return student.id;
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const student = await getStudentSession();
  if (student) {
    return {
      id: student.id,
      name: student.name,
      email: `${student.phone}@student.morsylab.local`,
      points: student.points,
      image: null,
      phone: student.phone,
      via: "code",
    };
  }

  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email?.trim().toLowerCase();

    if (userId) {
      const byId = await prisma.user.findUnique({
        where: { id: userId },
        select: USER_SELECT,
      });
      if (byId) return { ...byId, via: "account" };
    }

    if (email) {
      const byEmail = await prisma.user.findUnique({
        where: { email },
        select: USER_SELECT,
      });
      if (byEmail) return { ...byEmail, via: "account" };
    }
  } catch {
    return null;
  }

  return null;
}

export async function hasPlatformAccess(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}
