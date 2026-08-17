import { Router } from 'express';
import { PostController } from '../controllers/post.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPostSchema, commentSchema, bookmarkSchema } from '../validators/post.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

const router = Router();

// Feed & Posts
router.post('/', requireAuth, validate(createPostSchema), PostController.createPost);
router.get('/', optionalAuth, PostController.getPosts);
router.get('/:id', optionalAuth, validate(uuidParamSchema), PostController.getPostById);
router.delete('/:id', requireAuth, validate(uuidParamSchema), PostController.deletePost);

// Likes & Comments
router.post('/:id/like', requireAuth, validate(uuidParamSchema), PostController.toggleLike);
router.delete('/:id/like', requireAuth, validate(uuidParamSchema), PostController.toggleLike);
router.post('/:id/comments', requireAuth, validate(commentSchema), PostController.addComment);

// Bookmarks
router.post('/bookmarks/toggle', requireAuth, validate(bookmarkSchema), PostController.toggleBookmark);
router.get('/bookmarks/my', requireAuth, PostController.getBookmarks);

export default router;
