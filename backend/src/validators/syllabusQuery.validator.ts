import { z } from 'zod';

export const syllabusQuerySchema = z.object({
  branch: z.string().min(2, 'Branch code or name required'),
  semester: z.coerce.number().int().min(1).max(8, 'Semester must be between 1 and 8'),
  subjectCode: z.string().optional(),
});
