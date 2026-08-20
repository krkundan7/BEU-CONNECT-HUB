import { Router } from 'express';
import { PostController } from '../controllers/post.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPostSchema, commentSchema, bookmarkSchema } from '../validators/post.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

/**
 * Campus Social Feed & Engagement Routes (`/api/posts`)
 * Manages post publication, chronological and trending feed feeds,
 * optimistic reaction toggling, nested comments, and item bookmarking.
 */
const router = Router();

// Feed publication and paginated feed retrieval with optional viewer context
router.post('/', requireAuth, validate(createPostSchema), PostController.createPost);
router.get('/', optionalAuth, PostController.getPosts);
router.get('/:id', optionalAuth, validate(uuidParamSchema), PostController.getPostById);
router.delete('/:id', requireAuth, validate(uuidParamSchema), PostController.deletePost);

// Social reactions and threaded commentary
router.post('/:id/like', requireAuth, validate(uuidParamSchema), PostController.toggleLike);
router.delete('/:id/like', requireAuth, validate(uuidParamSchema), PostController.toggleLike);
router.post('/:id/comments', requireAuth, validate(commentSchema), PostController.addComment);

// Polymorphic student bookmark management
router.post('/bookmarks/toggle', requireAuth, validate(bookmarkSchema), PostController.toggleBookmark);
router.get('/bookmarks/my', requireAuth, PostController.getBookmarks);

export default router;
