import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * Community Trust & Safety / Content Moderation Controller
 * Handles student submission of inappropriate content flags, moderator ticket review queues,
 * and resolution updates with administrative notes.
 */
export class ReportController {
  // Receives student reporting ticket against spam, abuse, or copyright infringement
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await ReportService.createReport(req.user!.id, req.body);
      return ResponseFormatter.created(res, report, 'Report submitted for moderation review');
    } catch (error) {
      next(error);
    }
  }

  // Lists moderation review tickets filtered by resolution status (PENDING, RESOLVED, DISMISSED)
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await ReportService.getReports(req.query.status as any);
      return ResponseFormatter.success(res, reports, 'Reports retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Resolves or dismisses a report ticket with moderator ID attribution and action remarks
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
