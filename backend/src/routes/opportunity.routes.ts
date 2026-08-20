import { Router } from 'express';
import { OpportunityController } from '../controllers/opportunity.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createOpportunitySchema } from '../validators/notice.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

/**
 * Career Opportunities, Internships & Hackathons Routes (`/api/opportunities`)
 * Houses endpoints for posting verified student opportunities,
 * listing active openings with multi-facet filters, and viewing specific circulars.
 */
const router = Router();

// Post a verified hackathon, internship, workshop, or grant opportunity
router.post('/', requireAuth, validate(createOpportunitySchema), OpportunityController.create);

// Public queryable directory of active opportunities filtered by category, deadline, and online status
router.get('/', OpportunityController.list);

// Retrieve detailed opportunity metadata including verified source citations
router.get('/:id', validate(uuidParamSchema), OpportunityController.getById);

export default router;
