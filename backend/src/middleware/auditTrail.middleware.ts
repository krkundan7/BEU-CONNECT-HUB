import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

export function auditTrailLogger(req: Request, res: Response, next: NextFunction): void {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const userId = (req as any).user?.id || 'anonymous';
    Logger.info(`[AUDIT] Action ${req.method} ${req.originalUrl} triggered by user: ${userId}`);
  }
  next();
}
