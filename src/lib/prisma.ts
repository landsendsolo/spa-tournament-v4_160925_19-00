import { PrismaClient } from '@prisma/client';

// This prevents Next.js from creating too many Prisma Client instances in development
// due to Hot Module Replacement (HMR).
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
