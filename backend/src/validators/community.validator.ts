import { z } from 'zod';

/**
 * Community hub creation schema asserting name/description boundaries,
 * campus category classifications (COLLEGE, BRANCH, SEMESTER, INTEREST, CAREER),
 * and privacy settings for campus-gated clubs.
 */
export const createCommunitySchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    category: z.enum(['COLLEGE', 'BRANCH', 'SEMESTER', 'INTEREST', 'PROJECT', 'CAREER']).optional().default('INTEREST'),
    icon: z.string().optional().default('🚀'),
    coverImage: z.string().url().optional(),
    rules: z.array(z.string()).optional().default([]),
    isPrivate: z.boolean().optional().default(false),
  }),
});

/**
 * Community metadata update schema allowing leaders to edit guidelines, icons, and banner art.
 */
export const updateCommunitySchema = z.object({
  body: z.object({
    description: z.string().min(10).max(1000).optional(),
    rules: z.array(z.string()).optional(),
    icon: z.string().optional(),
    coverImage: z.string().url().optional(),
  }),
});

/**
 * Community-scoped discussion thread schema validating topic title and body content.
 */
export const createCommunityPostSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    content: z.string().min(5).max(5000),
  }),
});
