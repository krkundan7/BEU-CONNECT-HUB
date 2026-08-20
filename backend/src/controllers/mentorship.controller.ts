import { Request, Response, NextFunction } from 'express';
import { MentorshipService } from '../services/mentorship.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * Senior & Alumni Mentorship Controller
 * Manages mentor profile registration, domain directory querying,
 * and 1-on-1 mentorship session scheduling requests.
 */
export class MentorshipController {
  // Creates or updates the authenticated user's mentor availability and technical domains
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await MentorshipService.upsertMentorProfile(req.user!.id, req.body);
      return ResponseFormatter.success(res, profile, 'Senior mentor profile updated');
    } catch (error) {
      next(error);
    }
  }

  // Lists verified mentors filtered by domain expertise (e.g. AI/ML, Cloud, Core Gate prep)
  static async listMentors(req: Request, res: Response, next: NextFunction) {
    try {
      const mentors = await MentorshipService.getMentors(req.query.domain as string);
      return ResponseFormatter.success(res, mentors, 'Mentors retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Submits a formal mentorship request from a student to a target mentor
  static async requestGuidance(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await MentorshipService.requestMentorship(
        req.user!.id,
        req.params.id as string,
        req.body
      );
      return ResponseFormatter.created(res, request, 'Mentorship guidance request submitted');
    } catch (error) {
      next(error);
    }
  }
}
