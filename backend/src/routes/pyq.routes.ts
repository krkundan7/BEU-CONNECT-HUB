import { Router } from 'express';
import { PYQController } from '../controllers/pyq.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPYQSchema } from '../validators/academic.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

const router = Router();

router.post('/', requireAuth, validate(createPYQSchema), PYQController.create);
router.get('/', PYQController.list);
router.get('/:id', validate(uuidParamSchema), PYQController.getById);

export default router;
