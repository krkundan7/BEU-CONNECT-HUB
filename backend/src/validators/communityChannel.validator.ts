import { z } from 'zod';

export const communityChannelSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(250).optional(),
  category: z.enum(['BRANCH', 'EXAM_PREP', 'HACKATHON', 'ALUMNI', 'CLUBS']),
  isPrivate: z.boolean().default(false),
});
