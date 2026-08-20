import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_PREFIX: process.env.API_PREFIX || '/api',
  CORS_ORIGIN: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map(origin => origin.trim()),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/beu_connect_hub?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_key_beu_hub_2025_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key_beu_hub_2025_secure',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '150', 10),
  AI_PROVIDER: process.env.AI_PROVIDER || 'openrouter',
  AI_API_KEY: process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY || '',
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || process.env.AI_MODEL || 'google/gemini-2.0-flash-001',
  OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  STORAGE_DRIVER: process.env.STORAGE_DRIVER || 'local',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '25', 10),
};
