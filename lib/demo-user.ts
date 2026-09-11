/**
 * Kept free of imports so seed scripts and server code can both read it
 * without pulling in the Prisma client.
 */
export const DEMO_USER_EMAIL =
  process.env.DEMO_USER_EMAIL ?? "amira@lumina.local";
