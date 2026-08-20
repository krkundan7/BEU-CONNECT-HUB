import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../utils/AppError.js';

/* NOV-COMMENT-15: Declarative Role-Based Access Control (RBAC) Guard
 * Higher-order middleware factory accepting permitted Prisma 'Role' enum members (ADMIN, MODERATOR, FACULTY, STUDENT).
 * First asserts that upstream authentication middleware attached a valid 'req.user' object;
 * subsequently checks 'req.user.role' against the permitted whitelist, rejecting unauthorized access with HTTP 403 Forbidden. */
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Ensure authentication middleware has already run and attached valid user identity
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required to verify user role'));
    }

    // Verify user role membership against allowed whitelist
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        AppError.forbidden(`Access restricted to roles: ${allowedRoles.join(', ')}`)
      );
    }

    next();
  };
};
