import { hashPassword } from "@/lib/auth-password";
import { DEMO_USER_EMAIL } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";
import { avatarUrlForName } from "@/lib/student-profile";

const DEMO_USER_NAME = "Amira Hassan";

function demoPassword() {
  return process.env.DEMO_USER_PASSWORD ?? "lumina-demo";
}

/**
 * Guest / demo sign-in. Reuses `amira@lumina.local` and guarantees a password
 * so email login keeps working after a reseed.
 */
export async function ensureDemoUser() {
  const existing = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      points: true,
      passwordHash: true,
    },
  });

  if (existing) {
    if (!existing.passwordHash || !existing.image) {
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash: existing.passwordHash ?? (await hashPassword(demoPassword())),
          image: existing.image ?? avatarUrlForName(existing.name),
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          points: true,
        },
      });
      return updated;
    }

    return {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      image: existing.image,
      points: existing.points,
    };
  }

  return prisma.user.create({
    data: {
      email: DEMO_USER_EMAIL,
      name: DEMO_USER_NAME,
      image: avatarUrlForName(DEMO_USER_NAME),
      passwordHash: await hashPassword(demoPassword()),
      points: 0,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      points: true,
    },
  });
}
