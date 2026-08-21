import { z } from 'zod';

export const userSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  noticePushAlerts: z.boolean().optional(),
  studyStreakReminders: z.boolean().optional(),
  themePreference: z.enum(['DARK', 'LIGHT', 'SYSTEM']).optional(),
});
