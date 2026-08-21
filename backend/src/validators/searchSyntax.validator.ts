import { z } from 'zod';

export const searchSyntaxSchema = z.object({
  q: z.string().min(1, 'Search query required').max(100),
  scope: z.enum(['ALL', 'SYLLABUS', 'NOTES', 'PYQ', 'PEERS', 'NOTICES']).default('ALL'),
});
