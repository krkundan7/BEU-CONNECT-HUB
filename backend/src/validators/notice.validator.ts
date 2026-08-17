import { z } from 'zod';

export const createNoticeSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(250),
    category: z.enum(['EXAM', 'RESULT', 'ADMISSION', 'SCHOLARSHIP', 'CAREER', 'GENERAL']).default('EXAM'),
    isOfficial: z.boolean().default(true),
    source: z.string().min(2, 'Official issuing source is required'),
    summary: z.string().min(5).max(500),
    content: z.string().min(10),
    isUrgent: z.boolean().optional().default(false),
    fileUrl: z.string().url().optional(),
    publishedAt: z.string().optional().default(() => new Date().toISOString().split('T')[0]),
  }),
});

export const createOpportunitySchema = z.object({
  body: z.object({
    title: z.string().min(5).max(200),
    description: z.string().min(10).max(5000),
    category: z.enum(['INTERNSHIP', 'HACKATHON', 'WORKSHOP', 'COMPETITION', 'SCHOLARSHIP', 'JOB', 'CAREER_EVENT']),
    organization: z.string().min(2),
    location: z.string().optional().default('Remote'),
    isOnline: z.boolean().optional().default(true),
    stipendOrPrize: z.string().optional(),
    deadline: z.string().min(2),
    source: z.string().min(2),
    sourceUrl: z.string().url(),
  }),
});

export const createReportSchema = z.object({
  body: z.object({
    targetType: z.string().min(2),
    targetId: z.string().uuid(),
    reason: z.enum(['SPAM', 'HARASSMENT', 'MISINFORMATION', 'COPYRIGHT', 'INAPPROPRIATE', 'OTHER']),
    details: z.string().max(1000).optional(),
  }),
});
