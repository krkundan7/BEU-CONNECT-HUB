import { z } from 'zod';

export const goalRoadmapCustomizationSchema = z.object({
  trackId: z.string().min(1, 'Track ID is required'),
  targetPaceHoursPerWeek: z.number().min(2).max(40),
  customMilestones: z.array(z.string()).optional(),
});
