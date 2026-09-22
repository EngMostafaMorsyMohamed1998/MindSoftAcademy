import { PrismaClient } from "@prisma/client";

const runtimeDatabaseUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  "";
if (runtimeDatabaseUrl) process.env.DATABASE_URL = runtimeDatabaseUrl;
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    "";
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  return runtimeDatabaseUrl
    ? new PrismaClient({ datasources: { db: { url: runtimeDatabaseUrl } } })
    : new PrismaClient();
}

/** True when this process still holds a client generated from an older schema. */
function isCurrentSchema(client: PrismaClient) {
  return (
    typeof client.user?.findUnique === "function" &&
    typeof client.account?.findUnique === "function" &&
    typeof client.classCode?.findMany === "function"
  );
}

const existing = globalForPrisma.prisma;
export const prisma =
  existing && isCurrentSchema(existing) ? existing : createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
