import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { storageService } from '../integrations/storage/localStorage.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Student Profile & Social Graph Controller
 * Handles user profile reading/updates, avatar file ingestion via Multer storage,
 * skill additions/removals, student achievements, and bidirectional follow relationships.
 */
export class UserController {
  // Retrieves public profile, academic affiliations, and aggregated social stats by user UUID
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id as string);
      return ResponseFormatter.success(res, user, 'User profile retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Updates current authenticated user's profile fields (bio, career goals, external links)
  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.updateProfile(req.user!.id, req.body);
      return ResponseFormatter.success(res, updated, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /* NOV-COMMENT-43: Multipart Avatar Ingestion & Storage Bridge
   * Intercepts memory-buffered image upload from Multer middleware ('req.file').
   * Delegates persistence to the storage provider ('avatars' bucket/dir) and updates user record with the public CDN/static URL. */
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

  // Resets user avatar to auto-generated DiceBear deterministic SVG avatar
  static async deleteAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.deleteAvatar(req.user!.id);
      return ResponseFormatter.success(res, updated, 'Avatar reset to default');
    } catch (error) {
      next(error);
    }
  }

  // Links a technical skill to the authenticated student's profile with proficiency rating
  static async addSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const skill = await UserService.addSkill(req.user!.id, req.body);
      return ResponseFormatter.created(res, skill, 'Skill added to profile');
    } catch (error) {
      next(error);
    }
  }

  // Removes a previously associated skill from the student's profile
  static async removeSkill(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.removeSkill(req.user!.id, req.params.skillId as string);
      return ResponseFormatter.success(res, null, 'Skill removed from profile');
    } catch (error) {
      next(error);
    }
  }

  // Records a student competition prize, certification, or academic milestone
  static async addAchievement(req: Request, res: Response, next: NextFunction) {
    try {
      const achievement = await UserService.addAchievement(req.user!.id, req.body);
      return ResponseFormatter.created(res, achievement, 'Achievement recorded');
    } catch (error) {
      next(error);
    }
  }

  // Deletes a student achievement record with ownership validation
  static async deleteAchievement(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.deleteAchievement(req.user!.id, req.params.id as string);
      return ResponseFormatter.success(res, null, 'Achievement deleted');
    } catch (error) {
      next(error);
    }
  }

  // Toggles follow/unfollow connection between two students and updates social count caches
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

  // Retrieves list of followers for a target user
  static async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const followers = await UserService.getFollowers(req.params.id as string);
      return ResponseFormatter.success(res, followers, 'Followers retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves list of accounts followed by target user
  static async getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const following = await UserService.getFollowing(req.params.id as string);
      return ResponseFormatter.success(res, following, 'Following list retrieved');
    } catch (error) {
      next(error);
    }
  }
}
