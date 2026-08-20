import { Router } from 'express';
import { KnowledgeMapController } from '../controllers/knowledgeMap.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { z } from 'zod';

/**
 * Subject Knowledge Map & Conceptual Prerequisite Tree Routes (`/api/knowledge-map`)
 * Exposes visual Directed Acyclic Graphs (DAG) of topic dependencies,
 * prerequisite foundations, and difficulty weights for a given engineering subject.
 */
const router = Router();

const subjectParamSchema = z.object({
  params: z.object({
    subjectId: z.string().uuid(),
  }),
});

// Retrieve interconnected knowledge nodes and dependency edges for interactive concept mapping
router.get('/:subjectId', validate(subjectParamSchema), KnowledgeMapController.getSubjectMap);

export default router;
