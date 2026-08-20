import { z } from 'zod';

const urlSchema = z.string().trim().url({ message: 'Must be a valid URL with http:// or https://' });

/**
 * University administrative circular & exam notice validation schema.
 * Enforces verified source citations, notice category tagging (EXAM, RESULT, ADMISSION, SCHOLARSHIP),
 * urgency flags, and optional circular PDF/application URLs.
 */
export const createNoticeSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(250),
    category: z.enum(['EXAM', 'RESULT', 'ADMISSION', 'SCHOLARSHIP', 'CAREER', 'GENERAL']).default('EXAM'),
    isOfficial: z.boolean().default(true),
    source: z.string().min(2, 'Official issuing source is required'),
    sourceName: z.string().optional(),
    sourceUrl: urlSchema.optional().or(z.literal('')),
    applicationUrl: urlSchema.optional().or(z.literal('')),
    summary: z.string().min(5).max(500),
    content: z.string().min(10),
    isUrgent: z.boolean().optional().default(false),
    fileUrl: urlSchema.optional().or(z.literal('')),
    publishedAt: z.string().optional().default(() => new Date().toISOString().split('T')[0]),
    publishedDate: z.string().optional(),
    deadline: z.string().optional(),
    lastVerified: z.string().optional(),
    isOfficialSource: z.boolean().default(true),
  }),
});

export { createOpportunitySchema, updateOpportunitySchema, queryOpportunitySchema } from './opportunity.validator.js';

/**
 * Community moderation report schema capturing violation reasons (SPAM, HARASSMENT, MISINFORMATION, COPYRIGHT)
 * and target polymorphic entity identifiers for administrative review.
 */
export const createReportSchema = z.object({
  body: z.object({
    targetType: z.string().min(2),
    targetId: z.string().uuid(),
    reason: z.enum(['SPAM', 'HARASSMENT', 'MISINFORMATION', 'COPYRIGHT', 'INAPPROPRIATE', 'OTHER']),
    details: z.string().max(1000).optional(),
  }),
});
