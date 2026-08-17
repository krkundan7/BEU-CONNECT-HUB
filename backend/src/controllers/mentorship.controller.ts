import { Request, Response, NextFunction } from 'express';
import { MentorshipService } from '../services/mentorship.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class MentorshipController {
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await MentorshipService.upsertMentorProfile(req.user!.id, req.body);
      return ResponseFormatter.success(res, profile, 'Senior mentor profile updated');
    } catch (error) {
      next(error);
    }
  }

  static async listMentors(req: Request, res: Response, next: NextFunction) {
    try {
      const mentors = await MentorshipService.getMentors(req.query.domain as string);
      return ResponseFormatter.success(res, mentors);
    } catch (error) {
      next(error);
    }
  }

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
