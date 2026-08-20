import { Request, Response, NextFunction } from 'express';
import { PostService } from '../services/post.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Campus Social Feed Controller
 * Dispatches feed post publishing, paginated retrieval with viewer reaction states,
 * post deletion with RBAC/author checks, comment threads, and bookmark collections.
 */
export class PostController {
  // Publishes a new text/media feed post associated with the authenticated author
  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await PostService.createPost(req.user!.id, req.body);
      return ResponseFormatter.created(res, post, 'Post published to campus feed');
    } catch (error) {
      next(error);
    }
  }

  /* NOV-COMMENT-42: JSend Paginated Feed Response Envelope
   * Passes viewer user UUID from optional JWT context to compute personalized 'isLiked' booleans.
   * Wraps resulting post items inside a structured pagination envelope containing page, totalPages, total, hasNext, and hasPrev indicators. */
  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await PostService.getPosts(req.user?.id, req.query as any);
      return ResponseFormatter.paginated(res, posts);
    } catch (error) {
      next(error);
    }
  }

  // Retrieves post details including comment tree and like count
  static async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await PostService.getPostById(req.params.id as string, req.user?.id);
      return ResponseFormatter.success(res, post, 'Post details retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Soft-deletes or purges a post if requested by author or an administrative moderator
  static async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      await PostService.deletePost(req.params.id as string, req.user!.id, req.user!.role);
      return ResponseFormatter.success(res, null, 'Post deleted');
    } catch (error) {
      next(error);
    }
  }

  // Toggles post like status and atomically adjusts post like counters
  static async toggleLike(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PostService.toggleLike(req.params.id as string, req.user!.id);
      return ResponseFormatter.success(res, result, result.isLiked ? 'Liked post' : 'Unliked post');
    } catch (error) {
      next(error);
    }
  }

  // Adds top-level or nested reply comments to a discussion thread
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

  // Polymorphically saves or unsaves posts, PYQs, and handwritten notes to student bookmarks
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

  // Retrieves authenticated student's saved bookmarks filtered by item type
  static async getBookmarks(req: Request, res: Response, next: NextFunction) {
    try {
      const bookmarks = await PostService.getBookmarks(req.user!.id, req.query.itemType as any);
      return ResponseFormatter.success(res, bookmarks, 'User bookmarks retrieved');
    } catch (error) {
      next(error);
    }
  }
}
