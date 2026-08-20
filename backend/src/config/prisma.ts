import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/* NOV-COMMENT-6: PrismaClient Global Singleton & Connection Pool Re-use
 * Extends the Node.js global context to maintain a single active instance of PrismaClient during development.
 * Prevents rapid exhaustion of the PostgreSQL connection pool caused by tsx/nodemon reloading modules on file save.
 * Enables granular query profiling ('query', 'error', 'warn') during development while strictly suppressing query logs in production. */
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Persist client reference on the global scope during development hot-reloads
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
