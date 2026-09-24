import path from "path";

/**
 * Where the class store keeps its files. A long-lived Node host can hold them
 * between restarts, while a serverless function only ever gets /tmp. Set
 * DATA_DIR to a mounted disk to survive a redeploy.
 */
export function dataDir(): string {
  const configured = process.env.DATA_DIR?.trim();
  if (configured) return configured;
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) return "/tmp";
  return path.join(process.cwd(), "data");
}

export function dataPath(...parts: string[]): string {
  return path.join(dataDir(), ...parts);
}
