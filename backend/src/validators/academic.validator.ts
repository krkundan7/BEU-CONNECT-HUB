import { z } from 'zod';

export const createPYQSchema = z.object({
  body: z.object({
    subjectId: z.string().uuid(),
    year: z.number().int().min(2010).max(2030),
    examType: z.string().optional().default('END_TERM'),
    fileUrl: z.string().url(),
    solutionUrl: z.string().url().optional(),
  }),
});

export const createNoteSchema = z.object({
  body: z.object({
    subjectId: z.string().uuid(),
    title: z.string().min(3).max(150),
    description: z.string().max(500).optional(),
    unitNumber: z.number().int().min(1).max(10),
    fileUrl: z.string().url(),
  }),
});

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

export const aiChatSchema = z.object({
  body: z.object({
    conversationId: z.string().uuid().optional(),
    message: z.string().min(1, 'Message is required').max(3000),
  }),
});

export const aiAnalyzePYQSchema = z.object({
  body: z.object({
    subjectId: z.string().uuid().optional(),
    subjectName: z.string().min(2),
  }),
});

export const createStudyPlanSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150),
    examDate: z.string().min(4),
    availableHoursDaily: z.number().min(1).max(16).default(4),
    prepLevel: z.string().optional().default('intermediate'),
    subjectIds: z.array(z.string().uuid()).optional(),
  }),
});
