import { Request, Response, NextFunction } from 'express';
import { PYQService } from '../services/pyq.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class PYQController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const pyq = await PYQService.createPYQ(req.user!.id, req.body);
      return ResponseFormatter.created(res, pyq, 'Solved PYQ paper added');
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const pyqs = await PYQService.getPYQs(
        req.query.subjectId as string,
        req.query.year ? parseInt(req.query.year as string, 10) : undefined
      );
      return ResponseFormatter.success(res, pyqs);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const pyq = await PYQService.getPYQById(req.params.id as string);
      return ResponseFormatter.success(res, pyq);
    } catch (error) {
      next(error);
    }
  }
}
