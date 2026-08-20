import { Request, Response, NextFunction } from 'express';
import { OpportunityService } from '../services/opportunity.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * Student Opportunities, Hackathons & Internships Controller
 * Handles publishing verified career opportunities, multi-parameter querying (category, remote status, official source),
 * and retrieval of opportunity application links.
 */
export class OpportunityController {
  // Publishes a new hackathon, internship, or scholarship listing with verified source provenance
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const opp = await OpportunityService.createOpportunity(req.body);
      return ResponseFormatter.created(res, opp, 'Opportunity posted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Lists opportunities with multi-facet query filtering and boolean URL coercion
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, search, onlyOnline, onlyOfficial } = req.query;
      const opportunities = await OpportunityService.getOpportunities(
        category as any,
        search as string,
        onlyOnline !== undefined ? onlyOnline === 'true' : undefined,
        onlyOfficial !== undefined ? onlyOfficial === 'true' : undefined
      );
      return ResponseFormatter.success(res, opportunities, 'Opportunities retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves specific opportunity item including application guidelines and deadlines
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const opp = await OpportunityService.getOpportunityById(req.params.id as string);
      return ResponseFormatter.success(res, opp, 'Opportunity details retrieved');
    } catch (error) {
      next(error);
    }
  }
}
