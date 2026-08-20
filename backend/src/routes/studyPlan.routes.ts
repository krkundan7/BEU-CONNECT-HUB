import { Router } from 'express';
import { StudyPlanController } from '../controllers/studyPlan.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createStudyPlanSchema } from '../validators/academic.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import { z } from 'zod';

/**
 * AI-Powered Exam Study Planner Routes
 * Manages dynamic study schedule generation, curriculum milestone roadmaps,
 * and individual daily revision task completion states.
 */
const router = Router();

const toggleTaskSchema = z.object({
  body: z.object({
    isCompleted: z.boolean(),
  }),
});

// Generate AI-tailored study timeline targeting upcoming university exams
router.post('/study-plans', requireAuth, validate(createStudyPlanSchema), StudyPlanController.createPlan);

// Retrieve all active study schedules created by the authenticated student
router.get('/study-plans', requireAuth, StudyPlanController.getPlans);

// Mark daily revision task checklist items as completed or pending
router.patch('/study-tasks/:id', requireAuth, validate(uuidParamSchema), validate(toggleTaskSchema), StudyPlanController.toggleTask);

export default router;
