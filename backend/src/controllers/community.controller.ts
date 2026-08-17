import { Request, Response, NextFunction } from 'express';
import { CommunityService } from '../services/community.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export class CommunityController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const comm = await CommunityService.createCommunity(req.user!.id, req.body);
      return ResponseFormatter.created(res, comm, 'Student community created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const communities = await CommunityService.getCommunities(
        req.query.category as any,
        req.query.search as string
      );
      return ResponseFormatter.success(res, communities);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const comm = await CommunityService.getCommunityById(req.params.id as string, req.user?.id);
      return ResponseFormatter.success(res, comm);
    } catch (error) {
      next(error);
    }
  }

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

  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await CommunityService.getCommunityPosts(req.params.id as string);
      return ResponseFormatter.success(res, posts);
    } catch (error) {
      next(error);
    }
  }
}
