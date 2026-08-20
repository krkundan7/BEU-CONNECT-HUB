import { z } from 'zod';

/* NOV-COMMENT-20: Defensive Pagination Range Clamping & Query Bounding
 * Transparently transforms incoming stringified URL search params ('?page=2&limit=25') into numeric primitives.
 * Defensively clamps 'page >= 1' and bounds 'limit' between 1 and 100, neutralizing malicious queries with excessive take counts
 * that could cause Node.js heap memory exhaustion or unindexed full-table scans. */
export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val?: string) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
    limit: z.string().optional().transform((val?: string) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 10)),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

/**
 * Standard UUID route parameter validator enforcing canonical RFC 4122 v4 UUID syntax.
 */
export const uuidParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID parameter'),
  }),
});
