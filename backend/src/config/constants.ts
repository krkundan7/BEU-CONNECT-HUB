/**
 * Standardized HTTP response status codes mapped to immutable readonly constants.
 * Enforces predictable API response codes across all controller layers.
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Machine-readable error code identifiers returned in API error envelopes
 * to facilitate programmatic client-side branching (e.g. triggering re-authentication on AUTHENTICATION_ERROR).
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
} as const;

/**
 * Strict MIME type allowlist enforced during Multer file upload handling
 * to prevent executable payloads and arbitrary binary ingestion.
 */
export const ALLOWED_MIME_TYPES = {
  IMAGES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/bmp',
    'image/heic',
    'image/heif',
    'image/tiff',
  ],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/json',
  ],
  VIDEOS: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/avi'],
};

export const AI_DISCLAIMER = 'This is historical pattern analysis, not a guaranteed prediction of future exam questions.';

/**
 * Verification & Authentication Lifecycle Security Constants
 */
export const VERIFICATION_CONFIG = {
  OTP_LENGTH: 6,
  OTP_EXPIRY_MS: 5 * 60 * 1000, // 5 minutes
  OTP_RESEND_COOLDOWN_MS: 60 * 1000, // 60 seconds
  OTP_MAX_ATTEMPTS: 3,
  ACCOUNT_LOCKOUT_MAX_ATTEMPTS: 5,
  ACCOUNT_LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes
  IDENTITY_TOKEN_EXPIRY_MS: 30 * 60 * 1000, // 30 minutes
};

