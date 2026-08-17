import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { storageService } from '../integrations/storage/localStorage.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../config/constants.js';

export class UserController {
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id as string);
      return ResponseFormatter.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.updateProfile(req.user!.id, req.body);
      return ResponseFormatter.success(res, updated, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw AppError.badRequest('No image file provided');
      }

      const uploadResult = await storageService.uploadFile(req.file, 'avatars');
      const updated = await UserService.updateAvatar(req.user!.id, uploadResult.url);

      return ResponseFormatter.success(res, updated, 'Avatar uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.deleteAvatar(req.user!.id);
      return ResponseFormatter.success(res, updated, 'Avatar reset to default');
    } catch (error) {
      next(error);
    }
  }

  static async addSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const skill = await UserService.addSkill(req.user!.id, req.body);
      return ResponseFormatter.created(res, skill, 'Skill added to profile');
    } catch (error) {
      next(error);
    }
  }

  static async removeSkill(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.removeSkill(req.user!.id, req.params.skillId as string);
      return ResponseFormatter.success(res, null, 'Skill removed from profile');
    } catch (error) {
      next(error);
    }
  }

  static async addAchievement(req: Request, res: Response, next: NextFunction) {
    try {
      const achievement = await UserService.addAchievement(req.user!.id, req.body);
      return ResponseFormatter.created(res, achievement, 'Achievement recorded');
    } catch (error) {
      next(error);
    }
  }

  static async deleteAchievement(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.deleteAchievement(req.user!.id, req.params.id as string);
      return ResponseFormatter.success(res, null, 'Achievement deleted');
    } catch (error) {
      next(error);
    }
  }

  static async toggleFollow(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.toggleFollow(req.user!.id, req.params.id as string);
      return ResponseFormatter.success(
        res,
        result,
        result.isFollowing ? 'Followed user' : 'Unfollowed user'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const followers = await UserService.getFollowers(req.params.id as string);
      return ResponseFormatter.success(res, followers);
    } catch (error) {
      next(error);
    }
  }

  static async getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const following = await UserService.getFollowing(req.params.id as string);
      return ResponseFormatter.success(res, following);
    } catch (error) {
      next(error);
    }
  }
}
