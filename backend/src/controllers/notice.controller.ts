import { Request, Response, NextFunction } from 'express';
import { NoticeService } from '../services/notice.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * University Official Notices & Circulars Controller
 * Handles administrative publishing of university circulars, category-based notice querying,
 * and retrieval of official exam schedules and results.
 */
export class NoticeController {
  // Broadcasts a newly verified university notice or examination schedule
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const notice = await NoticeService.createNotice(req.body);
      return ResponseFormatter.created(res, notice, 'Official BEU notice broadcasted');
    } catch (error) {
      next(error);
    }
  }

  // Lists official circulars filtered by category (EXAM, RESULT, ADMISSION, SCHOLARSHIP)
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notices = await NoticeService.getNotices(
        req.query.category as any,
        req.query.search as string
      );
      return ResponseFormatter.success(res, notices, 'Notices retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves complete circular text and PDF document links
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const notice = await NoticeService.getNoticeById(req.params.id as string);
      return ResponseFormatter.success(res, notice, 'Notice details retrieved');
    } catch (error) {
      next(error);
    }
  }
}
