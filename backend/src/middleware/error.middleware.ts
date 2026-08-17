import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { Logger } from '../utils/logger.js';
import { HTTP_STATUS } from '../config/constants.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response => {
  // If it's our known operational error
  if (err instanceof AppError) {
    Logger.warn(`Operational Error: ${err.message}`, {
      code: err.code,
      statusCode: err.statusCode,
      path: req.originalUrl,
      method: req.method,
    });

    return ResponseFormatter.error(res, err.message, err.statusCode, err.code, err.details);
  }

  // Handle Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    const fields = err.meta?.target ? (err.meta.target as string[]).join(', ') : 'field';
    return ResponseFormatter.error(
      res,
      `A record with this ${fields} already exists`,
      HTTP_STATUS.CONFLICT,
      'DUPLICATE_ENTRY'
    );
  }

  // Handle Prisma Record Not Found (P2025)
  if (err.code === 'P2025') {
    return ResponseFormatter.error(
      res,
      'The requested database record does not exist',
      HTTP_STATUS.NOT_FOUND,
      'NOT_FOUND'
    );
  }

  // Unhandled / system errors
  Logger.error(`Unhandled Server Error: ${err.message}`, {
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
  });

  const message =
    process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred. Please try again later.'
      : err.message || 'Internal Server Error';

  return ResponseFormatter.error(
    res,
    message,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
  );
};
