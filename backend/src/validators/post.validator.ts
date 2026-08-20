import { z } from 'zod';

/**
 * Community feed post creation schema validating content length,
 * specialized post category types (EDUCATIONAL, PROJECT, ACHIEVEMENT),
 * visibility scopes (PUBLIC, CAMPUS, COMMUNITY), and attached media URLs.
 */
export const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Post content cannot be empty').max(5000),
    type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'EDUCATIONAL', 'PROJECT', 'ACHIEVEMENT']).optional().default('TEXT'),
    visibility: z.enum(['PUBLIC', 'CAMPUS', 'COMMUNITY']).optional().default('PUBLIC'),
    mediaUrls: z.array(z.string().url()).optional(),
  }),
});

/**
 * Post update schema allowing authors to modify content and toggle audience visibility.
 */
export const updatePostSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(5000).optional(),
    visibility: z.enum(['PUBLIC', 'CAMPUS', 'COMMUNITY']).optional(),
  }),
});

/**
 * Threaded post comment schema supporting 1-level reply nesting via optional `parentId`.
 */
export const commentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(1000),
    parentId: z.string().uuid().optional(),
  }),
});

/**
 * Universal polymorphic bookmark schema linking user bookmarks to posts, notes, PYQs, or opportunities.
 */
export const bookmarkSchema = z.object({
  body: z.object({
    itemType: z.enum(['POST', 'NOTE', 'PYQ', 'VIDEO', 'OPPORTUNITY']),
    itemId: z.string().uuid(),
  }),
});
