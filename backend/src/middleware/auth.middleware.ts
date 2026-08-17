import { Request, Response, NextFunction } from 'express';
import { TokenUtils } from '../utils/token.js';
import { AppError } from '../utils/AppError.js';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw AppError.unauthorized('Authentication token is missing');
    }

    const decoded = TokenUtils.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(AppError.unauthorized('Access token has expired. Please refresh your session.'));
    } else if (error.name === 'JsonWebTokenError') {
      next(AppError.unauthorized('Invalid access token'));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (token) {
      const decoded = TokenUtils.verifyAccessToken(token);
      req.user = decoded;
    }
    next();
  } catch {
    // Optional auth silently proceeds without attaching req.user
    next();
  }
};
