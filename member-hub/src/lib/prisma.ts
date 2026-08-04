import { PrismaClient } from "@prisma/client";

/**
 * PrismaClient singleton.
 *
 * Next.js hot-reloads modules during development, which would otherwise
 * create a new DB connection pool on every reload. Attaching the client to
 * `globalThis` keeps a single instance alive across reloads.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
