import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  return new PrismaClient();
}

/** True when this process still holds a client generated from an older schema. */
function isCurrentSchema(client: PrismaClient) {
  return (
    typeof client.user?.findUnique === "function" &&
    typeof client.account?.findUnique === "function"
  );
}

const existing = globalForPrisma.prisma;
export const prisma =
  existing && isCurrentSchema(existing) ? existing : createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
