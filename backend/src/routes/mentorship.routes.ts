import { Router } from 'express';
import { MentorshipController } from '../controllers/mentorship.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { mentorProfileSchema, mentorshipRequestSchema } from '../validators/project.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

/**
 * Peer & Senior Mentorship Program Routes (`/api/mentors`)
 * Enables senior students and alumni to register mentor profiles,
 * lists vetted mentors, and processes guidance session requests.
 */
const router = Router();

// Register or update authenticated user's mentor availability and domains
router.post('/profile', requireAuth, validate(mentorProfileSchema), MentorshipController.updateProfile);

// Public directory of available mentors filtered by domain and college
router.get('/', MentorshipController.listMentors);

// Submit a structured 1-on-1 guidance request to a mentor
router.post('/:id/request', requireAuth, validate(uuidParamSchema), validate(mentorshipRequestSchema), MentorshipController.requestGuidance);

export default router;
