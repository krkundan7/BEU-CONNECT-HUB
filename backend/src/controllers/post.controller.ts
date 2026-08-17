import { Request, Response, NextFunction } from 'express';
import { PostService } from '../services/post.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export class PostController {
  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await PostService.createPost(req.user!.id, req.body);
      return ResponseFormatter.created(res, post, 'Post published to campus feed');
    } catch (error) {
      next(error);
    }
  }

  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await PostService.getPosts(req.user?.id, req.query as any);
      return ResponseFormatter.paginated(res, posts);
    } catch (error) {
      next(error);
    }
  }

  static async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await PostService.getPostById(req.params.id as string, req.user?.id);
      return ResponseFormatter.success(res, post);
    } catch (error) {
      next(error);
    }
  }

  static async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      await PostService.deletePost(req.params.id as string, req.user!.id, req.user!.role);
      return ResponseFormatter.success(res, null, 'Post deleted');
    } catch (error) {
      next(error);
    }
  }

  static async toggleLike(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PostService.toggleLike(req.params.id as string, req.user!.id);
      return ResponseFormatter.success(res, result, result.isLiked ? 'Liked post' : 'Unliked post');
    } catch (error) {
      next(error);
    }
  }

  static async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await PostService.addComment(
        req.params.id as string,
        req.user!.id,
        req.body.content,
        req.body.parentId
      );
      return ResponseFormatter.created(res, comment, 'Comment added');
    } catch (error) {
      next(error);
    }
  }

  static async toggleBookmark(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PostService.toggleBookmark(
        req.user!.id,
        req.body.itemType,
        req.body.itemId
      );
      return ResponseFormatter.success(
        res,
        result,
        result.isBookmarked ? 'Item saved to bookmarks' : 'Item removed from bookmarks'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getBookmarks(req: Request, res: Response, next: NextFunction) {
    try {
      const bookmarks = await PostService.getBookmarks(req.user!.id, req.query.itemType as any);
      return ResponseFormatter.success(res, bookmarks);
    } catch (error) {
      next(error);
    }
  }
}
