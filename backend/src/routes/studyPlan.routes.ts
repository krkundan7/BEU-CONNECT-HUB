import { Router } from 'express';
import { StudyPlanController } from '../controllers/studyPlan.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createStudyPlanSchema } from '../validators/academic.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import { z } from 'zod';

const router = Router();

const toggleTaskSchema = z.object({
  body: z.object({
    isCompleted: z.boolean(),
  }),
});

router.post('/study-plans', requireAuth, validate(createStudyPlanSchema), StudyPlanController.createPlan);
router.get('/study-plans', requireAuth, StudyPlanController.getPlans);
router.patch('/study-tasks/:id', requireAuth, validate(uuidParamSchema), validate(toggleTaskSchema), StudyPlanController.toggleTask);

export default router;
