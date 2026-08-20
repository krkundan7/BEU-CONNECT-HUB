import { Router } from 'express';
import { CommunityController } from '../controllers/community.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCommunitySchema, createCommunityPostSchema } from '../validators/community.validator.js';

/**
 * Campus Communities & Special Interest Clubs Routes (`/api/communities`)
 * Provides endpoints for student club management, membership enrollment,
 * and scoped community discussion forums.
 */
const router = Router();

// Community creation and discovery listings
router.post('/', requireAuth, validate(createCommunitySchema), CommunityController.create);
router.get('/', optionalAuth, CommunityController.list);
router.get('/:id', optionalAuth, CommunityController.getById);

// Student membership state transitions
router.post('/:id/join', requireAuth, CommunityController.toggleJoin);
router.delete('/:id/leave', requireAuth, CommunityController.toggleJoin);

// Community-scoped discussion threads
router.post('/:id/posts', requireAuth, validate(createCommunityPostSchema), CommunityController.createPost);
router.get('/:id/posts', optionalAuth, CommunityController.getPosts);

export default router;
