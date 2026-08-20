import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { aiChatSchema, aiAnalyzePYQSchema } from '../validators/academic.validator.js';

/**
 * AI Academic Assistant & Exam Intelligence Routes (`/api/ai`)
 * Houses endpoints for conversational syllabus tutoring, multimodal document explanation,
 * and 16-point historical PYQ pattern analysis.
 */
const router = Router();

// Interactive academic tutor chat with multimodal attachment support
router.post('/chat', requireAuth, validate(aiChatSchema), AIController.chat);

// Historical PYQ frequency and unit-wise marks distribution pattern analysis
router.post('/analyze-pyq', validate(aiAnalyzePYQSchema), AIController.analyzePYQ);

// Retrieve persistent chat conversation history for the authenticated student
router.get('/conversations', requireAuth, AIController.getConversations);

export default router;
