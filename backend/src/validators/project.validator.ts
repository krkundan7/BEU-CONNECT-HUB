import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150),
    description: z.string().min(10).max(3000),
    category: z.string().min(2),
    requiredSkills: z.array(z.string()).min(1, 'At least one required skill must be listed'),
    teamSize: z.number().int().min(2).max(10).default(4),
    githubUrl: z.string().url().optional().or(z.literal('')),
    demoUrl: z.string().url().optional().or(z.literal('')),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150).optional(),
    description: z.string().min(10).max(3000).optional(),
    status: z.enum(['IDEA', 'LOOKING_FOR_TEAM', 'IN_PROGRESS', 'COMPLETED']).optional(),
    githubUrl: z.string().url().optional().or(z.literal('')),
    demoUrl: z.string().url().optional().or(z.literal('')),
  }),
});

export const mentorProfileSchema = z.object({
  body: z.object({
    bio: z.string().min(10).max(1000),
    skills: z.array(z.string()).min(1),
    domain: z.string().min(2),
    yearOfStudy: z.string().optional().default('4th Year'),
    availableSlots: z.number().int().min(1).max(20).default(5),
  }),
});

export const mentorshipRequestSchema = z.object({
  body: z.object({
    topic: z.string().min(3).max(150),
    message: z.string().min(10).max(2000),
  }),
});
