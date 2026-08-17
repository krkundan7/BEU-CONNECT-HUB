import { Request, Response, NextFunction } from 'express';
import { KnowledgeMapService } from '../services/knowledgeMap.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class KnowledgeMapController {
  static async getSubjectMap(req: Request, res: Response, next: NextFunction) {
    try {
      const map = await KnowledgeMapService.getSubjectKnowledgeMap(req.params.subjectId as string);
      return ResponseFormatter.success(res, map);
    } catch (error) {
      next(error);
    }
  }
}
