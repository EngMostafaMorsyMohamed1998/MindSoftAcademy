import { spawnSync } from "node:child_process";
import { applyPrismaEnv } from "./prisma-env.mjs";

applyPrismaEnv(process.env);

const result = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
