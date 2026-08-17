import { Router } from 'express';
import { MentorshipController } from '../controllers/mentorship.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { mentorProfileSchema, mentorshipRequestSchema } from '../validators/project.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

const router = Router();

router.post('/profile', requireAuth, validate(mentorProfileSchema), MentorshipController.updateProfile);
router.get('/', MentorshipController.listMentors);
router.post('/:id/request', requireAuth, validate(uuidParamSchema), validate(mentorshipRequestSchema), MentorshipController.requestGuidance);

export default router;
