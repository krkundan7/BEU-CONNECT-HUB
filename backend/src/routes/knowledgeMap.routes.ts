import { Router } from 'express';
import { KnowledgeMapController } from '../controllers/knowledgeMap.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

const subjectParamSchema = z.object({
  params: z.object({
    subjectId: z.string().uuid(),
  }),
});

router.get('/:subjectId', validate(subjectParamSchema), KnowledgeMapController.getSubjectMap);

export default router;
