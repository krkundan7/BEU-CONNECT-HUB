import { z } from 'zod';

/* NOV-LOGIC-76: BEU Registration Identifier Contract Schema
 * Enforces length boundaries (6-30 characters) for official university student identification strings. */
export const verifyBeuRegSchema = z.object({
  body: z.object({
    beuRegNo: z.string().min(6, 'BEU Registration ID must be at least 6 characters').max(30),
  }),
});

/* NOV-LOGIC-77: Indian National Mobile Number Regex Validator
 * Strictly validates 10-digit mobile numbers starting with valid TRAI carrier prefixes [6-9]. */
export const sendMobileOtpSchema = z.object({
  body: z.object({
    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'),
  }),
});

/* NOV-LOGIC-78: Mobile OTP Confirmation Contract */
export const verifyMobileOtpSchema = z.object({
  body: z.object({
    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  }),
});

/* NOV-LOGIC-79: RFC-Compliant Email Address Dispatch Schema */
export const sendEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
  }),
});

/* NOV-LOGIC-80: Email Verification Code Ingestion Contract */
export const verifyEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  }),
});

/* NOV-LOGIC-81: UIDAI Statutory Consent & 12-Digit Numeric Verification Contract */
export const initiateIdentitySchema = z.object({
  body: z.object({
    aadhaarNumber: z
      .string()
      .regex(/^\d{12}$/, 'Aadhaar number must be exactly 12 numeric digits'),
    studentName: z.string().min(2, 'Student full name is required'),
    consentGiven: z.boolean().refine(val => val === true, {
      message: 'Statutory consent is required for identity verification',
    }),
    dob: z.string().optional(),
  }),
});

/* NOV-LOGIC-82: Identity Session Reference & OTP Confirmation Schema */
export const confirmIdentitySchema = z.object({
  body: z.object({
    referenceId: z.string().min(10, 'Reference ID is required'),
    otp: z.string().min(4, 'Authentication OTP is required'),
  }),
});

/* NOV-LOGIC-83: Verified Student Account Provisioning Contract
 * Enforces complex password entropy (upper, lower, digit, symbol) and mandatory verification token quartet. */
export const registerVerifiedSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100)
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    mobile: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit mobile is required'),
    dob: z.string().optional(),
    college: z.string().min(2, 'College name is required'),
    branch: z.string().min(2, 'Branch is required'),
    semester: z.union([z.string(), z.number()]).transform((val: string | number) => (typeof val === 'string' ? parseInt(val, 10) : val)),
    beuRegNo: z.string().min(6, 'BEU registration number is required'),
    // Verification Tokens asserting prior completion of checks
    beuToken: z.string().min(10, 'BEU verification token is required'),
    mobileToken: z.string().min(10, 'Mobile verification token is required'),
    emailToken: z.string().min(10, 'Email verification token is required'),
    identityToken: z.string().optional(),
    identityReference: z.string().optional(),
  }),
});

export const registerSchema = registerVerifiedSchema;

/* NOV-LOGIC-84: Multi-Identifier Polymorphic Login Schema
 * Allows authentication via BEU registration ID, email address, or mobile number within a single input payload. */
export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(3, 'BEU Registration ID, Email, or Mobile Number is required').optional(),
    email: z.string().optional(),
    password: z.string().min(1, 'Password is required'),
  }),
});

/* NOV-LOGIC-85: Refresh Token Rotation Validation Schema */
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

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
