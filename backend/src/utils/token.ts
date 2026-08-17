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
  static generateAccessToken(payload: UserPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  static generateRefreshToken(): { token: string; hash: string } {
    const token = crypto.randomBytes(40).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hash };
  }

  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static verifyAccessToken(token: string): UserPayload {
    return jwt.verify(token, env.JWT_SECRET) as UserPayload;
  }
}
