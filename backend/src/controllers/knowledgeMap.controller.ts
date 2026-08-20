import { Request, Response, NextFunction } from 'express';
import { KnowledgeMapService } from '../services/knowledgeMap.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * Subject Knowledge Map Controller
 * Dispatches requests to construct interactive Directed Acyclic Graphs (DAG) of topic dependencies,
 * prerequisite structures, and difficulty tiers for academic subjects.
 */
export class KnowledgeMapController {
  // Retrieves concept nodes and prerequisite link vectors for a specific subject
  static async getSubjectMap(req: Request, res: Response, next: NextFunction) {
    try {
      const map = await KnowledgeMapService.getSubjectKnowledgeMap(req.params.subjectId as string);
      return ResponseFormatter.success(res, map, 'Subject knowledge map generated');
    } catch (error) {
      next(error);
    }
  }
}
