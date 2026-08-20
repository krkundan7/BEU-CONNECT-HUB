import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

/**
 * Authentication & Session Management Routes (`/api/auth`)
 * Houses endpoints for student registration, credential authentication,
 * single-use refresh token rotation, password recovery, and identity retrieval.
 */
const router = Router();

// Student self-registration protected with brute-force rate limiter
router.post('/register', authLimiter, validate(registerSchema), AuthController.register);

// Credential login issuing JWT access token and HTTP-only refresh cookie
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);

// Refresh token rotation endpoint renewing expired access tokens without re-prompting credentials
router.post('/refresh', validate(refreshTokenSchema), AuthController.refresh);

// Explicit logout revoking active refresh tokens across the database
router.post('/logout', requireAuth, AuthController.logout);

// Password recovery initiation generating signed reset requests
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);

// Password reset completion with token signature verification
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), AuthController.resetPassword);

// Identity profile endpoint for hydrating client session state
router.get('/me', requireAuth, AuthController.getMe);

export default router;
