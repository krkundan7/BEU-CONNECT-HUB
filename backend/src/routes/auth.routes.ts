import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import {
  verifyBeuRegSchema,
  sendMobileOtpSchema,
  verifyMobileOtpSchema,
  sendEmailOtpSchema,
  verifyEmailOtpSchema,
  initiateIdentitySchema,
  confirmIdentitySchema,
  registerVerifiedSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

/* NOV-LOGIC-58: Cryptographically Gated Authentication Routing Pipeline
 * Enforces Zod contract validation and brute-force IP rate limiting on all registration and credential entrypoints. */
const router = Router();

/* NOV-LOGIC-59: Step 1 BEU Registration ID Syntactic & Uniqueness Route */
router.post(
  '/verify-beu-reg',
  authLimiter,
  validate(verifyBeuRegSchema),
  AuthController.verifyBEURegistration
);

/* NOV-LOGIC-60: Step 3 Mobile Verification Token & Rate-Limited OTP Dispatch */
router.post(
  '/send-mobile-otp',
  authLimiter,
  validate(sendMobileOtpSchema),
  AuthController.sendMobileOTP
);

/* NOV-LOGIC-61: Step 3 Mobile OTP SHA-256 Digest Verification Route */
router.post(
  '/verify-mobile-otp',
  authLimiter,
  validate(verifyMobileOtpSchema),
  AuthController.verifyMobileOTP
);

/* NOV-LOGIC-62: Step 4 Institutional / Personal Email Verification Dispatch */
router.post(
  '/send-email-otp',
  authLimiter,
  validate(sendEmailOtpSchema),
  AuthController.sendEmailOTP
);

/* NOV-LOGIC-63: Step 4 Email Token Verification Route */
router.post(
  '/verify-email-otp',
  authLimiter,
  validate(verifyEmailOtpSchema),
  AuthController.verifyEmailOTP
);

/* NOV-LOGIC-64: Step 5 DPDP-Compliant UIDAI / DigiLocker Verification Initiation */
router.post(
  '/verify-identity/initiate',
  authLimiter,
  validate(initiateIdentitySchema),
  AuthController.initiateIdentityVerification
);

/* NOV-LOGIC-65: Step 5 Identity Gateway OTP Confirmation Route */
router.post(
  '/verify-identity/confirm',
  authLimiter,
  validate(confirmIdentitySchema),
  AuthController.confirmIdentityVerification
);

/* NOV-LOGIC-66: Step 7 Verified Multi-Token Account Provisioning */
router.post(
  '/register-verified',
  authLimiter,
  validate(registerVerifiedSchema),
  AuthController.registerVerified
);

// Legacy registration fallback
router.post('/register', authLimiter, AuthController.register);

/* NOV-LOGIC-67: Multi-Identifier Credential Login with Progressive Lockout Protection */
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);

/* NOV-LOGIC-68: Single-Use Refresh Token Rotation & Session Re-Issuance */
router.post('/refresh', validate(refreshTokenSchema), AuthController.refresh);

// Explicit Logout
router.post('/logout', requireAuth, AuthController.logout);

// Password Recovery
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), AuthController.resetPassword);

// Profile
router.get('/me', requireAuth, AuthController.getMe);

export default router;
