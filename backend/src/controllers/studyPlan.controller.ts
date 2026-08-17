import { Request, Response, NextFunction } from 'express';
import { StudyPlanService } from '../services/studyPlan.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class StudyPlanController {
  static async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await StudyPlanService.createStudyPlan(req.user!.id, req.body);
      return ResponseFormatter.created(res, plan, 'Personalized revision plan generated');
    } catch (error) {
      next(error);
    }
  }

  static async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await StudyPlanService.getUserStudyPlans(req.user!.id);
      return ResponseFormatter.success(res, plans);
    } catch (error) {
      next(error);
    }
  }

  static async toggleTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await StudyPlanService.toggleTaskCompletion(req.params.id as string, req.body.isCompleted);
      return ResponseFormatter.success(res, task, 'Task updated');
    } catch (error) {
      next(error);
    }
  }
}
