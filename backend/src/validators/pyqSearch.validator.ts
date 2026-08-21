import { z } from 'zod';

export const pyqSearchSchema = z.object({
  branch: z.string().optional(),
  semester: z.coerce.number().int().min(1).max(8).optional(),
  year: z.coerce.number().int().min(2018).max(2030).optional(),
  query: z.string().optional(),
  hasSolution: z.coerce.boolean().optional(),
});
