import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * Collaborative Student Projects & Team Formation Controller
 * Coordinates creation of student hackathon/capstone projects, status-filtered project discovery,
 * and skill-overlap algorithmic teammate matching.
 */
export class ProjectController {
  /**
   * Project creation controller associating the authenticated user as team lead and initializing collaboration status.
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.user!.id, req.body);
      return ResponseFormatter.created(res, project, 'Project created and recruiting live');
    } catch (error) {
      next(error);
    }
  }

  // Lists collaborative projects filtered by lifecycle status (IDEA, LOOKING_FOR_TEAM, IN_PROGRESS)
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await ProjectService.getProjects(
        req.query.status as any,
        req.query.search as string
      );
      return ResponseFormatter.success(res, projects, 'Projects retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves project showcase overview and current team members
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.getProjectById(req.params.id as string);
      return ResponseFormatter.success(res, project, 'Project details retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Teammate recommendation endpoint computing skill match percentages and returning sorted candidate peer lists.
   */
  static async getMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const matches = await ProjectService.findMatchesForProject(req.params.id as string);
      return ResponseFormatter.success(res, matches, 'Recommended project teammates');
    } catch (error) {
      next(error);
    }
  }
}
