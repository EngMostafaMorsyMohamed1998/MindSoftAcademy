import { spawnSync } from "node:child_process";
import { applyPrismaEnv, hasLiveDatabase } from "./prisma-env.mjs";

applyPrismaEnv(process.env);

if (!hasLiveDatabase(process.env)) {
  console.log("Skipping prisma migrate deploy (no live DATABASE_URL).");
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

if ((result.status ?? 1) !== 0) {
  console.warn("prisma migrate deploy failed; continuing so Vercel can still finish next build.");
}

process.exit(0);
