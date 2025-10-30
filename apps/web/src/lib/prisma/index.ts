/**
ABOUTME: Prisma client singleton for Next.js applications
Ensures only one Prisma client instance is used across the application
Prevents connection pooling issues in serverless environments
 */

import { PrismaClient } from './generated';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Get or create a Prisma client instance
 * Uses a singleton pattern to avoid creating multiple connections
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}