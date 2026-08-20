import { Request, Response, NextFunction } from 'express';
import { AcademicService } from '../services/academic.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * Academic Controller
 * Orchestrates HTTP requests for university curriculum entities (sessions, regulations, branches, semesters, subjects),
 * handles query string parameter coercion, and interfaces with the AcademicService persistence layer.
 */
export class AcademicController {
  // Retrieves list of academic session cohorts
  static async getSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await AcademicService.getSessions();
      return ResponseFormatter.success(res, sessions, 'Academic sessions fetched');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves curriculum regulation versions (e.g. R26, AICTE Model)
  static async getRegulations(req: Request, res: Response, next: NextFunction) {
    try {
      const regulations = await AcademicService.getRegulations();
      return ResponseFormatter.success(res, regulations, 'Regulations fetched');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves all 34 official engineering branch disciplines
  static async getBranches(req: Request, res: Response, next: NextFunction) {
    try {
      const branches = await AcademicService.getBranches();
      return ResponseFormatter.success(res, branches, 'BEU B.Tech branches fetched');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves standard 8 semester progression tiers
  static async getSemesters(req: Request, res: Response, next: NextFunction) {
    try {
      const semesters = await AcademicService.getSemesters();
      return ResponseFormatter.success(res, semesters, 'Semesters fetched');
    } catch (error) {
      next(error);
    }
  }

  /* NOV-COMMENT-41: Controller Query Unpacking & Type Coercion for Subjects
   * Parses and casts stringified URL query parameters (branchCode, semesterNumber, regulationCode)
   * into typed filter DTOs before dispatching to the academic service layer. */
  static async getSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await AcademicService.getSubjects({
        branchId: req.query.branchId as string,
        branchCode: req.query.branchCode as string,
        semesterId: req.query.semesterId as string,
        semesterNumber: req.query.semesterNumber ? Number(req.query.semesterNumber) : undefined,
        regulationId: req.query.regulationId as string,
        regulationCode: req.query.regulationCode as string,
        search: req.query.search as string,
      });
      return ResponseFormatter.success(res, subjects, 'Subjects fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves complete subject syllabus tree including units, topics, and user completion flags
  static async getSubjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const subject = await AcademicService.getSubjectById(req.params.id as string, userId);
      return ResponseFormatter.success(res, subject, 'Subject details retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Executes multi-keyword search across syllabus units, topics, and subtopic definitions with optional branch/semester scoping.
   */
  static async searchSyllabus(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q || req.query.query || '') as string;
      const results = await AcademicService.searchSyllabus(query, {
        branchCode: req.query.branchCode as string,
        semesterNumber: req.query.semesterNumber ? Number(req.query.semesterNumber) : undefined,
      });
      return ResponseFormatter.success(res, results, 'Syllabus search results');
    } catch (error) {
      next(error);
    }
  }

  // Calculates user overall curriculum completion percentage across enrolled branch/semester
  static async getUserProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'demo-user-id';
      const progress = await AcademicService.getUserProgress(
        userId,
        req.query.branchCode as string,
        req.query.semesterNumber ? Number(req.query.semesterNumber) : undefined
      );
      return ResponseFormatter.success(res, progress, 'User academic progress calculated');
    } catch (error) {
      next(error);
    }
  }

  // Updates completion status and revision notes for a specific syllabus topic
  static async updateTopicProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'demo-user-id';
      const topicId = req.params.topicId || req.body.topicId;
      const { status, progressPercentage, notes } = req.body;

      const progress = await AcademicService.updateTopicProgress(userId, topicId, {
        status,
        progressPercentage,
        notes,
      });
      return ResponseFormatter.success(res, progress, 'Topic progress updated');
    } catch (error) {
      next(error);
    }
  }

  // Generates prioritized topic study suggestions based on exam weightage and uncompleted items
  static async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'demo-user-id';
      const recommendations = await AcademicService.getStudyRecommendations(userId);
      return ResponseFormatter.success(res, recommendations, 'Study recommendations generated');
    } catch (error) {
      next(error);
    }
  }
}
