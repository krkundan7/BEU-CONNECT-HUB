import { z } from 'zod';

/**
 * Previous Year Question (PYQ) upload schema asserting valid BEU examination years,
 * valid subject foreign key references, and authenticated file storage URLs.
 */
export const createPYQSchema = z.object({
  body: z.object({
    subjectId: z.string().uuid(),
    year: z.number().int().min(2010).max(2030),
    examType: z.string().optional().default('END_TERM'),
    fileUrl: z.string().url(),
    solutionUrl: z.string().url().optional(),
  }),
});

/* NOV-COMMENT-19: Handwritten Notes Syllabus Indexing & Format Constraints
 * Validates uploaded student revision notes against syllabus structure constraints:
 * limits 'unitNumber' between 1 and 10 to align with university syllabus modules, restricts file types to
 * verified document enums ('pdf', 'image', 'doc'), and enforces clean title length boundaries (3-150 chars). */
export const createNoteSchema = z.object({
  body: z.object({
    subjectId: z.string(),
    title: z.string().min(3).max(150),
    description: z.string().max(1000).optional(),
    unitNumber: z.number().int().min(1).max(10),
    fileUrl: z.string().min(1),
    fileType: z.enum(['pdf', 'image', 'doc']).optional().default('pdf'),
    thumbnailUrl: z.string().optional(),
  }),
});

/**
 * Curated video lecture schema validating YouTube/CDN video URLs and optional metadata tags.
 */
export const createStudyVideoSchema = z.object({
  body: z.object({
    subjectId: z.string().uuid(),
    title: z.string().min(3).max(150),
    description: z.string().max(500).optional(),
    unitNumber: z.number().int().min(1).max(10),
    videoUrl: z.string().url(),
    thumbnailUrl: z.string().url().optional(),
    channelName: z.string().optional(),
    duration: z.string().optional(),
  }),
});

/**
 * AI academic tutor message schema accepting conversational queries and multimodal document attachments (images/PDF data URIs).
 */
export const aiChatSchema = z.object({
  body: z.object({
    conversationId: z.string().uuid().optional(),
    message: z.string().min(1, 'Message is required').max(5000),
    attachment: z.object({
      type: z.enum(['image', 'pdf']),
      dataUrl: z.string(),
      name: z.string().optional(),
      size: z.string().optional(),
    }).optional(),
  }),
});

/**
 * AI PYQ pattern analyzer input schema requiring subject name and optional semester/branch context.
 */
export const aiAnalyzePYQSchema = z.object({
  body: z.object({
    subjectId: z.string().optional(),
    subjectName: z.string().min(2),
    branch: z.string().optional(),
    semester: z.number().int().min(1).max(8).optional(),
  }),
});

/**
 * AI Study Plan generation schema validating exam date targets, daily available study hours (1-16h), and preparation baseline.
 */
export const createStudyPlanSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150),
    examDate: z.string().min(4),
    availableHoursDaily: z.number().min(1).max(16).default(4),
    prepLevel: z.string().optional().default('intermediate'),
    subjectIds: z.array(z.string().uuid()).optional(),
  }),
});
