import { z } from 'zod';

const urlSchema = z.string().trim().url({ message: 'Must be a valid URL with http:// or https://' });

/**
 * Opportunity citation schema asserting verifiable source URLs, issuing entity names,
 * and provenance classification (primary portal, direct application link, official circular).
 */
export const opportunitySourceSchema = z.object({
  name: z.string().min(2, 'Source name is required'),
  url: urlSchema,
  isOfficial: z.boolean().optional().default(true),
  type: z.enum(['primary', 'application', 'reference', 'circular']).optional().default('primary'),
});

/**
 * Career & Hackathon opportunity creation schema enforcing mandatory deadlines,
 * organization names, stipend/prize descriptions, and category classifications (INTERNSHIP, HACKATHON, SCHOLARSHIP, JOB).
 */
export const createOpportunitySchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required').max(200),
    description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
    category: z.enum(['INTERNSHIP', 'HACKATHON', 'WORKSHOP', 'COMPETITION', 'SCHOLARSHIP', 'JOB', 'CAREER_EVENT']),
    organization: z.string().min(2, 'Organization name is required'),
    sourceName: z.string().min(2, 'Source website / issuing authority name is required'),
    sourceUrl: urlSchema,
    applicationUrl: urlSchema.optional().or(z.literal('')),
    publishedDate: z.string().optional(),
    deadline: z.string().min(2, 'Deadline is required'),
    lastVerified: z.string().optional(),
    isOfficialSource: z.boolean().default(true),
    sources: z.array(opportunitySourceSchema).optional().default([]),
    location: z.string().optional().default('Remote'),
    isOnline: z.boolean().optional().default(true),
    stipendOrPrize: z.string().optional(),
    source: z.string().optional(), // alias
  }),
});

/**
 * Opportunity patch schema requiring valid route UUID and permitting partial body updates.
 */
export const updateOpportunitySchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: createOpportunitySchema.shape.body.partial(),
});

/**
 * Opportunity search and filter query schema coercing boolean URL string parameters into typed booleans.
 */
export const queryOpportunitySchema = z.object({
  query: z.object({
    category: z.enum(['INTERNSHIP', 'HACKATHON', 'WORKSHOP', 'COMPETITION', 'SCHOLARSHIP', 'JOB', 'CAREER_EVENT']).optional(),
    search: z.string().optional(),
    isOnline: z.string().transform(v => v === 'true').optional(),
    isOfficial: z.string().transform(v => v === 'true').optional(),
  }),
});
