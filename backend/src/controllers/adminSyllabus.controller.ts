import { Request, Response, NextFunction } from 'express';
import { BEUSyllabusSyncService } from '../services/beuSyllabusSync.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class AdminSyllabusController {
  /**
   * Administrative endpoint initiating automated synchronization of the complete BEU curriculum hierarchy into the database.
   */
  static async syncOfficialSyllabus(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUserId = (req as any).user?.id;
      const result = await BEUSyllabusSyncService.syncAllFromOfficialSource(adminUserId);
      return ResponseFormatter.success(res, result, 'BEU syllabus synchronization completed');
    } catch (error) {
      next(error);
    }
  }

  static async importSyllabus(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUserId = (req as any).user?.id;
      const result = await BEUSyllabusSyncService.importSyllabus(req.body, adminUserId);
      return ResponseFormatter.created(res, result, 'Syllabus payload imported');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Activates a draft or reviewed syllabus version, recording the timestamp and approving administrator ID.
   */
  static async publishSyllabus(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUserId = (req as any).user?.id;
      const result = await BEUSyllabusSyncService.publishSyllabus(req.params.id as string, adminUserId);
      return ResponseFormatter.success(res, result, 'Syllabus published successfully');
    } catch (error) {
      next(error);
    }
  }

  static async archiveSyllabus(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUserId = (req as any).user?.id;
      const result = await BEUSyllabusSyncService.archiveSyllabus(req.params.id as string, adminUserId);
      return ResponseFormatter.success(res, result, 'Syllabus archived');
    } catch (error) {
      next(error);
    }
  }

  static async getVersions(req: Request, res: Response, next: NextFunction) {
    try {
      const versions = await BEUSyllabusSyncService.getSyllabusVersions();
      return ResponseFormatter.success(res, versions, 'Syllabus version history');
    } catch (error) {
      next(error);
    }
  }
}
