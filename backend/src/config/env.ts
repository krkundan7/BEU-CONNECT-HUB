import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from local or containerized .env configuration file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/* NOV-COMMENT-5: Strongly-Typed Environment Schema & Coercion Safeguards
 * Reads environment variables from the local/container environment with resilient fallback defaults.
 * Performs numeric base-10 coercion on ports, rate limits, and file size boundaries, and normalizes
 * comma-delimited CORS origin strings into clean trimmed arrays to prevent runtime undefined access bugs. */
export const env = {
  // Application runtime mode (development, production, test) controlling logging verbosity and error exposure
  NODE_ENV: process.env.NODE_ENV || 'development',
  // HTTP server listening port coerced to integer
  PORT: parseInt(process.env.PORT || '5000', 10),
  // Uniform API prefix prepended to all modular REST route handlers
  API_PREFIX: process.env.API_PREFIX || '/api',
  // Comma-delimited CORS origin whitelist normalized into a sanitized array for cross-origin validation
  CORS_ORIGIN: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map(origin => origin.trim()),
  // PostgreSQL connection string formatted with Prisma connection pooling parameters
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/beu_connect_hub?schema=public',
  // HMAC SHA-256 signing secret for short-lived access tokens
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_key_beu_hub_2025_secure',
  // Short access token lifespan (15m) to limit replay attack windows in the event of client-side token compromise
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  // Dedicated cryptographic secret for validating high-entropy refresh tokens
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key_beu_hub_2025_secure',
  // Extended refresh token lifetime (7d) balancing user session continuity with security revocation policies
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  // Global sliding window rate limiter timeframe (15 minutes in milliseconds)
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  // Maximum requests permitted per IP within the configured sliding window timeframe
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '150', 10),
  // Active AI integration provider (openrouter or gemini) for academic analysis and chat
  AI_PROVIDER: process.env.AI_PROVIDER || 'openrouter',
  AI_API_KEY: process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY || '',
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || process.env.AI_MODEL || 'google/gemini-2.0-flash-001',
  OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  // File storage driver (local disk storage or cloud object store)
  STORAGE_DRIVER: process.env.STORAGE_DRIVER || 'local',
  // Local filesystem directory for storing uploaded handwritten notes and PYQ documents
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  // Upper payload boundary (in megabytes) permitted for document and media uploads
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '25', 10),
};
