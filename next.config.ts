import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@google/generative-ai",
    "bcryptjs",
    "@napi-rs/canvas",
  ],
};

export default nextConfig;
