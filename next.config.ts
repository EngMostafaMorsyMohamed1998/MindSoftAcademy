import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@google/generative-ai",
    "bcryptjs",
  ],
};

export default nextConfig;
