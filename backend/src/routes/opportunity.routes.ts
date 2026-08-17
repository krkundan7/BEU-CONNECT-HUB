import { Router } from 'express';
import { OpportunityController } from '../controllers/opportunity.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createOpportunitySchema } from '../validators/notice.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

const router = Router();

router.post('/', requireAuth, validate(createOpportunitySchema), OpportunityController.create);
router.get('/', OpportunityController.list);
router.get('/:id', validate(uuidParamSchema), OpportunityController.getById);

export default router;
