import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@google/generative-ai",
    "bcryptjs",
    "@napi-rs/canvas",
  ],
  outputFileTracingIncludes: {
    "/api/booklet": ["./fonts/**/*", "./public/booklet/**/*"],
  },
};

export default nextConfig;
