import { Request, Response, NextFunction } from 'express';
import { PYQService } from '../services/pyq.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * Previous Year Questions (PYQ) Controller
 * Handles student/faculty uploads of past university examination papers,
 * year/subject querying with integer coercion, and question solution retrieval.
 */
export class PYQController {
  // Uploads and indexes a new university exam question paper with solution links
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const pyq = await PYQService.createPYQ(req.user!.id, req.body);
      return ResponseFormatter.created(res, pyq, 'Solved PYQ paper added');
    } catch (error) {
      next(error);
    }
  }

  // Lists PYQs filtered by subject UUID and integer examination year
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const pyqs = await PYQService.getPYQs(
        req.query.subjectId as string,
        req.query.year ? parseInt(req.query.year as string, 10) : undefined
      );
      return ResponseFormatter.success(res, pyqs, 'PYQs retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves question paper metadata, solution attachment, and download links
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const pyq = await PYQService.getPYQById(req.params.id as string);
      return ResponseFormatter.success(res, pyq, 'PYQ details retrieved');
    } catch (error) {
      next(error);
    }
  }
}
