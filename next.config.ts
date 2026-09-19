import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@google/generative-ai",
    "bcryptjs",
    "@napi-rs/canvas",
    "pdfjs-dist",
  ],
  outputFileTracingIncludes: {
    "/api/booklet": ["./fonts/**/*", "./public/booklet/**/*"],
    "/api/book-page": ["./fonts/**/*"],
  },
};

export default nextConfig;
