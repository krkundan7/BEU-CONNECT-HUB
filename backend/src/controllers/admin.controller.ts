import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class AdminController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      return ResponseFormatter.success(res, stats, 'Admin dashboard metrics');
    } catch (error) {
      next(error);
    }
  }

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
