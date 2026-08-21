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

/**
 * Authentication & Verification Routes (`/api/auth`)
 * Handles multi-step student verification, identity gateway, dual-token authentication,
 * session renewal, and password recovery.
 */
const router = Router();

// Step 1: BEU Registration ID Verification
router.post(
  '/verify-beu-reg',
  authLimiter,
  validate(verifyBeuRegSchema),
  AuthController.verifyBEURegistration
);

// Step 3: Mobile OTP Send & Verify
router.post(
  '/send-mobile-otp',
  authLimiter,
  validate(sendMobileOtpSchema),
  AuthController.sendMobileOTP
);

router.post(
  '/verify-mobile-otp',
  authLimiter,
  validate(verifyMobileOtpSchema),
  AuthController.verifyMobileOTP
);

// Step 4: Email OTP Send & Verify
router.post(
  '/send-email-otp',
  authLimiter,
  validate(sendEmailOtpSchema),
  AuthController.sendEmailOTP
);

router.post(
  '/verify-email-otp',
  authLimiter,
  validate(verifyEmailOtpSchema),
  AuthController.verifyEmailOTP
);

// Step 5: Privacy-Conscious Identity Verification Initiation & OTP Confirm
router.post(
  '/verify-identity/initiate',
  authLimiter,
  validate(initiateIdentitySchema),
  AuthController.initiateIdentityVerification
);

router.post(
  '/verify-identity/confirm',
  authLimiter,
  validate(confirmIdentitySchema),
  AuthController.confirmIdentityVerification
);

// Step 7: Final Account Activation & Verified Registration
router.post(
  '/register-verified',
  authLimiter,
  validate(registerVerifiedSchema),
  AuthController.registerVerified
);

// Legacy registration fallback
router.post('/register', authLimiter, AuthController.register);

// Multi-Identifier Login (BEU Reg ID / Email / Mobile + Password)
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);

// Session Refresh Token Rotation
router.post('/refresh', validate(refreshTokenSchema), AuthController.refresh);

// Explicit Logout
router.post('/logout', requireAuth, AuthController.logout);

// Password Recovery
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), AuthController.resetPassword);

// Profile
router.get('/me', requireAuth, AuthController.getMe);

export default router;
