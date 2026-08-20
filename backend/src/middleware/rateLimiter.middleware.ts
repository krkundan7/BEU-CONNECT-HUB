import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';

/**
 * Global IP-based rate limiter applying a 15-minute sliding window across general API routes
 * to prevent scraping, resource starvation, and Denial-of-Service attacks.
 */
export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ResponseFormatter.error(
      res,
      'Too many requests from this IP, please try again after 15 minutes',
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ERROR_CODES.RATE_LIMIT_EXCEEDED
    );
  },
});

/**
 * Strict rate limiter capping authentication attempts (login/register/password-reset) to 20 requests per 15 minutes
 * to mitigate credential stuffing and password brute-force vectors.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ResponseFormatter.error(
      res,
      'Too many authentication attempts. Please try again after 15 minutes.',
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ERROR_CODES.RATE_LIMIT_EXCEEDED
    );
  },
});

