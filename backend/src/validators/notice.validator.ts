import { z } from 'zod';

const urlSchema = z.string().trim().url({ message: 'Must be a valid URL with http:// or https://' });

/**
 * University administrative circular & exam notice validation schema.
 * Enforces verified source citations, notice category tagging,
 * urgency flags, branch/semester audience arrays, and optional circular PDF/application URLs.
 */
export const createNoticeSchema = z.object({
  body: z.object({
    notificationNumber: z.string().optional(),
    title: z.string().min(5).max(300),
    category: z.enum([
      'EXAM',
      'RESULT',
      'ADMIT_CARD',
      'TIME_TABLE',
      'REGISTRATION',
      'ACADEMIC',
      'HOLIDAY',
      'SCHOLARSHIP',
      'INTERNSHIP',
      'PLACEMENT',
      'ADMISSION',
      'NOTICE',
      'CIRCULAR',
      'ANNOUNCEMENT',
      'CAREER',
      'GENERAL',
      'OTHER',
    ]).default('EXAM'),
    isOfficial: z.boolean().default(true),
    source: z.string().min(2, 'Official issuing source is required').optional(),
    sourceName: z.string().optional(),
    sourceUrl: urlSchema.optional().or(z.literal('')),
    documentUrl: urlSchema.optional().or(z.literal('')),
    applicationUrl: urlSchema.optional().or(z.literal('')),
    summary: z.string().min(5).max(800),
    content: z.string().min(10),
    isUrgent: z.boolean().optional().default(false),
    isImportant: z.boolean().optional().default(false),
    isAllBranches: z.boolean().optional().default(true),
    isAllSemesters: z.boolean().optional().default(true),
    targetBranchCodes: z.array(z.string()).optional().default([]),
    targetSemesterNumbers: z.array(z.number().min(1).max(8)).optional().default([]),
    fileUrl: urlSchema.optional().or(z.literal('')),
    publishedAt: z.string().optional(),
    publishedDate: z.string().optional(),
    deadline: z.string().optional(),
    lastVerified: z.string().optional(),
    isOfficialSource: z.boolean().default(true),
  }),
});

export const queryNoticeSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    branchCode: z.string().optional(),
    semesterNumber: z.coerce.number().min(1).max(8).optional(),
    isImportant: z.preprocess(val => (val === 'true' ? true : val === 'false' ? false : val), z.boolean().optional()),
    isUrgent: z.preprocess(val => (val === 'true' ? true : val === 'false' ? false : val), z.boolean().optional()),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
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
