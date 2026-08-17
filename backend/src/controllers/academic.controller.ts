import { Request, Response, NextFunction } from 'express';
import { AcademicService } from '../services/academic.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class AcademicController {
  static async getBranches(req: Request, res: Response, next: NextFunction) {
    try {
      const branches = await AcademicService.getBranches();
      return ResponseFormatter.success(res, branches);
    } catch (error) {
      next(error);
    }
  }

  static async getSemesters(req: Request, res: Response, next: NextFunction) {
    try {
      const semesters = await AcademicService.getSemesters();
      return ResponseFormatter.success(res, semesters);
    } catch (error) {
      next(error);
    }
  }

  static async getSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await AcademicService.getSubjects(
        req.query.branchId as string,
        req.query.semesterId as string
      );
      return ResponseFormatter.success(res, subjects);
    } catch (error) {
      next(error);
    }
  }

  static async getSubjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const subject = await AcademicService.getSubjectById(req.params.id as string);
      return ResponseFormatter.success(res, subject);
    } catch (error) {
      next(error);
    }
  }

  static async getSubjectTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const topics = await AcademicService.getSubjectTopics(req.params.id as string);
      return ResponseFormatter.success(res, topics);
    } catch (error) {
      next(error);
    }
  }
}
