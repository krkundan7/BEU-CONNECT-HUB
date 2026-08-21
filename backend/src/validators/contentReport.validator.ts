import { z } from 'zod';

export const contentReportSchema = z.object({
  resourceType: z.enum(['NOTE', 'PYQ', 'POST', 'COMMENT', 'PROFILE']),
  resourceId: z.string().min(1),
  reason: z.enum(['SPAM', 'INCORRECT_CURRICULUM', 'COPYRIGHT_VIOLATION', 'ABUSIVE', 'OTHER']),
  details: z.string().max(400).optional(),
});
