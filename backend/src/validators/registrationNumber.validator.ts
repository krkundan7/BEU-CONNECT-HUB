import { z } from 'zod';

export const registrationNumberSchema = z.object({
  registrationNumber: z
    .string()
    .min(10, 'Registration number must be at least 10 characters')
    .max(12, 'Registration number cannot exceed 12 characters')
    .regex(/^[0-9]+$/, 'Registration number must contain digits only'),
});
