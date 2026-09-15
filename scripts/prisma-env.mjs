export function applyPrismaEnv(env = process.env) {
  const database =
    env.DATABASE_URL ||
    env.POSTGRES_PRISMA_URL ||
    env.POSTGRES_URL ||
    env.PRISMA_DATABASE_URL;
  const direct =
    env.DIRECT_URL ||
    env.DATABASE_URL_UNPOOLED ||
    env.POSTGRES_URL_NON_POOLING ||
    env.POSTGRES_URL ||
    database;

  if (database) env.DATABASE_URL = database;
  if (direct) env.DIRECT_URL = direct;
  if (!env.DATABASE_URL) {
    env.DATABASE_URL =
      "postgresql://build:build@127.0.0.1:5432/build?schema=public";
  }
  if (!env.DIRECT_URL) env.DIRECT_URL = env.DATABASE_URL;
  return env;
}

export function hasLiveDatabase(env = process.env) {
  applyPrismaEnv(env);
  const url = env.DATABASE_URL || "";
  return Boolean(url) && !url.includes("build:build@127.0.0.1");
}
