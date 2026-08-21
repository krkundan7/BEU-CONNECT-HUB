import { Request, Response, NextFunction } from 'express';

/**
 * Middleware: Adds compression headers hint
 */
export function compressionHelper(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('Vary', 'Accept-Encoding');
  next();
}
