import { Request, Response, NextFunction } from 'express';
import { TokenUtils } from '../utils/token.js';
import { AppError } from '../utils/AppError.js';

/* NOV-COMMENT-13: Token Extraction Precedence & Granular JWT Error Interception
 * Extracts JSON Web Tokens with strict precedence: standard 'Authorization: Bearer <token>' header first, followed by cookies.
 * Verifies HMAC SHA-256 signature against JWT_SECRET and attaches decoded user claims (id, email, role, verificationStatus) to Express Request.
 * Intercepts 'TokenExpiredError' distinctly to trigger automated client-side refresh token rotation, versus rejecting 'JsonWebTokenError' tampering. */
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
    // Differentiate between expired tokens (prompting client token rotation) and malformed signatures
    if (error.name === 'TokenExpiredError') {
      next(AppError.unauthorized('Access token has expired. Please refresh your session.'));
    } else if (error.name === 'JsonWebTokenError') {
      next(AppError.unauthorized('Invalid access token'));
    } else {
      next(error);
    }
  }
};

/* NOV-COMMENT-14: Permissive Identity Hydration (Optional Authentication)
 * Evaluates authorization credentials if provided without blocking unauthenticated guests.
 * Allows anonymous students to read public BEU syllabus nodes, department notice boards, and community discussions
 * while seamlessly augmenting responses with personal bookmark/like flags when valid credentials are present. */
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

