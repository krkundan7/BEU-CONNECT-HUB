import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createProjectSchema } from '../validators/project.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

const router = Router();

router.post('/', requireAuth, validate(createProjectSchema), ProjectController.create);
router.get('/', optionalAuth, ProjectController.list);
router.get('/:id', optionalAuth, validate(uuidParamSchema), ProjectController.getById);
router.get('/:id/matches', requireAuth, validate(uuidParamSchema), ProjectController.getMatches);

export default router;
