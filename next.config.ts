import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  serverExternalPackages: [
    "@prisma/client",
    "@google/generative-ai",
    "bcryptjs",
    "@napi-rs/canvas",
    "pdfjs-dist",
  ],
  outputFileTracingIncludes: {
    "/api/booklet": ["./fonts/**/*", "./public/booklet/**/*", "./public/books/programming-ai-ar-assessments-1.pdf"],
    "/api/book-page": ["./fonts/**/*", "./public/books/programming-ai-ar-assessments-1.pdf"],
  },
};

export default nextConfig;
