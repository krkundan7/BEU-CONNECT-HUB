import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function requireJsonContent(req: Request, res: Response, next: NextFunction): void {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
      return next(new AppError('Content-Type must be application/json or multipart/form-data', 415));
    }
  }
  next();
}
