import { Request, Response, NextFunction } from 'express';
import { StudyPlanService } from '../services/studyPlan.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * Exam Study Planner & Task Management Controller
 * Generates custom academic study roadmaps divided into daily revision tasks,
 * and maintains completion records for student self-tracking.
 */
export class StudyPlanController {
  // Generates a tailored multi-week study timeline mapped to target BEU examination dates
  static async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await StudyPlanService.createStudyPlan(req.user!.id, req.body);
      return ResponseFormatter.created(res, plan, 'Personalized revision plan generated');
    } catch (error) {
      next(error);
    }
  }

  // Lists all active and completed study plans created by the student
  static async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await StudyPlanService.getUserStudyPlans(req.user!.id);
      return ResponseFormatter.success(res, plans, 'Study plans retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Toggles completion flag on a specific study plan daily task checklist item
  static async toggleTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await StudyPlanService.toggleTaskCompletion(req.params.id as string, req.body.isCompleted);
      return ResponseFormatter.success(res, task, 'Task updated');
    } catch (error) {
      next(error);
    }
  }
}
