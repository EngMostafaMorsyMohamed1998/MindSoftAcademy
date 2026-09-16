import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth-password";
import { prisma } from "@/lib/prisma";

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET =
    process.env.TEACHER_PIN || "morsy-lab-local-dev-secret";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/activate",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = asTrimmedString(credentials?.email).toLowerCase();
        const password = asTrimmedString(credentials?.password);
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            passwordHash: true,
          },
        });

        if (!user?.passwordHash) return null;
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.userId = user.id;
        token.sub = user.id;
      }
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      const userId =
        typeof token.userId === "string"
          ? token.userId
          : typeof token.sub === "string"
            ? token.sub
            : null;
      if (session.user && userId) {
        session.user.id = userId;
      }
      return session;
    },
  },
});
