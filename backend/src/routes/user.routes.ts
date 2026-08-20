import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { updateProfileSchema, addSkillSchema, achievementSchema } from '../validators/user.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

/**
 * Student Profile & Social Graph Routes (`/api/users`)
 * Handles authenticated profile modifications, multipart avatar uploads,
 * skill/achievement inventories, and campus peer follow relationships.
 */
const router = Router();

// Current Authenticated User Actions
router.patch('/me', requireAuth, validate(updateProfileSchema), UserController.updateMe);
router.post('/me/avatar', requireAuth, upload.single('avatar'), UserController.uploadAvatar);
router.delete('/me/avatar', requireAuth, UserController.deleteAvatar);
router.post('/me/skills', requireAuth, validate(addSkillSchema), UserController.addSkill);
router.delete('/me/skills/:skillId', requireAuth, UserController.removeSkill);
router.post('/me/achievements', requireAuth, validate(achievementSchema), UserController.addAchievement);
router.delete('/achievements/:id', requireAuth, UserController.deleteAchievement);

// Public / User specific Profile & Peer Follow Graph
router.get('/:id', validate(uuidParamSchema), UserController.getUserById);
router.post('/:id/follow', requireAuth, validate(uuidParamSchema), UserController.toggleFollow);
router.delete('/:id/follow', requireAuth, validate(uuidParamSchema), UserController.toggleFollow);
router.get('/:id/followers', validate(uuidParamSchema), UserController.getFollowers);
router.get('/:id/following', validate(uuidParamSchema), UserController.getFollowing);

export default router;
