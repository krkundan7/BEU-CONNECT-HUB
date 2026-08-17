import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Post content cannot be empty').max(5000),
    type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'EDUCATIONAL', 'PROJECT', 'ACHIEVEMENT']).optional().default('TEXT'),
    visibility: z.enum(['PUBLIC', 'CAMPUS', 'COMMUNITY']).optional().default('PUBLIC'),
    mediaUrls: z.array(z.string().url()).optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(5000).optional(),
    visibility: z.enum(['PUBLIC', 'CAMPUS', 'COMMUNITY']).optional(),
  }),
});

export const commentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(1000),
    parentId: z.string().uuid().optional(),
  }),
});

export const bookmarkSchema = z.object({
  body: z.object({
    itemType: z.enum(['POST', 'NOTE', 'PYQ', 'VIDEO', 'OPPORTUNITY']),
    itemId: z.string().uuid(),
  }),
});
