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

process.exit(result.status ?? 1);
