import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../utils/AppError.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { Logger } from '../utils/logger.js';
import { HTTP_STATUS } from '../config/constants.js';

/* NOV-COMMENT-48: Centralized Error Translation & Stack Trace Suppression
 * Intercepts all unhandled exceptions thrown across Express middleware, controllers, and services.
 * Distinguishes between intentional operational 'AppError' instances, Multer multipart errors, and database ORM exceptions.
 * Formats standardized JSON error envelopes and strictly suppresses internal stack traces in production. */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response => {
  // Intercept operational AppError instances to preserve explicit HTTP status codes, error codes, and field validation metadata
  if (err instanceof AppError) {
    Logger.warn(`Operational Error: ${err.message}`, {
      code: err.code,
      statusCode: err.statusCode,
      path: req.originalUrl,
      method: req.method,
    });

    return ResponseFormatter.error(res, err.message, err.statusCode, err.code, err.details);
  }

  // Intercept Multer file upload errors (e.g. LIMIT_FILE_SIZE, LIMIT_UNEXPECTED_FILE)
  if (err instanceof multer.MulterError) {
    let message = `File upload error: ${err.message}`;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size limit exceeded. Maximum allowed file size is 25MB.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected upload field "${err.field}". Please attach your file using field "file", "image", "document", or "avatar".`;
    }

    Logger.warn(`Multer Upload Error: ${message}`, {
      code: err.code,
      field: err.field,
      path: req.originalUrl,
    });

    return ResponseFormatter.error(
      res,
      message,
      HTTP_STATUS.BAD_REQUEST,
      'FILE_UPLOAD_ERROR',
      { multerCode: err.code, field: err.field }
    );
  }

  // Intercept PayloadTooLargeError from body-parser
  if (err.type === 'entity.too.large' || err.status === 413) {
    return ResponseFormatter.error(
      res,
      'Request payload too large. Please upload smaller attachments (under 25MB).',
      HTTP_STATUS.BAD_REQUEST,
      'PAYLOAD_TOO_LARGE'
    );
  }

  // Intercept Prisma P2002 unique constraint violations
  if (err.code === 'P2002') {
    const fields = err.meta?.target ? (err.meta.target as string[]).join(', ') : 'field';
    return ResponseFormatter.error(
      res,
      `A record with this ${fields} already exists`,
      HTTP_STATUS.CONFLICT,
      'DUPLICATE_ENTRY'
    );
  }

  // Map Prisma P2025 record-not-found errors during updates/deletes to standard HTTP 404 responses
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
