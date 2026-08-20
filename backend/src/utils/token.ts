import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { UserPayload } from '../types/index.js';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
  expiresIn: string;
}

export class TokenUtils {
  /**
   * Generates a signed, short-lived JWT access token encoding user role and verification claims.
   */
  static generateAccessToken(payload: UserPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  /**
   * Generates a high-entropy CSPRNG random refresh token string and computes its SHA-256 digest
   * so the plaintext token is provided to the client while only the hash is persisted in the database.
   */
  static generateRefreshToken(): { token: string; hash: string } {
    const token = crypto.randomBytes(40).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hash };
  }

  /**
   * Computes a deterministic SHA-256 hash of an incoming raw refresh token for indexed database lookup.
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static verifyAccessToken(token: string): UserPayload {
    return jwt.verify(token, env.JWT_SECRET) as UserPayload;
  }
}

