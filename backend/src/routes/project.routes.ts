import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createProjectSchema } from '../validators/project.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

/**
 * Student Engineering Projects & Teammate Matching Routes (`/api/projects`)
 * Facilitates project showcase listings, team formation recruitment,
 * and skill-overlap teammate matching.
 */
const router = Router();

// Create a new collaborative project post
router.post('/', requireAuth, validate(createProjectSchema), ProjectController.create);

// List active collaborative projects with skill and category filters
router.get('/', optionalAuth, ProjectController.list);

// Retrieve project details and current team roster
router.get('/:id', optionalAuth, validate(uuidParamSchema), ProjectController.getById);

// Algorithmic candidate matching based on required skills vs registered student skill profiles
router.get('/:id/matches', requireAuth, validate(uuidParamSchema), ProjectController.getMatches);

export default router;
