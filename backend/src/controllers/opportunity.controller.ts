import { Request, Response, NextFunction } from 'express';
import { OpportunityService } from '../services/opportunity.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class OpportunityController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const opp = await OpportunityService.createOpportunity(req.body);
      return ResponseFormatter.created(res, opp, 'Opportunity posted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const opportunities = await OpportunityService.getOpportunities(
        req.query.category as any,
        req.query.search as string
      );
      return ResponseFormatter.success(res, opportunities);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const opp = await OpportunityService.getOpportunityById(req.params.id as string);
      return ResponseFormatter.success(res, opp);
    } catch (error) {
      next(error);
    }
  }
}
