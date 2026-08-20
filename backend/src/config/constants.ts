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
  IMAGES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  VIDEOS: ['video/mp4', 'video/webm'],
};

/* NOV-COMMENT-7: Domain Error Segregation & Statutory AI Academic Disclaimers
 * Categorizes system operational error codes into machine-readable strings for frontend automated handling.
 * Defines the immutable AI_DISCLAIMER injected into all AI-generated question paper trend reports, assuring compliance
 * with Bihar Engineering University examination ethics and clarifying that AI summaries represent statistical frequency
 * rather than leaked or guaranteed exam papers. */
export const AI_DISCLAIMER = 'This is historical pattern analysis, not a guaranteed prediction of future exam questions.';

