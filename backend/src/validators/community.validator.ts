import { z } from 'zod';

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

export const updateCommunitySchema = z.object({
  body: z.object({
    description: z.string().min(10).max(1000).optional(),
    rules: z.array(z.string()).optional(),
    icon: z.string().optional(),
    coverImage: z.string().url().optional(),
  }),
});

export const createCommunityPostSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    content: z.string().min(5).max(5000),
  }),
});
