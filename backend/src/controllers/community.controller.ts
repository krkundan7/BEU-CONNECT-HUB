import { Request, Response, NextFunction } from 'express';
import { CommunityService } from '../services/community.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Campus Communities & Clubs Controller
 * Manages student engineering club creation, discovery queries with category facets,
 * member enrollments/departures, and club-internal discussion feeds.
 */
export class CommunityController {
  // Creates a new student interest group or department club
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const comm = await CommunityService.createCommunity(req.user!.id, req.body);
      return ResponseFormatter.created(res, comm, 'Student community created successfully');
    } catch (error) {
      next(error);
    }
  }

  // Lists communities matching category filters and keyword searches
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const communities = await CommunityService.getCommunities(
        req.query.category as any,
        req.query.search as string
      );
      return ResponseFormatter.success(res, communities, 'Communities retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves community overview, leadership roster, and viewer membership state
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const comm = await CommunityService.getCommunityById(req.params.id as string, req.user?.id);
      return ResponseFormatter.success(res, comm, 'Community details retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Toggles user membership in a community hub and adjusts member count
  static async toggleJoin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CommunityService.toggleJoinCommunity(req.params.id as string, req.user!.id);
      return ResponseFormatter.success(
        res,
        result,
        result.isMember ? 'Joined community' : 'Left community'
      );
    } catch (error) {
      next(error);
    }
  }

  // Starts a new discussion thread inside a community
  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await CommunityService.createCommunityPost(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      return ResponseFormatter.created(res, post, 'Discussion started');
    } catch (error) {
      next(error);
    }
  }

  // Lists discussion threads belonging to a community
  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await CommunityService.getCommunityPosts(req.params.id as string);
      return ResponseFormatter.success(res, posts, 'Community posts retrieved');
    } catch (error) {
      next(error);
    }
  }
}
