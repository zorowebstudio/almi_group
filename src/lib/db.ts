import { PrismaClient } from "@prisma/client";

// Validate the required environment variable at module load time (server only).
// This gives a clear error message instead of an opaque Prisma connection failure.
if (!process.env.DATABASE_URL) {
  throw new Error(
    "[db.ts] DATABASE_URL environment variable is not set.\n" +
    "  - For local development: ensure prisma/dev.db exists and DATABASE_URL=file:./dev.db in .env\n" +
    "  - For Vercel: add DATABASE_URL to your project environment variables.\n" +
    "  - See .env.example for the expected format."
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
