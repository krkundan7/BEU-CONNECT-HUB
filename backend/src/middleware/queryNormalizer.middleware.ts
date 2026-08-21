import { Request, Response, NextFunction } from 'express';

/**
 * Middleware: Trims and normalizes query parameter strings
 */
export function queryNormalizer(req: Request, _res: Response, next: NextFunction): void {
  if (req.query && typeof req.query === 'object') {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = (req.query[key] as string).trim();
      }
    }
  }
  next();
}
