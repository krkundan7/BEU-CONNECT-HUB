import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class ReportController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await ReportService.createReport(req.user!.id, req.body);
      return ResponseFormatter.created(res, report, 'Report submitted for moderation review');
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await ReportService.getReports(req.query.status as any);
      return ResponseFormatter.success(res, reports);
    } catch (error) {
      next(error);
    }
  }

  static async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      const resolved = await ReportService.updateReportStatus(
        req.params.id as string,
        req.user!.id,
        req.body.status,
        req.body.adminNote
      );
      return ResponseFormatter.success(res, resolved, 'Report status updated');
    } catch (error) {
      next(error);
    }
  }
}
