import { Router } from 'express';
import { CommunityController } from '../controllers/community.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCommunitySchema, createCommunityPostSchema } from '../validators/community.validator.js';

const router = Router();

router.post('/', requireAuth, validate(createCommunitySchema), CommunityController.create);
router.get('/', optionalAuth, CommunityController.list);
router.get('/:id', optionalAuth, CommunityController.getById);
router.post('/:id/join', requireAuth, CommunityController.toggleJoin);
router.delete('/:id/leave', requireAuth, CommunityController.toggleJoin);
router.post('/:id/posts', requireAuth, validate(createCommunityPostSchema), CommunityController.createPost);
router.get('/:id/posts', optionalAuth, CommunityController.getPosts);

export default router;
