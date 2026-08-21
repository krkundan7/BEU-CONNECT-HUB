import { z } from 'zod';

export const fileUploadMimeSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().max(52428800, 'File size limit is 50MB'),
  mimeType: z.string().regex(/^(application\/pdf|image\/jpeg|image\/png|image\/webp)$/),
});
