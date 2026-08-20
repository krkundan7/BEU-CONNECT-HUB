import { Response } from 'express';
import { HTTP_STATUS } from '../config/constants.js';
import { ApiResponse, PaginatedResult } from '../types/index.js';

/**
 * Unified response envelope builder ensuring consistent JSend-compliant `{ success, data, message, error }` schemas across all endpoints.
 */
export class ResponseFormatter {
  static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = HTTP_STATUS.OK): Response {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data: T, message: string = 'Resource created successfully'): Response {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  /**
   * Formats paginated query results with item collections and boundary navigation metadata (page, limit, total, totalPages, hasNext, hasPrev).
   */
  static paginated<T>(res: Response, result: PaginatedResult<T>, message: string = 'Success'): Response {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev,
      },
    });
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: string = 'INTERNAL_ERROR',
    details?: any
  ): Response {
    const payload: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
    };
    return res.status(statusCode).json(payload);
  }
}
