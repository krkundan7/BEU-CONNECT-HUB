import { z } from 'zod';

export const noteUploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  subjectCode: z.string().min(2, 'Subject code is required'),
  branch: z.string().min(2, 'Branch is required'),
  semester: z.coerce.number().int().min(1).max(8),
  unitNumber: z.coerce.number().int().min(1).max(10).optional(),
  description: z.string().max(500).optional(),
});
