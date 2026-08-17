import { Request, Response, NextFunction } from 'express';
import { NoticeService } from '../services/notice.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class NoticeController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const notice = await NoticeService.createNotice(req.body);
      return ResponseFormatter.created(res, notice, 'Official BEU notice broadcasted');
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notices = await NoticeService.getNotices(
        req.query.category as any,
        req.query.search as string
      );
      return ResponseFormatter.success(res, notices);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const notice = await NoticeService.getNoticeById(req.params.id as string);
      return ResponseFormatter.success(res, notice);
    } catch (error) {
      next(error);
    }
  }
}
