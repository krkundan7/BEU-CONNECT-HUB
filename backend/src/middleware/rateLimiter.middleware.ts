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

/* NOV-COMMENT-16: Auth Endpoint Brute-Force & Credential Stuffing Throttling
 * Implements a strict sliding-window rate limit allowing a maximum of 20 authentication attempts per 15 minutes per client IP.
 * Thwarts automated dictionary and credential-stuffing attacks on login/registration routes, returning standard 429 Too Many Requests
 * with standardized 'Retry-After' headers and 'RATE_LIMIT_EXCEEDED' error code envelopes. */
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

