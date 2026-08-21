import { z } from 'zod';

export const passwordResetSchema = z.object({
  emailOrPhone: z.string().min(3),
  otpCode: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});
