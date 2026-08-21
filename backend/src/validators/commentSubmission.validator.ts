import { z } from 'zod';

export const commentSubmissionSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
  parentCommentId: z.string().optional(),
});
