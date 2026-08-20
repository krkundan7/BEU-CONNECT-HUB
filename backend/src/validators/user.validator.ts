import { z } from 'zod';

/**
 * User profile update schema validating bio length constraints, avatar URLs,
 * and optional external social profile links (GitHub, LinkedIn, Portfolio).
 */
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

/**
 * Student skill addition schema accepting either pre-existing skill UUIDs or ad-hoc custom skill names
 * along with standardized proficiency gradations (BEGINNER, INTERMEDIATE, EXPERT).
 */
export const addSkillSchema = z.object({
  body: z.object({
    skillId: z.string().uuid().optional(),
    skillName: z.string().min(1).optional(),
    proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']).optional().default('INTERMEDIATE'),
  }),
});

/**
 * Student achievement & certification schema validating event titles, descriptions, and certificate URLs.
 */
export const achievementSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(150),
    description: z.string().max(500).optional(),
    date: z.string().optional(),
    certificateUrl: z.string().url().optional().or(z.literal('')),
  }),
});

/**
 * University student identity verification submission schema requiring college name, registration number, and optional ID card document proof.
 */
export const verificationSubmitSchema = z.object({
  body: z.object({
    collegeName: z.string().min(2),
    beuRegNo: z.string().min(6),
    documentUrl: z.string().optional(),
  }),
});
