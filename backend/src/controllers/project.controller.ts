import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class ProjectController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.user!.id, req.body);
      return ResponseFormatter.created(res, project, 'Project created and recruiting live');
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await ProjectService.getProjects(
        req.query.status as any,
        req.query.search as string
      );
      return ResponseFormatter.success(res, projects);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.getProjectById(req.params.id as string);
      return ResponseFormatter.success(res, project);
    } catch (error) {
      next(error);
    }
  }

  static async getMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const matches = await ProjectService.findMatchesForProject(req.params.id as string);
      return ResponseFormatter.success(res, matches, 'Recommended project teammates');
    } catch (error) {
      next(error);
    }
  }
}
