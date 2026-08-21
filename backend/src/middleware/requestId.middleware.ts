import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Middleware: Attaches unique correlation Request-ID to incoming requests
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const reqId = (req.headers['x-request-id'] as string) || `req_${crypto.randomBytes(6).toString('hex')}`;
  req.headers['x-request-id'] = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
}
