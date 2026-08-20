import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * System Administration Controller
 * Gathers server-side analytics, aggregate user counts, pending verification queues,
 * and security audit event logs for administrative review.
 */
export class AdminController {
  /* NOV-COMMENT-45: Administrator Metric Aggregation & Health Inspection
   * Dispatches high-level aggregation queries returning totals of registered students, verified users,
   * active communities, published syllabus nodes, and pending moderation/verification tickets. */
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      return ResponseFormatter.success(res, stats, 'Admin dashboard metrics');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves bounded security audit logs with integer limit bounds
  static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const logs = await AdminService.getAuditLogs(limit);
      return ResponseFormatter.success(res, logs, 'Admin audit action logs');
    } catch (error) {
      next(error);
    }
  }
}
