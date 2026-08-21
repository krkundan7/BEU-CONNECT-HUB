import { z } from 'zod';

export const noticeFilterSchema = z.object({
  category: z.enum(['EXAMINATION', 'ACADEMIC', 'SCHOLARSHIP', 'ADMISSION', 'CIRCULAR', 'URGENT', 'ALL']).optional(),
  branch: z.string().optional(),
  semester: z.coerce.number().int().min(1).max(8).optional(),
  search: z.string().optional(),
});
