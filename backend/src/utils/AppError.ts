import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';

/* NOV-COMMENT-46: Operational AppError Hierarchy & Prototype Restoration
 * Extends the native JavaScript Error class with HTTP status codes, machine-readable domain error codes, and operational flags.
 * Explicitly executes 'Object.setPrototypeOf(this, new.target.prototype)' to maintain correct 'instanceof' checks across ES5/ES6 transpilation targets,
 * and calls 'Error.captureStackTrace' to provide clean debugging traces without polluting the call site. */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: string = ERROR_CODES.INTERNAL_ERROR,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: any) {
    return new AppError(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, details);
  }

  static unauthorized(message: string = 'Authentication required') {
    return new AppError(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.AUTHENTICATION_ERROR);
  }

  static forbidden(message: string = 'Permission denied') {
    return new AppError(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.AUTHORIZATION_ERROR);
  }

  static notFound(message: string = 'Resource not found') {
    return new AppError(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }

  static conflict(message: string) {
    return new AppError(message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
  }

  static validation(message: string, details?: any) {
    return new AppError(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR, details);
  }

  static tooManyRequests(message: string = 'Too many requests. Please try again later.') {
    return new AppError(message, HTTP_STATUS.TOO_MANY_REQUESTS, ERROR_CODES.RATE_LIMIT_EXCEEDED);
  }
}
