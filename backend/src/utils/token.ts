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

  /* NOV-COMMENT-11: Cryptographic CSPRNG Token Generation & One-Way SHA-256 Hashing
   * Generates a 40-byte cryptographically secure pseudorandom number generator (CSPRNG) hex string.
   * Derives a deterministic SHA-256 hash: the plaintext is sent exclusively to the client over secure cookies,
   * while the backend stores only the digest, protecting user sessions against complete compromise in case of read-only database leaks. */
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

