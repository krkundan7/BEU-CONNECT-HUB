import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    bio: z.string().max(500).optional(),
    avatar: z.string().url().optional(),
    github: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
    interests: z.array(z.string()).optional(),
    careerGoals: z.string().max(500).optional(),
  }),
});

export const addSkillSchema = z.object({
  body: z.object({
    skillId: z.string().uuid().optional(),
    skillName: z.string().min(1).optional(),
    proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']).optional().default('INTERMEDIATE'),
  }),
});

export const achievementSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(150),
    description: z.string().max(500).optional(),
    date: z.string().optional(),
    certificateUrl: z.string().url().optional().or(z.literal('')),
  }),
});

export const verificationSubmitSchema = z.object({
  body: z.object({
    collegeName: z.string().min(2),
    beuRegNo: z.string().min(6),
    documentUrl: z.string().optional(),
  }),
});
