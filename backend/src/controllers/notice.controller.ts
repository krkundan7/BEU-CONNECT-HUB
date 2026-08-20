import { Request, Response, NextFunction } from 'express';
import { NoticeService } from '../services/notice.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * University Official Notices & Circulars Controller
 * Handles student personalized feeds, category/branch/semester notice discovery,
 * real-time official portal sync triggers, and administrative circular publishing.
 */
export class NoticeController {
  // Retrieves personalized notices matching logged-in student's branch & semester
  static async getPersonalized(req: Request, res: Response, next: NextFunction) {
    try {
      const notices = await NoticeService.getPersonalizedNotices(req.user!.id, {
        category: req.query.category as string,
        branchCode: req.query.branchCode as string,
        semesterNumber: req.query.semesterNumber ? Number(req.query.semesterNumber) : undefined,
        search: req.query.search as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
      });
      return ResponseFormatter.success(res, notices, 'Personalized student notices retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Lists official circulars with multi-facet filters (branch, semester, category, search, pagination)
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notices = await NoticeService.getNotices(
        {
          category: req.query.category as string,
          branchCode: req.query.branchCode as string,
          semesterNumber: req.query.semesterNumber ? Number(req.query.semesterNumber) : undefined,
          isImportant: req.query.isImportant === 'true' ? true : req.query.isImportant === 'false' ? false : undefined,
          isUrgent: req.query.isUrgent === 'true' ? true : req.query.isUrgent === 'false' ? false : undefined,
          search: req.query.search as string,
          page: req.query.page ? Number(req.query.page) : 1,
          limit: req.query.limit ? Number(req.query.limit) : 20,
        },
        req.user?.id
      );
      return ResponseFormatter.paginated(res, notices as any, 'Official BEU circulars retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves complete circular text and PDF document links
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const notice = await NoticeService.getNoticeById(req.params.id as string, req.user?.id);
      return ResponseFormatter.success(res, notice, 'Notice details retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Marks a notice as read for authenticated student
  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NoticeService.markNoticeAsRead(req.user!.id, req.params.id as string);
      return ResponseFormatter.success(res, result, 'Notice marked as read');
    } catch (error) {
      next(error);
    }
  }

  // Triggers official university portal notice synchronization
  static async sync(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NoticeService.syncOfficialNotices();
      return ResponseFormatter.success(res, result, 'Official BEU notices synchronized');
    } catch (error) {
      next(error);
    }
  }

  // Broadcasts a newly verified university notice (Admin privilege)
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const notice = await NoticeService.createNotice(req.body);
      return ResponseFormatter.created(res, notice, 'Official BEU notice broadcasted');
    } catch (error) {
      next(error);
    }
  }
}
