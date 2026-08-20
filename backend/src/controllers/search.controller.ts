import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * Universal Global Search Controller
 * Accepts query string tokens and coordinates federated parallel searches across subjects,
 * study notes, PYQ papers, career opportunities, and campus student accounts.
 */
export class SearchController {
  // Dispatches global query token with integer result-per-category limit bounds
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string) || '';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const results = await SearchService.globalSearch(query, limit);
      return ResponseFormatter.success(res, results, 'Global search results');
    } catch (error) {
      next(error);
    }
  }
}
