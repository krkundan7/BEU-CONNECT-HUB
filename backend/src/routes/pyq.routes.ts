import { Router } from 'express';
import { PYQController } from '../controllers/pyq.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPYQSchema } from '../validators/academic.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

/**
 * Previous Year Question Papers (PYQ) Archive Routes (`/api/pyqs`)
 * Manages university examination paper uploads, indexed year-wise querying,
 * and verified answer key/solution downloads.
 */
const router = Router();

// Upload a question paper and associated solution PDF
router.post('/', requireAuth, validate(createPYQSchema), PYQController.create);

// Query PYQs filtered by subject, branch, semester, and examination year
router.get('/', PYQController.list);

// Retrieve PYQ details and download asset URLs
router.get('/:id', validate(uuidParamSchema), PYQController.getById);

export default router;
