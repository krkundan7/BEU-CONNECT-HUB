import { z } from 'zod';

/* NOV-COMMENT-18: Zod Student Registration Contract & Type Transformation
 * Enforces strict validation constraints on student onboarding: min-2 char names, standard RFC email format,
 * password complexity containing at least one uppercase letter and one numeric digit, and mandatory BEU registration number.
 * Uses Zod union + transform to transparently coerce stringified form-data semester inputs into numeric integer primitives. */
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100)
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    mobile: z.string().optional(),
    college: z.string().min(2, 'College name is required'),
    branch: z.string().min(2, 'Branch is required'),
    semester: z.union([z.string(), z.number()]).transform((val: string | number) => (typeof val === 'string' ? parseInt(val, 10) : val)),
    beuRegNo: z.string().min(6, 'BEU registration number is required'),
  }),
});

/**
 * Login credential validation schema requiring valid email syntax and non-empty password.
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

/**
 * Refresh token request schema ensuring presence of the cryptographic refresh token payload.
 */
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

/**
 * Password reset dispatch schema validating the recipient student's email address.
 */
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

/**
 * Password reset finalization schema asserting token presence and enforcing standard password complexity rules.
 */
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
});
