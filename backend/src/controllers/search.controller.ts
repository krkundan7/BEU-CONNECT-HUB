import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class SearchController {
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string) || '';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const results = await SearchService.globalSearch(query, limit);
      return ResponseFormatter.success(res, results);
    } catch (error) {
      next(error);
    }
  }
}
