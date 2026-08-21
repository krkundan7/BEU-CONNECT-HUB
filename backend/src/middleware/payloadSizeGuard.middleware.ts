import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Middleware: Guards payload content-length
 */
export function payloadSizeGuard(maxBytes = 52428800) { // 50MB
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > maxBytes) {
      return next(new AppError(`Payload size exceeds limit of ${maxBytes / (1024 * 1024)}MB`, 413));
    }
    next();
  };
}
