/**
 * The platform has no auth yet, so the signed-in student is a fixed demo
 * account. Swap `getCurrentUser` for a real session lookup when auth lands —
 * callers only depend on the returned shape.
 */
import { prisma } from "@/lib/prisma";
import { DEMO_USER_EMAIL } from "@/lib/demo-user";

export { DEMO_USER_EMAIL };

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  points: number;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  return prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true, name: true, email: true, points: true },
  });
}
